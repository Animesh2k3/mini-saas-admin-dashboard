const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/dashboard.controller");

// Admin-only dashboard stats
router.get("/stats", auth, role("admin"), controller.getDashboardStats);

module.exports = router;