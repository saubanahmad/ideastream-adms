/**
 * src/routes/post.routes.js — Post CRUD Routes
 */
const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/", protect, upload.single('image'), postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.put("/:id", protect, postController.updatePost);
router.delete("/:id", protect, postController.deletePost);

module.exports = router;
