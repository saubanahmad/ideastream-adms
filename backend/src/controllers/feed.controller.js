/**
 * src/controllers/feed.controller.js — Feed Controller
 * Implementation: Phase 3
 */

const feedService = require("../services/feed.service");

const getFeed = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getFeed — coming in Phase 3" });
  } catch (err) { next(err); }
};

const searchPosts = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "searchPosts — coming in Phase 3" });
  } catch (err) { next(err); }
};

module.exports = { getFeed, searchPosts };
