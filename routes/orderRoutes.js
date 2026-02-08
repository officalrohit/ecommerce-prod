const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");

router.post("/", protect, placeOrder);
router.get("/my-orders", protect, getUserOrders);

module.exports = router;
