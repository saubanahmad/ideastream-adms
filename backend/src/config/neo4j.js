/**
 * src/config/neo4j.js — Neo4j connection via neo4j-driver
 *
 * neo4j-driver is the official JavaScript driver for Neo4j.
 * Unlike Mongoose (which uses schemas), Neo4j uses Cypher queries
 * to create and traverse graph relationships.
 *
 * This file:
 *   1. Creates a Neo4j Driver instance (like a connection pool)
 *   2. Verifies the connection with a test query
 *   3. Exports the driver so other files can open sessions
 *
 * Connection strings come from .env:
 *   NEO4J_URI=bolt://localhost:7687
 *   NEO4J_USERNAME=neo4j
 *   NEO4J_PASSWORD=yourpassword
 *
 * ADMS Note: Neo4j is used for:
 *   - Follow relationships: (:User)-[:FOLLOWS]->(:User)
 *   - Follower/following counts
 *   - Mutual follows
 *   - "Who to follow" recommendations (friends of friends pattern)
 *   Graph databases excel at relationship queries that would be
 *   expensive with SQL JOINs.
 */

const neo4j = require("neo4j-driver");

let driver; // The driver instance — shared across the app

const connectNeo4j = async () => {
  if (!process.env.NEO4J_URI || !process.env.NEO4J_USERNAME || !process.env.NEO4J_PASSWORD) {
    console.warn("⚠️ Neo4j environment variables missing. Neo4j integration is disabled.");
    return;
  }

  try {
    driver = neo4j.driver(
      process.env.NEO4J_URI,
      neo4j.auth.basic(
        process.env.NEO4J_USERNAME,
        process.env.NEO4J_PASSWORD
      )
    );

    // verifyConnectivity() opens a test connection to confirm Neo4j is reachable
    await driver.verifyConnectivity();
    console.log("✅ Neo4j connected");
  } catch (err) {
    console.error("❌ Neo4j connection failed:", err.message);
    // Don't crash the server — log and continue
  }
};

/**
 * getDriver() — Returns the active Neo4j driver instance
 *
 * Usage in other files:
 *   const { getDriver } = require('../config/neo4j');
 *   const driver = getDriver();
 *   if (driver) {
 *     const session = driver.session();
 *     await session.run("MATCH (n) RETURN n LIMIT 1");
 *     await session.close();
 *   }
 */
const getDriver = () => {
  if (!driver) {
    console.warn("⚠️ Neo4j driver not initialized (possibly disabled).");
    return null;
  }
  return driver;
};

/**
 * closeNeo4j() — Gracefully closes the Neo4j driver
 * Call this on server shutdown if needed
 */
const closeNeo4j = async () => {
  if (driver) {
    await driver.close();
    console.log("Neo4j driver closed");
  }
};

module.exports = connectNeo4j;
module.exports.getDriver = getDriver;
module.exports.closeNeo4j = closeNeo4j;
