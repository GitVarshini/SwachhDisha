const { pool } = require('../config/db');
const { generateUpdateId } = require('../utils/idGenerator');
const { formatReport } = require('./reportController');

/**
 * GET /api/admin/reports
 */
async function getReports(req, res) {
  try {
    const { status, category, severity, ward, search } = req.query;

    let query = 'SELECT * FROM waste_reports WHERE 1=1';
    const params = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'all') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (severity && severity !== 'all') {
      query += ' AND severity = ?';
      params.push(severity);
    }

    if (ward && ward !== 'all') {
      query += ' AND ward = ?';
      params.push(ward);
    }

    if (search && search.trim()) {
      query += ' AND (LOWER(id) LIKE ? OR LOWER(description) LIKE ? OR LOWER(address) LIKE ? OR LOWER(ward) LIKE ?)';
      const s = `%${search.trim().toLowerCase()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return res.json(rows.map(formatReport));
  } catch (error) {
    console.error('Error in admin getReports:', error);
    return res.status(500).json({ message: 'Failed to retrieve admin reports.', error: error.message });
  }
}

/**
 * Generic internal handler for admin status transitions with transaction & timeline log
 */
async function executeStatusTransition({ reportId, expectedCurrentStatus, nextStatus, note, defaultNote, defaultOfficer, res, req }) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query('SELECT * FROM waste_reports WHERE id = ?', [reportId]);
    if (rows.length === 0) {
      connection.release();
      return res.status(404).json({ message: `Report with ID ${reportId} not found.` });
    }

    const currentReport = rows[0];

    // Enforce valid status transition
    if (expectedCurrentStatus && currentReport.status !== expectedCurrentStatus) {
      connection.release();
      return res.status(400).json({
        message: `Invalid status transition: Report ${reportId} is currently '${currentReport.status}'. Expected '${expectedCurrentStatus}' before moving to '${nextStatus}'.`,
      });
    }

    await connection.beginTransaction();

    const now = new Date();
    await connection.query(
      'UPDATE waste_reports SET status = ?, updated_at = ? WHERE id = ?',
      [nextStatus, now, reportId]
    );

    const [countRows] = await connection.query(
      'SELECT COUNT(*) as cnt FROM report_updates WHERE report_id = ?',
      [reportId]
    );
    const seq = (countRows[0].cnt || 0) + 1;
    const updateId = generateUpdateId(reportId, seq);

    const officerName = req.user ? req.user.name : defaultOfficer;
    const logNote = note || defaultNote;

    await connection.query(
      'INSERT INTO report_updates (id, report_id, status, message, updated_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [updateId, reportId, nextStatus, logNote, officerName, now]
    );

    await connection.commit();

    const [updated] = await pool.query('SELECT * FROM waste_reports WHERE id = ?', [reportId]);
    return res.json(formatReport(updated[0]));
  } catch (error) {
    await connection.rollback();
    console.error(`Error transitioning report ${reportId} to ${nextStatus}:`, error);
    return res.status(500).json({ message: `Failed to transition report status to ${nextStatus}.`, error: error.message });
  } finally {
    connection.release();
  }
}

/**
 * PATCH /api/admin/reports/:id/verify
 * Transition: PENDING -> VERIFIED
 */
async function verifyReport(req, res) {
  const { id } = req.params;
  const { note } = req.body;
  return executeStatusTransition({
    reportId: id,
    expectedCurrentStatus: 'PENDING',
    nextStatus: 'VERIFIED',
    note,
    defaultNote: 'Report officially inspected and verified on-site by Municipal Officer.',
    defaultOfficer: 'Sanitation Supervisor',
    res,
    req,
  });
}

/**
 * PATCH /api/admin/reports/:id/reject
 * Transition: PENDING -> REJECTED
 */
async function rejectReport(req, res) {
  const { id } = req.params;
  const { reason } = req.body;
  return executeStatusTransition({
    reportId: id,
    expectedCurrentStatus: 'PENDING',
    nextStatus: 'REJECTED',
    note: reason,
    defaultNote: 'Report rejected: Duplicate submission or not within municipal sanitation guidelines.',
    defaultOfficer: 'Sanitation Supervisor',
    res,
    req,
  });
}

/**
 * PATCH /api/admin/reports/:id/in-progress
 * Transition: VERIFIED -> IN_PROGRESS
 */
async function markInProgress(req, res) {
  const { id } = req.params;
  const { note } = req.body;
  return executeStatusTransition({
    reportId: id,
    expectedCurrentStatus: 'VERIFIED',
    nextStatus: 'IN_PROGRESS',
    note,
    defaultNote: 'Clean-up vehicle and field crew dispatched. Active operations underway.',
    defaultOfficer: 'Operations Dispatch Desk',
    res,
    req,
  });
}

/**
 * PATCH /api/admin/reports/:id/resolve
 * Transition: IN_PROGRESS -> RESOLVED
 */
async function resolveReport(req, res) {
  const { id } = req.params;
  const { note } = req.body;
  return executeStatusTransition({
    reportId: id,
    expectedCurrentStatus: 'IN_PROGRESS',
    nextStatus: 'RESOLVED',
    note,
    defaultNote: 'Waste cleared, area disinfected with lime powder, and verified resolved.',
    defaultOfficer: 'Field Cleansing Officer',
    res,
    req,
  });
}

module.exports = {
  getReports,
  verifyReport,
  rejectReport,
  markInProgress,
  resolveReport,
};
