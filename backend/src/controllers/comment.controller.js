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

    const newComment = {
      authorId: userId,
      authorUsername: username,
      content: content.trim()
    };

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $push: { comments: newComment } },
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    const savedComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json({ 
      status: "success", 
      data: savedComment,
      commentCount: updatedPost.comments.length
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
