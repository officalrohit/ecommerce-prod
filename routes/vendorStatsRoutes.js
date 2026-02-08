const express = require("express");
const router = express.Router();

const { getVendorStats } = require("../controllers/vendorStatsController");
const vendorProtect = require("../middleware/vendorMiddleware");

router.get("/stats", vendorProtect, getVendorStats);

module.exports = router;
