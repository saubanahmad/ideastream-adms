const express = require("express");
const router = express.Router();
const searchController = require("../controllers/search.controller");
const { protect } = require("../middleware/auth.middleware");

// GET /api/search?q=keyword
router.get("/", protect, searchController.globalSearch);

module.exports = router;
