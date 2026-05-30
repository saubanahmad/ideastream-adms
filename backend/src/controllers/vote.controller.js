/**
 * src/controllers/vote.controller.js — Vote Controller
 * Implementation: Phase 3
 */

const Post = require("../models/Post");

const castVote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const userId = String(req.user.userId);
    const username = req.user.username;

    if (!["upvote", "downvote"].includes(type)) {
      return res.status(400).json({ status: "error", message: "Invalid vote type" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ status: "error", message: "Post not found" });
    }

    // Find if user already voted
    const existingVoteIndex = post.votes.findIndex((v) => v.userId === userId);
    let newScore = post.score;
    let newUpvotes = post.upvoteCount;
    let newDownvotes = post.downvoteCount;

    if (existingVoteIndex !== -1) {
      const existingVote = post.votes[existingVoteIndex];
      
      if (existingVote.type === type) {
        // Toggle (remove) vote
        post.votes.splice(existingVoteIndex, 1);
        if (type === "upvote") {
          newUpvotes--;
          newScore--;
        } else {
          newDownvotes--;
          newScore++;
        }
      } else {
        // Switch vote
        post.votes[existingVoteIndex].type = type;
        if (type === "upvote") {
          newUpvotes++;
          newDownvotes--;
          newScore += 2;
        } else {
          newDownvotes++;
          newUpvotes--;
          newScore -= 2;
        }
      }
    } else {
      // New vote
      post.votes.push({ userId, username, type });
      if (type === "upvote") {
        newUpvotes++;
        newScore++;
      } else {
        newDownvotes++;
        newScore--;
      }
    }

    post.score = newScore;
    post.upvoteCount = newUpvotes;
    post.downvoteCount = newDownvotes;
    await post.save();

    res.status(200).json({ 
      status: "success", 
      data: {
        score: post.score,
        upvoteCount: post.upvoteCount,
        downvoteCount: post.downvoteCount,
        userVote: post.votes.find((v) => v.userId === userId)?.type || null
      }
    });
  } catch (err) { 
    if (err.message.includes("MONGO_URI missing")) {
      return res.status(503).json({ status: "error", message: "Database temporarily unavailable" });
    }
    next(err); 
  }
};

module.exports = { castVote };
