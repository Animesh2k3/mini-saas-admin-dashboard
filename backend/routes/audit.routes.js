const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/audit.controller");

router.get("/", auth, role("admin"), controller.getAuditLogs);

module.exports = router;
