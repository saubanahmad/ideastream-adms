/**
 * src/routes/follow.routes.js — Follow System Routes (Neo4j)
 *
 * This implements an Instagram-style one-directional follow system.
 * All relationship data lives in Neo4j as:
 *   (:User)-[:FOLLOWS]->(:User)
 *
 * Endpoints:
 *   POST   /api/follow/:username          — Follow a user (protected)
 *   DELETE /api/follow/:username          — Unfollow a user (protected)
 *   GET    /api/follow/followers/:username — Get followers of a user
 *   GET    /api/follow/following/:username — Get who a user follows
 *   GET    /api/follow/suggestions        — "Who to follow" recommendations (protected)
 *   GET    /api/follow/mutual/:username    — Get mutual follows (protected)
 *
 * Implementation: Phase 4
 */

const express = require("express");
const router = express.Router();
const followController = require("../controllers/follow.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/:username", protect, followController.followUser);
router.delete("/:username", protect, followController.unfollowUser);
router.get("/followers/:username", followController.getFollowers);
router.get("/following/:username", followController.getFollowing);
router.get("/suggestions", protect, followController.getSuggestions);
router.get("/mutual/:username", protect, followController.getMutualFollows);

module.exports = router;
