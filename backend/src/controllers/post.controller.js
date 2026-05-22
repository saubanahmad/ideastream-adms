/**
 * src/controllers/post.controller.js — Post Controller
 * Implementation: Phase 3
 */

const postService = require("../services/post.service");

const createPost = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "createPost — coming in Phase 3" });
  } catch (err) { next(err); }
};

const getPost = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getPost — coming in Phase 3" });
  } catch (err) { next(err); }
};

const updatePost = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "updatePost — coming in Phase 3" });
  } catch (err) { next(err); }
};

const deletePost = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "deletePost — coming in Phase 3" });
  } catch (err) { next(err); }
};

module.exports = { createPost, getPost, updatePost, deletePost };
