/**
 * src/controllers/comment.controller.js — Comment Controller
 * Implementation: Phase 3
 */

const addComment = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "addComment — coming in Phase 3" });
  } catch (err) { next(err); }
};

const deleteComment = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "deleteComment — coming in Phase 3" });
  } catch (err) { next(err); }
};

module.exports = { addComment, deleteComment };
