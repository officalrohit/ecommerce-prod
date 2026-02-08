const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  adminUpdateOrderStatus
} = require("../controllers/adminOrderController");

const adminProtect = require("../middleware/adminMiddleware");

router.get("/orders", adminProtect, getAllOrders);
router.put("/orders/status", adminProtect, adminUpdateOrderStatus);

module.exports = router;