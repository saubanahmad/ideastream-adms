/**
 * src/services/follow.service.js — Follow System Logic (Neo4j)
 *
 * All relationship queries run against Neo4j using Cypher.
 *
 * Key Cypher patterns used (for ADMS reference):
 *
 * FOLLOW:
 *   MATCH (a:User {username: $follower}), (b:User {username: $target})
 *   MERGE (a)-[:FOLLOWS]->(b)
 *
 * UNFOLLOW:
 *   MATCH (a:User {username: $follower})-[r:FOLLOWS]->(b:User {username: $target})
 *   DELETE r
 *
 * GET FOLLOWERS:
 *   MATCH (follower)-[:FOLLOWS]->(u:User {username: $username})
 *   RETURN follower
 *
 * SUGGESTIONS (follow-of-follow pattern):
 *   MATCH (me:User {username: $username})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(rec)
 *   WHERE rec.username <> $username AND NOT (me)-[:FOLLOWS]->(rec)
 *   RETURN rec.username, count(*) AS score ORDER BY score DESC LIMIT 10
 *
 * Implementation: Phase 4
 */

const { getDriver } = require('../config/neo4j');
const prisma = require('../config/postgres');

const followUser = async (followerId, targetIdStr) => {
  const targetId = parseInt(targetIdStr, 10);
  if (followerId === targetId) {
    const error = new Error("A user cannot follow themselves.");
    error.status = 400;
    throw error;
  }

  // Verify target user in PostgreSQL
  const targetUser = await prisma.user.findUnique({ where: { id: targetId } });
  if (!targetUser) {
    const error = new Error("Target user not found");
    error.status = 404;
    throw error;
  }

  const driver = getDriver();
  if (!driver) return; // gracefully ignore if Neo4j is disabled

  const session = driver.session();
  try {
    await session.run(
      `MATCH (a:User {userId: $followerId}), (b:User {userId: $targetId})
       MERGE (a)-[:FOLLOWS]->(b)`,
      { followerId: String(followerId), targetId: String(targetId) }
    );
  } finally {
    await session.close();
  }
};

const unfollowUser = async (followerId, targetIdStr) => {
  const targetId = parseInt(targetIdStr, 10);

  const driver = getDriver();
  if (!driver) return;

  const session = driver.session();
  try {
    await session.run(
      `MATCH (a:User {userId: $followerId})-[r:FOLLOWS]->(b:User {userId: $targetId})
       DELETE r`,
      { followerId: String(followerId), targetId: String(targetId) }
    );
  } finally {
    await session.close();
  }
};

const getFollowers = async (userIdStr) => {
  const userId = String(userIdStr);
  const driver = getDriver();
  if (!driver) return [];

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (follower:User)-[:FOLLOWS]->(u:User {userId: $userId})
       RETURN follower.userId AS followerId`,
      { userId }
    );
    const followerIds = result.records.map(record => parseInt(record.get('followerId'), 10));
    if (followerIds.length === 0) return [];

    const users = await prisma.user.findMany({
      where: { id: { in: followerIds } },
      select: { id: true, username: true, email: true, fullName: true }
    });
    return users;
  } finally {
    await session.close();
  }
};

const getFollowing = async (userIdStr) => {
  const userId = String(userIdStr);
  const driver = getDriver();
  if (!driver) return [];

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {userId: $userId})-[:FOLLOWS]->(following:User)
       RETURN following.userId AS followingId`,
      { userId }
    );
    const followingIds = result.records.map(record => parseInt(record.get('followingId'), 10));
    if (followingIds.length === 0) return [];

    const users = await prisma.user.findMany({
      where: { id: { in: followingIds } },
      select: { id: true, username: true, email: true, fullName: true }
    });
    return users;
  } finally {
    await session.close();
  }
};

