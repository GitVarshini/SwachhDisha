/**
 * Generate human-readable IDs matching frontend format
 * Examples: REP-2026-8101, upd_REP-2026-8101_1
 */

async function generateReportId(connection) {
  const currentYear = new Date().getFullYear();
  let candidateNum = 8101;

  try {
    // Find highest numeric suffix across all reports for the current year
    const [rows] = await connection.query(
      `SELECT MAX(CAST(SUBSTRING_INDEX(id, '-', -1) AS UNSIGNED)) as max_num 
       FROM waste_reports 
       WHERE id LIKE ? 
       FOR UPDATE`,
      [`REP-${currentYear}-%`]
    );

    const maxNum = rows[0]?.max_num;
    if (maxNum !== null && maxNum !== undefined && !isNaN(maxNum)) {
      candidateNum = Number(maxNum) + 1;
    }
  } catch (err) {
    console.warn('Error querying max report ID sequence:', err.message);
  }

  // Safety check: ensure candidateId is unique even if non-sequential IDs exist
  let candidateId = `REP-${currentYear}-${candidateNum}`;
  while (true) {
    const [exists] = await connection.query('SELECT id FROM waste_reports WHERE id = ?', [candidateId]);
    if (exists.length === 0) {
      break;
    }
    candidateNum++;
    candidateId = `REP-${currentYear}-${candidateNum}`;
  }

  return candidateId;
}

function generateUpdateId(reportId, sequence = 1) {
  return `upd_${reportId}_${sequence}_${Date.now().toString().slice(-4)}`;
}

module.exports = {
  generateReportId,
  generateUpdateId,
};
