/**
 * src/models/Post.js — MongoDB Post schema via Mongoose
 *
 * This defines the structure of a "Post" document in MongoDB.
 *
 * Key design decisions for ADMS:
 *
 * 1. EMBEDDED COMMENTS — Comments are stored as an array INSIDE the post document.
 *    This is different from SQL where comments would be a separate table with a foreign key.
 *    MongoDB's document model is perfect for this — you fetch the post and get all
 *    its comments in one read, no JOIN needed.
 *
 * 2. EMBEDDED VOTES — Similarly, the votes array tracks who voted and how.
 *    This allows us to:
 *      a. Show the total upvote/downvote count
 *      b. Know if the current user already voted (to toggle)
 *      c. Prevent double voting
 *
 * 3. SCORE FIELD — Maintained as upvotes - downvotes for efficient sorting.
 *    Without this, MongoDB would need to compute score on every query.
 *    The `score` field is indexed for fast trending feed queries.
 *
 * 4. FEED FIELD — Every post belongs to one of the 9 feeds/platforms.
 *    Filtering by feed (e.g., "show only Cultivate posts") is a simple
 *    { feed: "Cultivate" } query on this indexed field.
 */

const mongoose = require("mongoose");
const { FEEDS, FEED_LIST, VOTE_TYPES } = require("../utils/constants");

// ─────────────────────────────────────────────
// Comment Sub-schema (embedded inside Post)
// ─────────────────────────────────────────────
const CommentSchema = new mongoose.Schema(
  {
    authorId: {
      type: String, // PostgreSQL user ID (stored as string for cross-DB reference)
      required: true,
    },
    authorUsername: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt to each comment
  }
);

// ─────────────────────────────────────────────
// Vote Sub-schema (embedded inside Post)
// ─────────────────────────────────────────────
const VoteSchema = new mongoose.Schema({
  userId: {
    type: String, // PostgreSQL user ID
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: Object.values(VOTE_TYPES), // Only "upvote" or "downvote" allowed
    required: true,
  },
});

// ─────────────────────────────────────────────
// Main Post Schema
// ─────────────────────────────────────────────
const PostSchema = new mongoose.Schema(
  {
    // Who wrote this post (from PostgreSQL)
    authorId: {
      type: String,
      required: true,
    },
    authorUsername: {
      type: String,
      required: true,
      trim: true,
    },

    // Post content
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
      maxlength: [5000, "Post content cannot exceed 5000 characters"],
    },
    imageUrl: {
      type: String,
      default: null,
    },

    // Which of the 9 feeds this post belongs to
    feed: {
      type: String,
      enum: FEED_LIST,
      default: FEEDS.IDEA_STREAM,
    },

    // Embedded arrays (no separate collections needed)
    comments: [CommentSchema],
    votes: [VoteSchema],

    // Computed fields — updated whenever a vote is cast
    // Stored for efficient sorting (trending feed)
    upvoteCount: { type: Number, default: 0 },
    downvoteCount: { type: Number, default: 0 },
    score: { type: Number, default: 0, index: true }, // Indexed for sort performance
  },
  {
    timestamps: true, // Adds createdAt (for FIFO sorting) and updatedAt
  }
);

// ─────────────────────────────────────────────
// Indexes — for query performance
// ─────────────────────────────────────────────
PostSchema.index({ feed: 1, createdAt: -1 }); // Latest feed per platform
PostSchema.index({ feed: 1, score: -1 });      // Trending feed per platform
PostSchema.index({ createdAt: -1 });           // Global latest feed
PostSchema.index({ score: -1 });               // Global trending feed
PostSchema.index({ 
  title: "text", 
  content: "text",
  authorUsername: "text",
  feed: "text"
}); // Full-text search

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
