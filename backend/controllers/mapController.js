const { pool } = require('../config/db');
const { formatReport } = require('./reportController');

/**
 * GET /api/map/reports
 * Returns spatial waste reports with optional status, category, severity filters
 */
async function getReports(req, res) {
  try {
    const { status, category, severity } = req.query;

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

    query += ' ORDER BY created_at DESC';

    const [rows] = await pool.query(query, params);
    return res.json(rows.map(formatReport));
  } catch (error) {
    console.error('Error in map getReports:', error);
    return res.status(500).json({ message: 'Failed to retrieve map markers.', error: error.message });
  }
}

/**
 * GET /api/map/hotspots
 * Returns high-risk hotspot zones for spatial circle overlays
 */
async function getHotspots(req, res) {
  try {
    const [rows] = await pool.query('SELECT * FROM hotspot_areas ORDER BY report_count DESC');

    const formatted = rows.map((row) => ({
      id: row.id,
      name: row.name,
      ward: row.ward,
      reportCount: Number(row.report_count),
      severity: row.severity,
      commonCategory: row.common_category,
      lastReportedAt: new Date(row.last_reported_at).toISOString(),
      latitude: parseFloat(row.latitude),
      longitude: parseFloat(row.longitude),
      description: row.description,
      resolutionRate: Number(row.resolution_rate),
    }));

    return res.json(formatted);
  } catch (error) {
    console.error('Error in map getHotspots:', error);
    return res.status(500).json({ message: 'Failed to retrieve hotspots.', error: error.message });
  }
}

module.exports = {
  getReports,
  getHotspots,
};
