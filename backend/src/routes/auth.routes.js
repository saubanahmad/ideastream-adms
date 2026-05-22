/**
 * src/routes/auth.routes.js — Authentication Routes
 *
 * Handles user registration and login.
 * These routes are PUBLIC — no JWT required.
 *
 * Endpoints:
 *   POST /api/auth/register  — Create a new account
 *   POST /api/auth/login     — Login and receive a JWT
 *   GET  /api/auth/me        — Get current logged-in user (protected)
 *
 * Implementation: Phase 2
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// GET /api/auth/me (protected — requires JWT)
router.get("/me", protect, authController.getMe);

module.exports = router;
