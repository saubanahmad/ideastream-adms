/**
 * src/services/auth.service.js — Authentication Business Logic
 *
 * The service layer contains the actual logic — it is called by controllers
 * and communicates with databases directly.
 *
 * This service will use:
 *   - Prisma (PostgreSQL) for user storage
 *   - bcryptjs for password hashing
 *   - generateToken for JWT creation
 *   - Neo4j to create a User node on registration (for the follow graph)
 *
 * Implementation: Phase 2
 */

// TODO Phase 2: Implement auth service
// const prisma = require('../config/postgres');
// const bcrypt = require('bcryptjs');
// const generateToken = require('../utils/generateToken');
// const { getDriver } = require('../config/neo4j');

const register = async ({ username, email, fullName, password }) => {
  // TODO Phase 2:
  // 1. Check if username or email already exists in PostgreSQL
  // 2. Hash the password: const hash = await bcrypt.hash(password, 12)
  // 3. Insert new user into PostgreSQL via Prisma
  // 4. Create a User node in Neo4j: CREATE (:User {username, userId})
  // 5. Log to MongoDB activity log: ACTION_TYPES.REGISTER
  // 6. Generate and return JWT
  throw new Error("Not implemented yet");
};

const login = async ({ email, password }) => {
  // TODO Phase 2:
  // 1. Find user by email in PostgreSQL
  // 2. Compare password with bcrypt.compare()
  // 3. Generate and return JWT + user info
  throw new Error("Not implemented yet");
};

module.exports = { register, login };
