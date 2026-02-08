const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../Models/Order");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// 🔹 CREATE PAYMENT ORDER
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔒 Safety: already paid order
    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    const options = {
      amount: order.totalAmount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `order_${orderId}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 VERIFY PAYMENT
exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔒 Prevent duplicate verification
    if (order.isPaid) {
      return res.status(400).json({ message: "Order already verified" });
    }

    // 🔐 Signature verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    // ✅ Mark order as PAID + CONFIRMED
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = "Confirmed";

    // 🧾 Store Razorpay details
    order.paymentInfo = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    };

    // 🆕 ORDER STATUS TIMELINE ENTRY
    order.statusHistory.push({
      status: "Confirmed",
      updatedBy: "system",
    });

    await order.save();

    res.json({
      message: "Payment verified successfully",
      orderId: order._id,
      status: order.status,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
