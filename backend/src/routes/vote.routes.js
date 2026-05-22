/**
 * src/routes/vote.routes.js — Voting Routes
 *
 * Handles upvoting and downvoting posts.
 * Votes are embedded inside the Post document in MongoDB.
 *
 * The vote logic supports:
 *   - Upvoting / downvoting a post
 *   - Toggling (click upvote again → removes your vote)
 *   - Switching (click downvote if you upvoted → changes your vote)
 *
 * Endpoints:
 *   POST /api/posts/:id/vote  — Cast or toggle a vote (protected)
 *                               Body: { type: "upvote" | "downvote" }
 *
 * Implementation: Phase 3
 */

const express = require("express");
const router = express.Router();
const voteController = require("../controllers/vote.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:id/vote", protect, voteController.castVote);

module.exports = router;
