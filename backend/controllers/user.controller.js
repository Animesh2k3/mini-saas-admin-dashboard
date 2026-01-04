const logAudit = require("../utils/auditLogger");
const pool = require("../config/db");

/**
 * GET LOGGED-IN USER PROFILE
 * Used to hydrate frontend session (Navbar, profile, etc.)
 */
exports.getMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar_url,
        r.name AS role
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1
      `,
      [req.user.id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getMe:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL USERS (Admin only)
 * Supports search + pagination + filters
 */
exports.getUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      role = "",
      status = "",
    } = req.query;

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];
    let paramCount = 1;

    // Search by email or name
    if (search) {
      whereConditions.push(
        `(u.email ILIKE $${paramCount} OR u.name ILIKE $${paramCount})`
      );
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Filter by role
    if (role) {
      whereConditions.push(`r.name = $${paramCount}`);
      queryParams.push(role);
      paramCount++;
    }

    // Filter by status
    if (status) {
      const isActive = status === "active";
      whereConditions.push(`u.is_active = $${paramCount}`);
      queryParams.push(isActive);
      paramCount++;
    }

    const whereClause =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    const usersQuery = `
      SELECT 
        u.id,
        u.name,
        u.email,
        u.avatar_url,
        u.is_active,
        r.name AS role,
        u.created_at
      FROM users u
      JOIN roles r ON r.id = u.role_id
      ${whereClause}
      ORDER BY u.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;

    queryParams.push(limit, offset);

    const users = await pool.query(usersQuery, queryParams);

    const countQuery = `
      SELECT COUNT(*) 
      FROM users u
      JOIN roles r ON r.id = u.role_id
      ${whereClause}
    `;

    const countParams = queryParams.slice(0, -2);
    const count = await pool.query(countQuery, countParams);

    return res.json({
      data: users.rows,
      total: parseInt(count.rows[0].count, 10),
      page: parseInt(page, 10),
      totalPages: Math.ceil(
        parseInt(count.rows[0].count, 10) / limit
      ),
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET SINGLE USER BY ID
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        u.id,
        u.name,
        u.avatar_url,
        u.email,
        u.is_active,
        r.name AS role,
        u.created_at
      FROM users u
      JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE USER (Name and Email)
 */
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;

    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND id != $2",
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    await pool.query(
      "UPDATE users SET name = $1, email = $2 WHERE id = $3",
      [name, email, id]
    );

    // Log audit after successful update
    await logAudit({
      userId: req.user.id,
      action: "UPDATE_USER",
      entity: "users",
      entityId: id,
      description: `Updated user ${email}`,
    });

    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE USER
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (parseInt(id, 10) === req.user.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log audit after successful delete
    await logAudit({
      userId: req.user.id,
      action: "DELETE_USER",
      entity: "users",
      entityId: id,
      description: `Deleted user with ID ${id}`,
    });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE USER STATUS (Activate / Deactivate)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;

    await pool.query("UPDATE users SET is_active = $1 WHERE id = $2", [
      is_active,
      id,
    ]);

    // Log audit after successful status change
    await logAudit({
      userId: req.user.id,
      action: "CHANGE_STATUS",
      entity: "users",
      entityId: id,
      description: `User status set to ${is_active ? "active" : "inactive"}`,
    });

    return res.json({ message: "User status updated" });
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE USER ROLE
 */
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const roleRes = await pool.query(
      "SELECT id FROM roles WHERE name = $1",
      [role]
    );

    if (!roleRes.rows.length) {
      return res.status(400).json({ message: "Invalid role" });
    }

    await pool.query("UPDATE users SET role_id = $1 WHERE id = $2", [
      roleRes.rows[0].id,
      id,
    ]);

    // Log audit after successful role change
    await logAudit({
      userId: req.user.id,
      action: "CHANGE_ROLE",
      entity: "users",
      entityId: id,
      description: `Changed role of user ${id} to ${role}`,
    });

    return res.json({ message: "User role updated" });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res.status(500).json({ message: "Server error" });
  }
};