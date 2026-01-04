const pool = require("../config/db");

/**
 * Create an audit log entry
 */
const logAudit = async ({
  userId,
  action,
  entity,
  entityId = null,
  description = "",
}) => {
  console.log("=== AUDIT LOG ATTEMPT ===");
  console.log("📥 Input params:", { userId, action, entity, entityId, description });
  
  try {
    const query = `
      INSERT INTO audit_logs 
      (user_id, action, entity, entity_id, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [userId, action, entity, entityId, description];
    
    console.log("📤 SQL Query:", query);
    console.log("📤 Values:", values);
    
    const result = await pool.query(query, values);
    
    console.log("✅ Audit log created successfully!");
    console.log("📋 Inserted row:", result.rows[0]);
    console.log("=========================\n");
    
    return result.rows[0];
  } catch (error) {
    console.error("❌ AUDIT LOG FAILED!");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.log("=========================\n");
  }
};

module.exports = logAudit;