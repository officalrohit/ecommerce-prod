const crypto = require("crypto");
const Order = require("../Models/Order");

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 🔐 Verify webhook signature (RAW BODY REQUIRED)
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(req.body);
    const digest = shasum.digest("hex");

    const razorpaySignature = req.headers["x-razorpay-signature"];

    if (digest !== razorpaySignature) {
      return res.status(400).json({ message: "Invalid webhook signature" });
    }

    const event = req.body.event;
    const payload = req.body.payload;

    // 🔴 PAYMENT FAILED
    if (event === "payment.failed") {
      const payment = payload.payment.entity;

      const order = await Order.findOne({
        "paymentInfo.razorpayOrderId": payment.order_id,
      });

      if (order) {
        order.status = "Cancelled";
        order.isPaid = false;

        // 🆕 ORDER STATUS TIMELINE
        order.statusHistory.push({
          status: "Cancelled (Payment Failed)",
          updatedBy: "system (razorpay)",
        });

        await order.save();
      }
    }

    // 🔄 REFUND PROCESSED
    if (event === "refund.processed") {
      const refund = payload.refund.entity;

      const order = await Order.findOne({
        "paymentInfo.razorpayPaymentId": refund.payment_id,
      });

      if (order) {
        order.status = "Cancelled";
        order.isPaid = false;

        // 🆕 ORDER STATUS TIMELINE
        order.statusHistory.push({
          status: "Cancelled (Refund Processed)",
          updatedBy: "system (razorpay)",
        });

        await order.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
