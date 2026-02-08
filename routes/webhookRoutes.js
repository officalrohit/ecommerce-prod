const express = require("express");
const router = express.Router();

const {
  razorpayWebhook,
} = require("../controllers/razorpayWebhookController");

router.post("/razorpay", razorpayWebhook);

module.exports = router;
