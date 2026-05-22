/**
 * src/utils/generateToken.js — JWT token generator
 *
 * JSON Web Tokens (JWT) are the authentication mechanism for this app.
 * Instead of storing session data on the server (like the old C++ app did
 * with its in-memory sessions map), JWTs are stateless:
 *
 *   1. User logs in → server creates a signed JWT containing { userId, username }
 *   2. Server sends the JWT to the client
 *   3. Client stores the JWT (localStorage) and sends it with every request
 *   4. Server verifies the JWT signature — no DB lookup needed
 *
 * The JWT_SECRET in .env must be a long random string.
 * Anyone with the secret can forge tokens — keep it private.
 */

const jwt = require("jsonwebtoken");
const { JWT_EXPIRES_IN } = require("./constants");

/**
 * generateToken(payload) — Creates a signed JWT
 *
 * @param {Object} payload - Data to embed in the token (e.g. { userId, username })
 * @returns {string} - Signed JWT string
 *
 * Example:
 *   const token = generateToken({ userId: 1, username: "alice" });
 *   // Returns: "eyJhbGci..." (a long string)
 */
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

module.exports = generateToken;
