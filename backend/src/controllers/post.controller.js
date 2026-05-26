/**
 * src/controllers/post.controller.js — Post Controller
 */
const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    const { title, content, feed } = req.body;
    const { userId, username } = req.user; // From protect middleware

    if (!title || !content) {
      return res.status(400).json({ status: "error", message: "Title and content are required" });
    }

    const post = await postService.createPost({
      authorId: String(userId),
      authorUsername: username,
      title,
      content,
      feed,
    });

    res.status(201).json({ status: "success", data: post });
  } catch (err) {
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err);
  }
};

const getPosts = async (req, res, next) => {
  try {
    const posts = await postService.getPosts(req.query);
    res.status(200).json({ status: "success", data: posts });
  } catch (err) {
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err);
  }
};

const getPost = async (req, res, next) => {
  try {
    const post = await postService.getPostById(req.params.id);
    res.status(200).json({ status: "success", data: post });
  } catch (err) {
    if (err.message === "Post not found") {
      return res.status(404).json({ status: "error", message: err.message });
    }
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { title, content } = req.body;

    const post = await postService.updatePost(req.params.id, String(userId), { title, content });
    res.status(200).json({ status: "success", data: post });
  } catch (err) {
    if (err.message === "Post not found") {
      return res.status(404).json({ status: "error", message: err.message });
    }
    if (err.message === "Unauthorized: You can only edit your own posts") {
      return res.status(403).json({ status: "error", message: err.message });
    }
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { userId } = req.user;
    await postService.deletePost(req.params.id, String(userId));
    res.status(200).json({ status: "success", message: "Post deleted successfully" });
  } catch (err) {
    if (err.message === "Post not found") {
      return res.status(404).json({ status: "error", message: err.message });
    }
    if (err.message === "Unauthorized: You can only delete your own posts") {
      return res.status(403).json({ status: "error", message: err.message });
    }
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err);
  }
};

module.exports = { createPost, getPosts, getPost, updatePost, deletePost };
