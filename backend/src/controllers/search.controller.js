const followService = require("../services/follow.service");
const postService = require("../services/post.service");

const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    console.log("Global search endpoint hit with q:", q);

    if (!q || !q.trim()) {
      return res.json({ status: "success", data: { users: [], posts: [] } });
    }

    const userId = req.user.userId;

    // Run searches concurrently
    const [users, posts] = await Promise.all([
      followService.searchUsers(q, userId),
      postService.searchPosts(q)
    ]);

    console.log(`Global search results: ${users.length} users, ${posts.length} posts`);

    res.json({ 
      status: "success", 
      data: {
        users,
        posts
      } 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { globalSearch };
