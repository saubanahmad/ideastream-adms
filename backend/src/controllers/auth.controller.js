/**
 * src/controllers/auth.controller.js — Authentication Controller
 *
 * Controllers receive the HTTP request, call the appropriate service,
 * and return the HTTP response. They should NOT contain business logic —
 * that belongs in the service layer.
 *
 * Implementation: Phase 2
 */

const authService = require("../services/auth.service");

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    // TODO Phase 2: Implement registration
    // 1. Extract { username, email, fullName, password } from req.body
    // 2. Call authService.register(...)
    // 3. Return created user + JWT
    res.status(501).json({ status: "pending", message: "register — coming in Phase 2" });
  } catch (err) {
    next(err); // Pass error to global error handler
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    // TODO Phase 2: Implement login
    res.status(501).json({ status: "pending", message: "login — coming in Phase 2" });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    // TODO Phase 2: Return current user from req.user (set by auth middleware)
    res.status(501).json({ status: "pending", message: "getMe — coming in Phase 2" });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
