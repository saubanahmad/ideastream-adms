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
const postService = require('./post.service');

const register = async ({ username, email, fullName, password }) => {
  // 1. Check if username or email already exists in PostgreSQL
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    select: {
      id: true,
      email: true,
      username: true,
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
  try {
    const driver = getDriver();
    if (driver) {
      const session = driver.session();
      await session.run(
        `MERGE (u:User {userId: $userId})
         SET u.username = $username, u.email = $email`,
        { username: user.username, email: user.email, userId: String(user.id) }
      );
      await session.close();
    } else {
      console.warn("⚠️ Skipping Neo4j user creation (Neo4j driver not initialized)");
    }
  } catch (err) {
    console.error("❌ Failed to create/update Neo4j user:", err.message);
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
      bio: user.bio,
    },
    token,
  };
};

const login = async ({ username, password }) => {
  // 1. Find user by username in PostgreSQL
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('Invalid username or password');
  }

  // 2. Compare password with bcrypt.compare()
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new Error('Invalid username or password');
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
      bio: user.bio,
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

const updateMe = async (userId, { username, fullName, bio }) => {
  const parsedId = parseInt(userId, 10);
  
  // Get current user
  const currentUser = await prisma.user.findUnique({ where: { id: parsedId } });
  if (!currentUser) throw new Error("User not found");

  // Check if username is being changed and if it's already taken
  if (username && username !== currentUser.username) {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      throw new Error("Username already exists");
    }
  }

  // Update in PostgreSQL
  const updatedUser = await prisma.user.update({
    where: { id: parsedId },
    data: {
      username: username || currentUser.username,
      fullName: fullName || currentUser.fullName,
      bio: bio !== undefined ? bio : currentUser.bio,
    },
    select: { id: true, username: true, email: true, fullName: true, bio: true, createdAt: true },
  });

  // If username changed, update Neo4j and MongoDB
  if (username && username !== currentUser.username) {
    // Neo4j update
    try {
      const driver = getDriver();
      if (driver) {
        const session = driver.session();
        await session.run(
          `MATCH (u:User {userId: $userId}) SET u.username = $username`,
          { userId: String(parsedId), username: updatedUser.username }
        );
        await session.close();
      }
    } catch (err) {
      console.error("Failed to update username in Neo4j:", err);
    }

    // MongoDB update (posts)
    try {
      if (postService.updateAuthorUsername) {
        await postService.updateAuthorUsername(String(parsedId), updatedUser.username);
      }
    } catch (err) {
      console.error("Failed to update username in MongoDB:", err);
    }
  }

  // Generate new token
  const token = generateToken({ userId: updatedUser.id, username: updatedUser.username });

  return {
    user: updatedUser,
    token,
  };
};

module.exports = { register, login, getMe, updateMe };
