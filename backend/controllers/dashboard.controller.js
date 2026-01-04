const pool = require("../config/db");

/**
 * GET DASHBOARD STATISTICS
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // Total users
    const totalUsers = await pool.query("SELECT COUNT(*) FROM users");

    // Active users
    const activeUsers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE is_active = true"
    );

    // Inactive users
    const inactiveUsers = await pool.query(
      "SELECT COUNT(*) FROM users WHERE is_active = false"
    );

    // Users by role
    const usersByRole = await pool.query(`
      SELECT r.name as role, COUNT(u.id) as count
      FROM users u
      JOIN roles r ON r.id = u.role_id
      GROUP BY r.name
    `);

    // Recent users (last 7 days)
    const recentUsers = await pool.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as count
      FROM users
      WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    // Users created per month (last 6 months)
    const userGrowth = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon YYYY') as month,
        COUNT(*) as count
      FROM users
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 months'
      GROUP BY TO_CHAR(created_at, 'Mon YYYY'), DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `);

    res.json({
      totalUsers: parseInt(totalUsers.rows[0].count),
      activeUsers: parseInt(activeUsers.rows[0].count),
      inactiveUsers: parseInt(inactiveUsers.rows[0].count),
      usersByRole: usersByRole.rows,
      recentUsers: recentUsers.rows,
      userGrowth: userGrowth.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};