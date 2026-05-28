const followService = require("../services/follow.service");

const followUser = async (req, res, next) => {
  try {
    await followService.followUser(req.user.userId, req.params.id);
    res.json({ status: "success", message: "User followed successfully" });
  } catch (err) {
    if (err.status) {
      res.status(err.status).json({ status: "error", message: err.message });
    } else {
      next(err);
    }
  }
};

const unfollowUser = async (req, res, next) => {
  try {
    await followService.unfollowUser(req.user.userId, req.params.id);
    res.json({ status: "success", message: "User unfollowed successfully" });
  } catch (err) {
    next(err);
  }
};

const getSocialCounts = async (req, res, next) => {
  try {
    const counts = await followService.getSocialCounts(req.params.id);
    res.json({ status: "success", data: counts });
  } catch (err) {
    next(err);
  }
};

const getSuggestions = async (req, res, next) => {
  try {
    const suggestions = await followService.getSuggestions(req.user.userId);
    res.json({ status: "success", data: suggestions });
  } catch (err) {
    next(err);
  }
};

const getFollowers = async (req, res, next) => {
  try {
    const followers = await followService.getFollowers(req.params.id);
    res.json({ status: "success", data: followers });
  } catch (err) {
    next(err);
  }
};

const getFollowing = async (req, res, next) => {
  try {
    const following = await followService.getFollowing(req.params.id);
    res.json({ status: "success", data: following });
  } catch (err) {
    next(err);
  }
};

const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    console.log("Search endpoint hit with q:", q);
    if (!q) {
      return res.json({ status: "success", data: [] });
    }
    const users = await followService.searchUsers(q, req.user.userId);
    console.log("Search results count:", users.length);
    res.json({ status: "success", data: users });
  } catch (err) {
    next(err);
  }
};

module.exports = { followUser, unfollowUser, getSocialCounts, getSuggestions, getFollowers, getFollowing, searchUsers };
