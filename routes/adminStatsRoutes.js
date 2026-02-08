const express = require("express");
const router = express.Router();

const { getAdminStats } = require("../controllers/adminStatsController");
const adminProtect = require("../middleware/adminMiddleware");

router.get("/stats", adminProtect, getAdminStats);

module.exports = router;
