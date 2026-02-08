const express = require("express");
const router = express.Router();

const { getVendorRevenue } = require("../controllers/vendorRevenueController");
const vendorProtect = require("../middleware/vendorMiddleware");

router.get("/revenue", vendorProtect, getVendorRevenue);

module.exports = router;
