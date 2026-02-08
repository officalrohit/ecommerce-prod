const express = require("express");
const router = express.Router();

const { getVendorOrders } = require("../controllers/vendorOrderController");
const vendorProtect = require("../middleware/vendorMiddleware");
const { updateOrderStatus } = require("../controllers/vendorOrderController");

router.get("/orders", vendorProtect, getVendorOrders);
router.put("/orders/status", vendorProtect, updateOrderStatus);

module.exports = router;
