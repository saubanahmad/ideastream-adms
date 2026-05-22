/**
 * server.js — Entry point for the IdeaStream backend
 *
 * This file is intentionally kept minimal.
 * Its only job is to:
 *   1. Load environment variables from .env
 *   2. Import the configured Express app from src/app.js
 *   3. Start the HTTP server on the configured PORT
 *
 * All Express configuration (routes, middleware, DB connections)
 * lives in src/app.js to keep this file clean.
 */

require("dotenv").config(); // Load .env variables into process.env

const app = require("./src/app"); // Import the configured Express app

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🚀 IdeaStream server is running on http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Health check: http://localhost:${PORT}/api/health\n`);
});
