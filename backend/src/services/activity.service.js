/**
 * src/services/activity.service.js — Activity Log Service
 *
 * Records user actions to MongoDB's activity_logs collection.
 * Called from other services (auth, post, follow) after successful actions.
 *
 * Design: This is a "fire and forget" service — if logging fails,
 * it should NOT break the main operation. Errors are caught and logged
 * to console only.
 *
 * Implementation: Partially ready — used in Phase 2+
 */

const ActivityLog = require("../models/ActivityLog");
const { ACTION_TYPES } = require("../models/ActivityLog");

/**
 * logActivity — Records an action to MongoDB
 *
 * @param {string} userId     - PostgreSQL user ID
 * @param {string} username   - Username (denormalized for display)
 * @param {string} action     - One of ACTION_TYPES values
 * @param {Object} metadata   - Additional context about the action
 */
const logActivity = async (userId, username, action, metadata = {}) => {
  try {
    await ActivityLog.create({ userId: String(userId), username, action, metadata });
  } catch (err) {
    // Log error but don't re-throw — activity logging should never break main operations
    console.error(`[ActivityLog] Failed to log ${action} for ${username}:`, err.message);
  }
};

module.exports = { logActivity, ACTION_TYPES };
