/**
 * src/routes/post.routes.js — Post CRUD Routes
 *
 * All routes that deal with creating, reading, updating,
 * and deleting posts.
 *
 * Endpoints:
 *   POST   /api/posts         — Create a new post (protected)
 *   GET    /api/posts/:id     — Get a single post by ID
 *   PUT    /api/posts/:id     — Edit a post (protected, author only)
 *   DELETE /api/posts/:id     — Delete a post (protected, author only)
 *
 * Implementation: Phase 3
 */

const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, postController.createPost);
router.get("/:id", postController.getPost);
router.put("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);

module.exports = router;
