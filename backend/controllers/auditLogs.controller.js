const pool = require("../config/db");

exports.getAuditLogs = async (req, res) => {
  try {
    console.log("🔍 getAuditLogs called");
    console.log("Query params:", req.query);

    // ✅ FIXED: Changed 'user' to 'userEmail' to match frontend
    const { entity = "", userEmail = "" } = req.query;

    let conditions = [];
    let params = [];
    let count = 1;

    if (entity && entity !== "All" && entity !== "") {
      conditions.push(`a.entity = $${count++}`);
      params.push(entity);
      console.log(`Filter by entity: ${entity}`);
    }

    if (userEmail && userEmail !== "") {
      conditions.push(`u.email ILIKE $${count++}`);
      params.push(`%${userEmail}%`);
      console.log(`Filter by userEmail: ${userEmail}`);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT 
        a.id,
        a.action,
        a.entity,
        a.entity_id,
        a.description,
        a.created_at,
        u.email as performed_by
      FROM audit_logs a
      LEFT JOIN users u ON u.id = a.user_id
      ${whereClause}
      ORDER BY a.created_at DESC
    `;

    console.log("📤 Executing query:", query);
    console.log("📤 With params:", params);

    const result = await pool.query(query, params);

    console.log(`✅ Found ${result.rows.length} audit logs`);

    // ✅ FIXED: Return data in the format frontend expects { data: [...] }
    const response = {
      data: result.rows,
      total: result.rows.length,
    };

    console.log("📋 Sending response");
    
    return res.json(response);
  } catch (err) {
    console.error("❌ Audit log fetch error:", err);
    return res.status(500).json({ message: "Failed to fetch audit logs" });
  }
};