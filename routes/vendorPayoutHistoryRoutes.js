const express = require("express");
const router = express.Router();

const {
  getVendorPayoutHistory
} = require("../controllers/vendorPayoutHistoryController");

const vendorProtect = require("../middleware/vendorMiddleware");

router.get("/history", vendorProtect, getVendorPayoutHistory);

module.exports = router;
