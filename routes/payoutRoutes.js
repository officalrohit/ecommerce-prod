const express = require("express");
const router = express.Router();
const { requestPayout } = require("../controllers/payoutController");
const vendorProtect = require("../middleware/vendorMiddleware");

router.post("/request", vendorProtect, requestPayout);

module.exports = router;
