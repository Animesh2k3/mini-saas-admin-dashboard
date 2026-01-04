const logAudit = require("../utils/auditLogger");
const pool = require("../config/db");


/**
 * GET ALL CONFIGURATIONS (Admin only)
 * Supports search + category filter
 */
exports.getConfigs = async (req, res) => {
  try {
    const { search = "", category = "" } = req.query;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    // Search by config_key
    if (search) {
      whereConditions.push(`config_key ILIKE $${paramCount}`);
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Filter by category
    if (category) {
      whereConditions.push(`category = $${paramCount}`);
      queryParams.push(category);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const configs = await pool.query(
      `
      SELECT 
        id,
        config_key,
        config_value,
        category,
        is_enabled,
        created_at
      FROM configurations
      ${whereClause}
      ORDER BY category ASC, config_key ASC
      `,
      queryParams
    );

    res.json({
      data: configs.rows,
      total: configs.rows.length,
    });
  } catch (error) {
    console.error("Error in getConfigs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET SINGLE CONFIGURATION BY ID
 */
exports.getConfigById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM configurations WHERE id = $1",
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "Configuration not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getConfigById:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL CATEGORIES
 */
exports.getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT DISTINCT category FROM configurations ORDER BY category ASC"
    );

    const categories = result.rows.map((row) => row.category);
    res.json({ categories });
  } catch (error) {
    console.error("Error in getCategories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * CREATE NEW CONFIGURATION
 */
exports.createConfig = async (req, res) => {
  try {
    const { config_key, config_value, category, is_enabled } = req.body;

    // Check if config_key already exists
    const existing = await pool.query(
      "SELECT id FROM configurations WHERE config_key = $1",
      [config_key]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Configuration key already exists" });
    }

    const result = await pool.query(
      `INSERT INTO configurations (config_key, config_value, category, is_enabled) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [config_key, config_value, category || "general", is_enabled !== false]
    );

    await logAudit({
      userId: req.user.id,
      action: "CREATE",
      entity: "configurations",
      entityId: result.rows[0].id,
      description: `Created config ${config_key}`,
    });

    res.status(201).json({
      message: "Configuration created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in createConfig:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE CONFIGURATION
 */
exports.updateConfig = async (req, res) => {
  try {
    const { id } = req.params;
    const { config_key, config_value, category, is_enabled } = req.body;

    // Check if config_key exists for another record
    const existing = await pool.query(
      "SELECT id FROM configurations WHERE config_key = $1 AND id != $2",
      [config_key, id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Configuration key already exists" });
    }

    const result = await pool.query(
      `UPDATE configurations 
       SET config_key = $1, config_value = $2, category = $3, is_enabled = $4
       WHERE id = $5
       RETURNING *`,
      [config_key, config_value, category, is_enabled, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Configuration not found" });
    }

    await logAudit({
      userId: req.user.id,
      action: "UPDATE",
      entity: "configurations",
      entityId: id,
      description: `Updated config ${config_key}`,
    });

    res.json({
      message: "Configuration updated successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in updateConfig:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * TOGGLE CONFIGURATION STATUS
 */
exports.toggleConfigStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_enabled } = req.body;

    await pool.query(
      "UPDATE configurations SET is_enabled = $1 WHERE id = $2",
      [is_enabled, id]
    );

    await logAudit({
      userId: req.user.id,
      action: "UPDATE",
      entity: "configurations",
      entityId: id,
      description: `Toggled config status`,
    });

    res.json({ message: "Configuration status updated" });
  } catch (error) {
    console.error("Error in toggleConfigStatus:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE CONFIGURATION
 */
exports.deleteConfig = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM configurations WHERE id = $1",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Configuration not found" });
    }

    await logAudit({
      userId: req.user.id,
      action: "DELETE",
      entity: "configurations",
      entityId: id,
      description: `Deleted configuration`,
    });

    res.json({ message: "Configuration deleted successfully" });
  } catch (error) {
    console.error("Error in deleteConfig:", error);
    res.status(500).json({ message: "Server error" });
  }
};