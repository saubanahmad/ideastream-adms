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
    const { id, commentId } = req.params;
    const userId = String(req.user.userId);
    const username = req.user.username;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ status: "error", message: "Comment not found" });
    }

    if (comment.authorId !== userId && comment.authorUsername !== username) {
      return res.status(403).json({ status: "error", message: "Not authorized to delete this comment" });
    }

    post.comments.pull(commentId);
    await post.save();

    res.status(200).json({ 
      status: "success", 
      message: "Comment deleted successfully",
      commentCount: post.comments.length 
    });
  } catch (err) { next(err); }
};

module.exports = { addComment, deleteComment };
