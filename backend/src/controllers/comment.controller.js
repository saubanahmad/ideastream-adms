/**
 * src/controllers/comment.controller.js — Comment Controller
 * Implementation: Phase 3
 */

const Post = require("../models/Post");

const addComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = String(req.user.userId);
    const username = req.user.username;

    if (!content || !content.trim()) {
      return res.status(400).json({ status: "error", message: "Comment content is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    const newComment = {
      authorId: userId,
      authorUsername: username,
      content: content.trim()
    };

    post.comments.push(newComment);
    await post.save();

    const savedComment = post.comments[post.comments.length - 1];

    res.status(201).json({ 
      status: "success", 
      data: savedComment,
      commentCount: post.comments.length
    });
  } catch (err) { 
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err); 
  }
};

const deleteComment = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "deleteComment — coming in Phase 3" });
  } catch (err) { next(err); }
};

module.exports = { addComment, deleteComment };
