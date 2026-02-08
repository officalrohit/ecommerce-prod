const Order = require("../models/Order");
const Cart = require("../models/Cart");

// 🔹 PLACE ORDER
exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate(
      "items.product",
      "price"
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,

      // 🆕 ITEM LEVEL TIMELINE (INITIAL ENTRY)
      statusHistory: [
        {
          status: "Placed",
          updatedBy: "user",
        },
      ],
    }));

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user,
      items,
      totalAmount,

      // 🆕 ORDER LEVEL TIMELINE (INITIAL ENTRY)
      statusHistory: [
        {
          status: "Placed",
          updatedBy: "user",
        },
      ],
    });

    // Clear cart after order
    await Cart.deleteOne({ user: req.user });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user })
    .populate("items.product", "title images")
    .sort({ createdAt: -1 });

  res.json(orders);
};
