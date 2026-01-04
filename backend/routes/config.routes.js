const router = require("express").Router();

const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/config.controller");

// Admin-only routes
router.get("/", auth, role("admin"), controller.getConfigs);
router.get("/categories", auth, role("admin"), controller.getCategories);
router.get("/:id", auth, role("admin"), controller.getConfigById);
router.post("/", auth, role("admin"), controller.createConfig);
router.put("/:id", auth, role("admin"), controller.updateConfig);
router.patch("/:id/toggle", auth, role("admin"), controller.toggleConfigStatus);
router.delete("/:id", auth, role("admin"), controller.deleteConfig);

module.exports = router;