const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { protect } = require("../middleware/auth.middleware");

// GET /api/users/search?q=keyword
router.get("/search", protect, userController.searchUsers);

// GET /api/users/suggestions
router.get("/suggestions", protect, userController.getSuggestions);

// GET /api/users/:id/social-counts
router.get("/:id/social-counts", userController.getSocialCounts);

// GET /api/users/:id/followers
router.get("/:id/followers", userController.getFollowers);

// GET /api/users/:id/following
router.get("/:id/following", userController.getFollowing);

// POST /api/users/:id/follow
router.post("/:id/follow", protect, userController.followUser);

// DELETE /api/users/:id/follow
router.delete("/:id/follow", protect, userController.unfollowUser);

module.exports = router;