const getSocialCounts = async (userIdStr) => {
  const userId = String(userIdStr);
  const driver = getDriver();
  if (!driver) return { followers: 0, following: 0 };

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (u:User {userId: $userId})
       OPTIONAL MATCH (u)-[r1:FOLLOWS]->()
       OPTIONAL MATCH ()-[r2:FOLLOWS]->(u)
       RETURN count(DISTINCT r1) AS following, count(DISTINCT r2) AS followers`,
      { userId }
    );
    if (result.records.length === 0) return { followers: 0, following: 0 };
    return {
      following: result.records[0].get('following').toNumber(),
      followers: result.records[0].get('followers').toNumber()
    };
  } finally {
    await session.close();
  }
};

const getSuggestions = async (userId) => {
  const userIdStr = String(userId);
  const driver = getDriver();
  if (!driver) return [];

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (me:User {userId: $userId})-[:FOLLOWS]->(friend)-[:FOLLOWS]->(rec)
       WHERE rec.userId <> $userId AND NOT (me)-[:FOLLOWS]->(rec)
       RETURN rec.userId AS recId, count(*) AS score
       ORDER BY score DESC LIMIT 10`,
      { userId: userIdStr }
    );

    const suggestedIds = result.records.map(record => parseInt(record.get('recId'), 10));

    if (suggestedIds.length === 0) return [];

    // Fetch users from postgres
    const users = await prisma.user.findMany({
      where: { id: { in: suggestedIds } },
      select: { id: true, username: true, email: true, fullName: true }
    });

    return users;
  } finally {
    await session.close();
  }
};

const getMutualFollows = async (userA, userB) => {
  throw new Error("Not implemented yet");
};

const getPendingFollowBacks = async (userId) => {
  const userIdStr = String(userId);
  const driver = getDriver();
  if (!driver) return [];

  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (follower:User)-[:FOLLOWS]->(me:User {userId: $userId})
       WHERE NOT (me)-[:FOLLOWS]->(follower)
       RETURN follower.userId AS followerId
       LIMIT 10`,
      { userId: userIdStr }
    );

    const pendingIds = result.records.map(record => parseInt(record.get('followerId'), 10));

    if (pendingIds.length === 0) return [];

    // Fetch users from postgres
    const users = await prisma.user.findMany({
      where: { id: { in: pendingIds } },
      select: { id: true, username: true, email: true, fullName: true }
    });

    return users;
  } finally {
    await session.close();
  }
};

const searchUsers = async (keyword, currentUserIdStr) => {
  const currentUserId = parseInt(currentUserIdStr, 10);
  
  // Query PostgreSQL for users
  const users = await prisma.user.findMany({
    where: {
      AND: [
        { id: { not: currentUserId } },
        {
          OR: [
            { username: { contains: keyword, mode: 'insensitive' } },
            { email: { contains: keyword, mode: 'insensitive' } },
            { fullName: { contains: keyword, mode: 'insensitive' } }
          ]
        }
      ]
    },
    select: { id: true, username: true, email: true, fullName: true },
    take: 10
  });

  if (users.length === 0) return [];

  const driver = getDriver();
  if (!driver) {
    return users.map(u => ({ ...u, isFollowing: false }));
  }

  // Check which of these users are followed by the current logged-in user
  const resultIds = users.map(u => String(u.id));
  const session = driver.session();
  try {
    const result = await session.run(
      `MATCH (me:User {userId: $userId})-[:FOLLOWS]->(target:User)
       WHERE target.userId IN $resultIds
       RETURN target.userId AS followedId`,
      { userId: String(currentUserId), resultIds }
    );

    const followedSet = new Set(result.records.map(r => r.get('followedId')));
    return users.map(u => ({
      ...u,
      isFollowing: followedSet.has(String(u.id))
    }));
  } finally {
    await session.close();
  }
};

module.exports = { followUser, unfollowUser, getFollowers, getFollowing, getSocialCounts, getSuggestions, getMutualFollows, getPendingFollowBacks, searchUsers };
