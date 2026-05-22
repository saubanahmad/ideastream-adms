/**
 * src/config/postgres.js — PostgreSQL connection via Prisma
 *
 * Prisma is an ORM (Object-Relational Mapper) for PostgreSQL.
 * Instead of writing raw SQL, we use Prisma's query API.
 *
 * The PrismaClient is a singleton — we export one shared instance
 * so every file in the app uses the same connection pool.
 *
 * The actual database URL comes from .env → DATABASE_URL
 * Format: postgresql://username:password@localhost:5432/ideastream
 *
 * ADMS Note: PostgreSQL is used for:
 *   - User accounts (id, username, email, password hash)
 *   - Profile data (full name, bio)
 *   - Authentication data (timestamps, account status)
 */

const { PrismaClient } = require("@prisma/client");

// Create the single shared Prisma instance
const prisma = new PrismaClient({
  log: ["error", "warn"], // Log DB errors and warnings to console
});

// Test connection when this module is first loaded
prisma
  .$connect()
  .then(() => console.log("✅ PostgreSQL connected via Prisma"))
  .catch((err) => console.error("❌ PostgreSQL connection failed:", err.message));

module.exports = prisma;
