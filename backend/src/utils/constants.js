/**
 * src/utils/constants.js — Application-wide constants
 *
 * Centralizing constants prevents typos when comparing strings
 * across the codebase. Instead of typing "Digital Frontier" in
 * multiple files (and risking inconsistency), we import FEEDS.DIGITAL_FRONTIER.
 *
 * ADMS Note: These feed names map directly to the `feed` field
 * stored on every MongoDB Post document, enabling filtering:
 *   db.posts.find({ feed: FEEDS.CULTIVATE })
 */

// ─────────────────────────────────────────────
// Feed / Platform Names
// These are the 9 communities in IdeaStream
// ─────────────────────────────────────────────
const FEEDS = {
  IDEA_STREAM: "IdeaStream",       // General feed — all posts
  CULTIVATE: "Cultivate",          // Agricultural ideas
  DIGITAL_FRONTIER: "Digital Frontier", // Coding / software projects
  FAST_LANE: "FastLane",           // Automotive ideas
  LAUNCHPAD: "Launchpad",          // Startup ideas
  LIFE_SCIENCE: "LifeScience",     // Biology / medical ideas
  PLAY_LAB: "PlayLab",             // Game development ideas
  TANGIBLE_TECH: "Tangible Tech",  // Robotics / hardware
  URBAN_CORE: "Urban Core",        // Architecture / civil engineering
};

// Array version — useful for validation (checking if a submitted feed name is valid)
const FEED_LIST = Object.values(FEEDS);

// ─────────────────────────────────────────────
// Vote Types
// Used in MongoDB Post.votes array and vote controller
// ─────────────────────────────────────────────
const VOTE_TYPES = {
  UP: "upvote",
  DOWN: "downvote",
};

// ─────────────────────────────────────────────
// JWT Settings
// ─────────────────────────────────────────────
const JWT_EXPIRES_IN = "7d"; // Token expires in 7 days

// ─────────────────────────────────────────────
// Pagination Defaults
// ─────────────────────────────────────────────
const DEFAULT_PAGE_SIZE = 20;

module.exports = {
  FEEDS,
  FEED_LIST,
  VOTE_TYPES,
  JWT_EXPIRES_IN,
  DEFAULT_PAGE_SIZE,
};
