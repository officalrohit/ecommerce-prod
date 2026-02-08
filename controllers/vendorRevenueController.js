const Order = require("../models/Order");

const COMMISSION_PERCENT = 10;
const DELIVERED_STATUS = "Delivered";

exports.getVendorRevenue = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const orders = await Order.find({ isPaid: true })
      .populate("items.product", "vendor price");

    let grossRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (
          item.product &&
          item.product.vendor &&
          item.product.vendor.toString() === vendorId.toString() &&
          item.itemStatus === DELIVERED_STATUS
        ) {
          const itemTotal = item.price * item.quantity;
          grossRevenue += itemTotal;
          totalItemsSold += item.quantity;
        }
      });
    });

    const commission = (grossRevenue * COMMISSION_PERCENT) / 100;
    const netRevenue = grossRevenue - commission;

    res.json({
      grossRevenue,
      commission,
      netRevenue,
      totalItemsSold
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
