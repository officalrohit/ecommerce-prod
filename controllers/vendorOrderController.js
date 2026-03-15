const Order = require("../models/Order");

// 🔹 GET VENDOR ORDERS
exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const orders = await Order.find()
      .populate({
        path: "items.product",
        select: "title price images vendor"
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const vendorOrders = [];

    orders.forEach(order => {
      const vendorItems = order.items.filter(
        item =>
          item.product &&
          item.product.vendor &&
          item.product.vendor.toString() === vendorId.toString()
      );

      if (vendorItems.length > 0) {
        vendorOrders.push({
          _id: order._id,
          user: order.user,
          items: vendorItems,
          status: order.status,
          createdAt: order.createdAt
        });
      }
    });

    res.json(vendorOrders);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE ORDER ITEM STATUS (VENDOR)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, productId, status } = req.body;

    if (!["Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId).populate(
      "items.product",
      "vendor"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    let updated = false;

    order.items.forEach(item => {
      if (
        item.product &&
        item.product._id.toString() === productId &&
        item.product.vendor.toString() === req.vendor._id.toString()
      ) {
        item.itemStatus = status;
        updated = true;
      }
    });

    if (!updated) {
      return res
        .status(403)
        .json({ message: "Not authorized for this product" });
    }

    // 🔹 Overall order status calculate
    const allDelivered = order.items.every(
      item => item.itemStatus === "Delivered"
    );

    if (allDelivered) {
      order.status = "Delivered";
    } else if (order.items.some(item => item.itemStatus === "Shipped")) {
      order.status = "Shipped";
    }

    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
};


