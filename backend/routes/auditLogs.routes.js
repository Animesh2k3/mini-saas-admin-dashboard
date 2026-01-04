const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const auditController = require("../controllers/auditLogs.controller");

router.get("/", auth, auditController.getAuditLogs);

module.exports = router;
