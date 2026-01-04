const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const controller = require("../controllers/file.controller");

router.post("/upload", auth, upload.single("file"), controller.uploadFile);

module.exports = router;
