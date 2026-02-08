const express = require("express");
const router = express.Router();

const {
  getAdminSettlementDashboard
} = require("../controllers/adminSettlementController");

const adminProtect = require("../middleware/adminMiddleware");

router.get("/settlements", adminProtect, getAdminSettlementDashboard);

module.exports = router;
