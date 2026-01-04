const pool = require("../config/db");

exports.getAuditLogs = async (req, res) => {
  try {
    const { entity = "", user = "" } = req.query;

    let conditions = [];
    let params = [];
    let idx = 1;

    if (entity) {
      conditions.push(`a.entity = $${idx}`);
      params.push(entity);
      idx++;
    }

    if (user) {
      conditions.push(`u.email ILIKE $${idx}`);
      params.push(`%${user}%`);
      idx++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const logs = await pool.query(
      `
      SELECT 
        a.id,
        a.action,
        a.entity,
        a.description,
        a.created_at,
        u.email AS performed_by
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.user_id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT 100
      `,
      params
    );

    res.json({ data: logs.rows });
  } catch (error) {
    console.error("Error fetching audit logs:", error);
    res.status(500).json({ message: "Server error" });
  }
};
