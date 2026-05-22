/**
 * src/config/mongo.js — MongoDB connection via Mongoose
 *
 * Mongoose is an ODM (Object-Document Mapper) for MongoDB.
 * It lets us define schemas for our documents and provides
 * a clean API for querying.
 *
 * This file exports a function that connects Mongoose to MongoDB.
 * It is called once when the server starts in src/app.js.
 *
 * The connection string comes from .env → MONGO_URI
 * Format: mongodb://localhost:27017/ideastream
 *
 * ADMS Note: MongoDB is used for:
 *   - Posts (with embedded comments and votes arrays)
 *   - Activity logs
 *   - Flexible document structure allows nested data without joins
 */

const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings
      serverSelectionTimeoutMS: 5000, // Fail fast if MongoDB is not reachable
    });
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    // Don't crash the server — just log the error
    // In production you may want to process.exit(1) here
  }
};

module.exports = connectMongo;
