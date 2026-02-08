const Order = require("../models/Order");

// 🔹 GET ALL ORDERS (ADMIN)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate({
        path: "items.product",
        select: "title price",
        populate: {
          path: "vendor",
          select: "shopName email"
        }
      })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 ADMIN UPDATE ORDER STATUS
exports.adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!["Placed", "Shipped", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;

    // 🔹 Sync item statuses if admin forces Delivered
    if (status === "Delivered") {
      order.items.forEach(item => {
        item.itemStatus = "Delivered";
      });
    }

    await order.save();

    res.json({
      message: "Order status updated by admin",
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
