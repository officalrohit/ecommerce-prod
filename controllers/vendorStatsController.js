const Order = require("../Models/Order");

// 🔹 VENDOR DASHBOARD STATS
exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const orders = await Order.find()
      .populate("items.product", "vendor price")
      .sort({ createdAt: -1 });

    let totalOrders = 0;
    let totalRevenue = 0;

    const statusCount = {
      Placed: 0,
      Shipped: 0,
      Delivered: 0
    };

    orders.forEach(order => {
      order.items.forEach(item => {
        if (
          item.product &&
          item.product.vendor.toString() === vendorId.toString()
        ) {
          totalOrders++;

          statusCount[item.itemStatus]++;

          if (item.itemStatus === "Delivered") {
            totalRevenue += item.price * item.quantity;
          }
        }
      });
    });

    res.json({
      totalOrders,
      totalRevenue,
      statusCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

