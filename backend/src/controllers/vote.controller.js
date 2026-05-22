/**
 * src/controllers/vote.controller.js — Vote Controller
 * Implementation: Phase 3
 */

const castVote = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "castVote — coming in Phase 3" });
  } catch (err) { next(err); }
};

module.exports = { castVote };
