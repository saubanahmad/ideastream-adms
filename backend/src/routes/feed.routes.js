/**
 * src/routes/feed.routes.js — Feed / Platform Routes
 *
 * Returns lists of posts for the main feeds.
 * All feed routes are PUBLIC — users don't need to log in to browse.
 *
 * Feed types:
 *   - latest   : newest posts first (sorted by createdAt DESC)
 *   - trending : highest score first (sorted by score DESC)
 *
 * Platform filter:
 *   - ?platform=Cultivate  → only Cultivate posts
 *   - (no platform param)  → all posts (IdeaStream global feed)
 *
 * Endpoints:
 *   GET /api/feed              — Global feed (latest by default)
 *   GET /api/feed?type=trending            — Global trending
 *   GET /api/feed?platform=Cultivate       — Platform latest
 *   GET /api/feed?platform=Cultivate&type=trending — Platform trending
 *   GET /api/feed/search?q=keyword         — Full-text search
 *
 * Implementation: Phase 3
 */

const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feed.controller");

router.get("/", feedController.getFeed);
router.get("/search", feedController.searchPosts);

module.exports = router;
