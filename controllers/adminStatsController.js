const User = require("../models/User");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// 🔹 ADMIN DASHBOARD STATS
exports.getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments();
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      { $match: { status: "Delivered" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalUsers,
      totalVendors,
      totalOrders,
      totalRevenue: revenueData[0]?.totalRevenue || 0,
      orderStatusStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
