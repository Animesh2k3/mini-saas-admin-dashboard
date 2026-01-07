const router = require("express").Router();
const express = require("express");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const controller = require("../controllers/user.controller");

console.log("controller:", controller);

// Logged-in user profile
router.get("/me", auth, controller.getMe);

// Admin-only routes
router.get("/", auth, role("admin"), controller.getUsers);
router.get("/:id", auth, role("admin"), controller.getUserById);
router.patch("/:id", auth, role("admin"), controller.updateUser);
router.put("/:id/status", auth, role("admin"), controller.updateUserStatus);
router.patch("/:id/role", auth, role("admin"), controller.updateUserRole);
router.delete("/:id", auth, role("admin"), controller.deleteUser);

module.exports = router;