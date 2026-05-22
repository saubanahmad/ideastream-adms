/**
 * src/routes/comment.routes.js — Comment Routes
 *
 * Comments are embedded inside Post documents in MongoDB.
 * These routes modify the comments array of a specific post.
 *
 * Endpoints:
 *   POST   /api/posts/:id/comments  — Add a comment (protected)
 *   DELETE /api/posts/:id/comments/:commentId — Delete a comment (protected)
 *
 * Note: These are mounted at /api/posts in app.js, so the full paths
 * become /api/posts/:id/comments
 *
 * Implementation: Phase 3
 */

const express = require("express");
const router = express.Router();
const commentController = require("../controllers/comment.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:id/comments", protect, commentController.addComment);
router.delete("/:id/comments/:commentId", protect, commentController.deleteComment);

module.exports = router;
