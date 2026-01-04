const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/avatar.controller");

router.post(
  "/upload",
  auth,
  upload.single("avatar"),
  controller.uploadAvatar
);

module.exports = router;
