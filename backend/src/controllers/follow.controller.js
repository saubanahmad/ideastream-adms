/**
 * src/controllers/follow.controller.js — Follow Controller
 * Implementation: Phase 4
 */

const followService = require("../services/follow.service");

const followUser = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "followUser — coming in Phase 4" });
  } catch (err) { next(err); }
};

const unfollowUser = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "unfollowUser — coming in Phase 4" });
  } catch (err) { next(err); }
};

const getFollowers = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getFollowers — coming in Phase 4" });
  } catch (err) { next(err); }
};

const getFollowing = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getFollowing — coming in Phase 4" });
  } catch (err) { next(err); }
};

const getSuggestions = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getSuggestions — coming in Phase 4" });
  } catch (err) { next(err); }
};

const getMutualFollows = async (req, res, next) => {
  try {
    res.status(501).json({ status: "pending", message: "getMutualFollows — coming in Phase 4" });
  } catch (err) { next(err); }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing, getSuggestions, getMutualFollows };
