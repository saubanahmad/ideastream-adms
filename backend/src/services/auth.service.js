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

const prisma = require('../config/postgres');
const bcrypt = require('bcryptjs');
const generateToken = require('../utils/generateToken');
const { getDriver } = require('../config/neo4j');
const { logActivity, ACTION_TYPES } = require('./activity.service');

const register = async ({ username, email, fullName, password }) => {
  // 1. Check if username or email already exists in PostgreSQL
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    const field = existingUser.email === email ? 'Email' : 'Username';
    throw new Error(`${field} already exists`);
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 12);

  // 3. Insert new user into PostgreSQL via Prisma
  const user = await prisma.user.create({
    data: {
      username,
      email,
      fullName,
      password: hashedPassword,
    },
  });

  // 4. Create a User node in Neo4j (optional)
  if (process.env.NEO4J_URI) {
    try {
      const driver = getDriver();
      const session = driver.session();
      await session.run(
        'CREATE (:User {username: $username, userId: $userId})',
        { username: user.username, userId: String(user.id) }
      );
      await session.close();
    } catch (err) {
      console.error("❌ Failed to create Neo4j user:", err.message);
    }
  } else {
    console.warn("⚠️ Skipping Neo4j user creation (NEO4J_URI not set)");
  }

  // 5. Log to MongoDB activity log (optional)
  if (process.env.MONGO_URI) {
    await logActivity(user.id, user.username, ACTION_TYPES.REGISTER);
  } else {
    console.warn("⚠️ Skipping ActivityLog for REGISTER (MONGO_URI not set)");
  }

  // 6. Generate and return JWT + user info
  const token = generateToken({ userId: user.id, username: user.username });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
    token,
  };
};

const login = async ({ email, password }) => {
  // 1. Find user by email in PostgreSQL
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  // 2. Compare password with bcrypt.compare()
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Log activity (optional)
  if (process.env.MONGO_URI) {
    await logActivity(user.id, user.username, ACTION_TYPES.LOGIN);
  } else {
    console.warn("⚠️ Skipping ActivityLog for LOGIN (MONGO_URI not set)");
  }

  // 3. Generate and return JWT + user info
  const token = generateToken({ userId: user.id, username: user.username });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
    token,
  };
};

const getMe = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(userId, 10) },
    select: { id: true, username: true, email: true, fullName: true, bio: true, createdAt: true },
  });
  
  if (!user) throw new Error('User not found');
  return user;
};

module.exports = { register, login, getMe };
