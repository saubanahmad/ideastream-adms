/**
 * src/models/ActivityLog.js — MongoDB Activity Log schema
 *
 * Activity logs record every significant user action in the system.
 * This is the MongoDB equivalent of the old C++ HistoryStack — but
 * instead of being in-memory and per-user, it's persisted in MongoDB
 * and queryable for analytics.
 *
 * ADMS Note: This demonstrates MongoDB's suitability for:
 *   - Append-only log data (write-heavy, rarely updated)
 *   - Flexible schema (different action types have different metadata)
 *   - Time-series data (sorted by timestamp)
 *
 * Example documents:
 *   { userId: "1", action: "CREATE_POST", metadata: { postId: "abc123" } }
 *   { userId: "1", action: "VOTE", metadata: { postId: "abc123", type: "upvote" } }
 *   { userId: "2", action: "FOLLOW", metadata: { targetUsername: "alice" } }
 */

const mongoose = require("mongoose");

// Allowed action types — keeps logs consistent and queryable
const ACTION_TYPES = {
  CREATE_POST: "CREATE_POST",
  DELETE_POST: "DELETE_POST",
  EDIT_POST: "EDIT_POST",
  VOTE: "VOTE",
  UNVOTE: "UNVOTE",
  COMMENT: "COMMENT",
  FOLLOW: "FOLLOW",
  UNFOLLOW: "UNFOLLOW",
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
};

const ActivityLogSchema = new mongoose.Schema(
  {
    // Who performed the action (PostgreSQL user ID)
    userId: {
      type: String,
      required: true,
      index: true, // Index for fetching a user's activity history
    },
    username: {
      type: String,
      required: true,
    },

    // What they did
    action: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true,
    },

    // Flexible metadata — different for each action type
    // Using Mixed type allows any JSON object
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // createdAt = when the action happened
  }
);

// Index for time-based queries (e.g. "show recent activity")
ActivityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", ActivityLogSchema);

module.exports = ActivityLog;
module.exports.ACTION_TYPES = ACTION_TYPES;
