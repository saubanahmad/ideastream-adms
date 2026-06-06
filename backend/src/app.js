/**
 * src/app.js — Express application setup
 *
 * This file configures the Express app:
 *   - CORS (allows the React frontend to call our API)
 *   - JSON body parsing (so we can read req.body)
 *   - Database connections (PostgreSQL, MongoDB, Neo4j)
 *   - All API routes
 *   - Global error handling middleware
 *
 * It does NOT start the server — that's server.js's job.
 */

const express = require("express");
const cors = require("cors");
const path = require("path");

// --- Database connections ---
const connectMongo = require("./config/mongo");
const connectNeo4j = require("./config/neo4j");
// Prisma (PostgreSQL) is initialized per-use in services via the Prisma client

// --- Route imports ---
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const voteRoutes = require("./routes/vote.routes");
const feedRoutes = require("./routes/feed.routes");
const followRoutes = require("./routes/follow.routes");
const userRoutes = require("./routes/user.routes");
const searchRoutes = require("./routes/search.routes");

// --- Middleware imports ---
const errorMiddleware = require("./middleware/error.middleware");

// ─────────────────────────────────────────────
// Create the Express application instance
// ─────────────────────────────────────────────
const app = express();

// ─────────────────────────────────────────────
// CORS Configuration
// Allows the React frontend (running on a different port)
// to make requests to this API without browser blocking.
// ─────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true, // Allow cookies/auth headers to be sent
  })
);

// ─────────────────────────────────────────────
// Body Parsers
// Allows Express to read JSON data sent in request bodies
// ─────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (e.g. uploaded images)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ─────────────────────────────────────────────
// Connect to Databases
// These run when the server starts up
// ─────────────────────────────────────────────
connectMongo();   // MongoDB via Mongoose
connectNeo4j();   // Neo4j via neo4j-driver
// PostgreSQL is connected via Prisma — it connects automatically on first query

// ─────────────────────────────────────────────
// Health Check Route
// A simple GET endpoint to confirm the server is alive.
// Visit: GET http://localhost:5000/api/health
// ─────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "IdeaStream API is running",
    timestamp: new Date().toISOString(),
    databases: {
      postgres: "Prisma connected (lazy)",
      mongodb: "Mongoose connecting...",
      neo4j: "neo4j-driver connecting...",
    },
  });
});

// ─────────────────────────────────────────────
// API Routes
// Each resource has its own router file
// ─────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);  // /api/posts/:id/comments
app.use("/api/posts", voteRoutes);     // /api/posts/:id/vote
app.use("/api/feed", feedRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);

// ─────────────────────────────────────────────
// 404 Handler
// If no route matched above, return a clean 404
// ─────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ status: "error", message: `Route ${req.originalUrl} not found` });
});

// ─────────────────────────────────────────────
// Global Error Handler
// Must be LAST — catches any error thrown by route handlers
// ─────────────────────────────────────────────
app.use(errorMiddleware);

module.exports = app;
