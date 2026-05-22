/**
 * src/middleware/error.middleware.js — Global Error Handler
 *
 * In Express, error-handling middleware has FOUR parameters: (err, req, res, next).
 * Express recognizes this as an error handler (vs a normal middleware with 3 params).
 *
 * This must be registered LAST in app.js — after all routes.
 * When any route calls next(err) or throws an error, it ends up here.
 *
 * Benefits of centralizing error handling:
 *   - Consistent error response format across all endpoints
 *   - Stack traces shown in development, hidden in production
 *   - No need for try/catch in every controller
 */

const errorMiddleware = (err, req, res, next) => {
  // Default error status and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // ─────────────────────────────────────────────
  // Handle specific error types
  // ─────────────────────────────────────────────

  // Prisma unique constraint violation (e.g. duplicate username/email)
  if (err.code === "P2002") {
    statusCode = 409; // Conflict
    const field = err.meta?.target?.[0] || "field";
    message = `A user with this ${field} already exists.`;
  }

  // Prisma record not found
  if (err.code === "P2025") {
    statusCode = 404;
    message = "Record not found.";
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Mongoose duplicate key (same as Prisma P2002 but for MongoDB)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // JWT errors (caught separately in auth middleware, but as a fallback)
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token.";
  }

  // ─────────────────────────────────────────────
  // Build the error response
  // ─────────────────────────────────────────────
  const response = {
    status: "error",
    message,
  };

  // Include stack trace in development only (never expose in production)
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  // Log error to console for debugging
  console.error(`[ERROR] ${statusCode} — ${message}`);

  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;
