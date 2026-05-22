/**
 * src/middleware/auth.middleware.js — JWT Authentication Guard
 *
 * This middleware protects routes that require a logged-in user.
 * Add it to any route that should only be accessible after login.
 *
 * How it works:
 *   1. Client sends request with header: Authorization: Bearer <token>
 *   2. This middleware extracts the token from the header
 *   3. It verifies the token signature using JWT_SECRET
 *   4. If valid: attaches decoded user info to req.user and calls next()
 *   5. If invalid/missing: returns 401 Unauthorized
 *
 * Usage in a route file:
 *   const { protect } = require('../middleware/auth.middleware');
 *   router.post('/posts', protect, postController.createPost);
 *   //                    ^^^^^^^ This route now requires authentication
 */

const jwt = require("jsonwebtoken");

/**
 * protect — middleware function that verifies JWT
 * If verification fails for any reason, returns 401.
 */
const protect = (req, res, next) => {
  try {
    // 1. Get the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Access denied. No token provided.",
      });
    }

    // 2. Extract the token (remove "Bearer " prefix)
    const token = authHeader.split(" ")[1];

    // 3. Verify the token — throws if expired or invalid signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user info to the request object
    // Now req.user is available in all downstream route handlers
    req.user = decoded; // Contains { userId, username, iat, exp }

    // 5. Pass control to the next middleware/route handler
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired. Please log in again.",
      });
    }
    return res.status(401).json({
      status: "error",
      message: "Invalid token.",
    });
  }
};

module.exports = { protect };
