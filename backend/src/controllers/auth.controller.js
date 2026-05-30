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
    const { username, email, fullName, password } = req.body;
    if (!username || !email || !fullName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const result = await authService.register({ username, email, fullName, password });
    res.status(201).json(result);
  } catch (err) {
    if (err.message.includes("already exists")) {
      return res.status(400).json({ message: err.message });
    }
    next(err); // Pass error to global error handler
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    
    const result = await authService.login({ email, password });
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Invalid email or password") {
      return res.status(401).json({ message: err.message });
    }
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware (contains userId and username)
    const user = await authService.getMe(req.user.userId);
    res.status(200).json({ user });
  } catch (err) {
    if (err.message === "User not found") {
      return res.status(404).json({ message: err.message });
    }
    next(err);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const { username, fullName, bio } = req.body;
    const result = await authService.updateMe(req.user.userId, { username, fullName, bio });
    res.status(200).json(result);
  } catch (err) {
    if (err.message === "Username already exists") {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
};

module.exports = { register, login, getMe, updateMe };
