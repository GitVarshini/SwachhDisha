const { pool } = require('../config/db');
const { generateReportId, generateUpdateId } = require('../utils/idGenerator');

// Helper to format report object to match TypeScript WasteReport interface
function formatReport(row) {
  if (!row) return null;
  return {
    id: row.id,
    category: row.category,
    severity: row.severity,
    description: row.description,
    address: row.address,
    ward: row.ward,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    photoUrl: row.photo_url || undefined,
    status: row.status,
    isAnonymous: Boolean(row.is_anonymous),
    reporterId: row.reporter_id || undefined,
    reporterName: row.reporter_name || undefined,
    reporterContact: row.reporter_contact || undefined,
    createdAt: new Date(row.created_at).toISOString(),
    updatedAt: new Date(row.updated_at).toISOString(),
  };
}

// Helper to format timeline row
function formatTimeline(row) {
  if (!row) return null;
  return {
    id: row.id,
    reportId: row.report_id,
    status: row.status,
    message: row.message,
    updatedBy: row.updated_by,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

/**
 * GET /api/reports
 */
async function getAll(req, res) {
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
    console.error('Error fetching reports:', error);
    return res.status(500).json({ message: 'Failed to retrieve reports.', error: error.message });
  }
}

/**
 * GET /api/reports/:id
 */
async function getById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM waste_reports WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: `Report with ID ${id} not found.` });
    }

    return res.json(formatReport(rows[0]));
  } catch (error) {
    console.error('Error fetching report by ID:', error);
    return res.status(500).json({ message: 'Failed to retrieve report.', error: error.message });
  }
}

/**
 * GET /api/reports/my
 */
async function getMyReports(req, res) {
  try {
    const targetUserId = req.query.userId || (req.user ? req.user.id : 'usr_cit_01');

    const [rows] = await pool.query(
      'SELECT * FROM waste_reports WHERE reporter_id = ? OR reporter_id IS NULL ORDER BY created_at DESC',
      [targetUserId]
    );

    return res.json(rows.map(formatReport));
  } catch (error) {
    console.error('Error fetching citizen reports:', error);
    return res.status(500).json({ message: 'Failed to retrieve citizen reports.', error: error.message });
  }
}

/**
 * POST /api/reports
 */
async function create(req, res) {
  const connection = await pool.getConnection();
  try {
    const {
      category,
      severity,
      description,
      address,
      ward,
      latitude,
      longitude,
      photoUrl,
      isAnonymous,
      reporterName,
      reporterContact,
    } = req.body;

    if (!description || description.trim().length < 10) {
      return res.status(400).json({ message: 'Description must be at least 10 characters.' });
    }

    if (!address || !ward) {
      return res.status(400).json({ message: 'Address and ward are required.' });
    }

    // Determine photo URL: either uploaded file or body URL/dataURL
    let finalPhotoUrl = photoUrl || null;
    if (req.file) {
      finalPhotoUrl = `/uploads/${req.file.filename}`;
    }

    const anon = String(isAnonymous) === 'true' || isAnonymous === true;
    let reporterId = null;
    if (!anon) {
      if (req.user && req.user.id) {
        reporterId = req.user.id;
      } else {
        const [defaultUser] = await connection.query('SELECT id FROM users WHERE id = ?', ['usr_cit_01']);
        if (defaultUser.length > 0) {
          reporterId = 'usr_cit_01';
        }
      }
    }
    const finalReporterName = anon ? null : (reporterName || (req.user ? req.user.name : 'Citizen'));
    const finalReporterContact = anon ? null : (reporterContact || null);

    await connection.beginTransaction();

    const reportId = await generateReportId(connection);
    const now = new Date();

    const insertSql = `
      INSERT INTO waste_reports (
        id, category, severity, description, address, ward, latitude, longitude,
        photo_url, status, is_anonymous, reporter_id, reporter_name, reporter_contact,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'PENDING', ?, ?, ?, ?, ?, ?)
    `;

    await connection.query(insertSql, [
      reportId,
      category || 'plastic',
      severity || 'MEDIUM',
      description.trim(),
      address.trim(),
      ward,
      parseFloat(latitude) || 17.385,
      parseFloat(longitude) || 78.4867,
      finalPhotoUrl,
      anon,
      reporterId,
      finalReporterName,
      finalReporterContact,
      now,
      now,
    ]);

    // Initial timeline record
    const updateId = generateUpdateId(reportId, 1);
    const timelineSql = `
      INSERT INTO report_updates (id, report_id, status, message, updated_by, created_at)
      VALUES (?, ?, 'PENDING', ?, 'Citizen Dispatch Portal', ?)
    `;

    const timelineMsg = `Issue reported by citizen (${anon ? 'Anonymous' : finalReporterName || 'Citizen'}). Queued for municipal review.`;
    await connection.query(timelineSql, [updateId, reportId, timelineMsg, now]);

    await connection.commit();

    const [createdRows] = await pool.query('SELECT * FROM waste_reports WHERE id = ?', [reportId]);
    return res.status(201).json(formatReport(createdRows[0]));
  } catch (error) {
    await connection.rollback();
    console.error('Error creating report:', error);
    return res.status(500).json({ message: 'Failed to create waste report.', error: error.message });
  } finally {
    connection.release();
  }
}

/**
 * GET /api/reports/:id/timeline
 */
async function getTimeline(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM report_updates WHERE report_id = ? ORDER BY created_at ASC',
      [id]
    );

    return res.json(rows.map(formatTimeline));
  } catch (error) {
    console.error('Error fetching report timeline:', error);
    return res.status(500).json({ message: 'Failed to retrieve timeline.', error: error.message });
  }
}

/**
 * PATCH /api/reports/:id/status
 */
async function updateStatus(req, res) {
  const connection = await pool.getConnection();
  try {
    const { id } = req.params;
    const { status, message, updatedBy } = req.body;

    if (!status) {
      return res.status(400).json({ message: 'Status is required.' });
    }

    const [existing] = await connection.query('SELECT * FROM waste_reports WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ message: `Report with ID ${id} not found.` });
    }

    await connection.beginTransaction();

    const now = new Date();
    await connection.query(
      'UPDATE waste_reports SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, id]
    );

    // Count updates for sequence
    const [countRows] = await connection.query(
      'SELECT COUNT(*) as cnt FROM report_updates WHERE report_id = ?',
      [id]
    );
    const seq = (countRows[0].cnt || 0) + 1;
    const updateId = generateUpdateId(id, seq);

    const logMessage = message || `Status officially transitioned to ${status}`;
    const logger = updatedBy || (req.user ? req.user.name : 'Municipal Operations Officer');

    await connection.query(
      'INSERT INTO report_updates (id, report_id, status, message, updated_by, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [updateId, id, status, logMessage, logger, now]
    );

    await connection.commit();

    const [updatedRows] = await pool.query('SELECT * FROM waste_reports WHERE id = ?', [id]);
    return res.json(formatReport(updatedRows[0]));
  } catch (error) {
    await connection.rollback();
    console.error('Error updating report status:', error);
    return res.status(500).json({ message: 'Failed to update report status.', error: error.message });
  } finally {
    connection.release();
  }
}

module.exports = {
  getAll,
  getById,
  getMyReports,
  create,
  getTimeline,
  updateStatus,
  formatReport,
  formatTimeline,
};
