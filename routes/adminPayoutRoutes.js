const express = require("express");
const router = express.Router();
const { markPayoutPaid } = require("../controllers/adminPayoutController");
const adminProtect = require("../middleware/adminMiddleware");

router.put("/payout/:id", adminProtect, markPayoutPaid);

module.exports = router;
