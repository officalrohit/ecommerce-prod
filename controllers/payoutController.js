const Payout = require("../Models/Payout");
const Order = require("../Models/Order");

const COMMISSION_PERCENT = 10;

// 🔹 VENDOR REQUEST PAYOUT
exports.requestPayout = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const orders = await Order.find({ isPaid: true })
      .populate("items.product", "vendor");

    let grossAmount = 0;

    orders.forEach(order => {
      order.items.forEach(item => {
        if (
          item.product &&
          item.product.vendor.toString() === vendorId.toString() &&
          item.itemStatus === "Delivered" &&
          item.isSettled === false // 🛑 DUPLICATE PAYOUT BLOCK
        ) {
          grossAmount += item.price * item.quantity;
        }
      });
    });

    // 🔹 No eligible payout
    if (grossAmount <= 0) {
      return res.status(400).json({ message: "No payout available" });
    }

    // 🔹 Commission calculation
    const commission = (grossAmount * COMMISSION_PERCENT) / 100;
    const payoutAmount = grossAmount - commission;

    const payout = await Payout.create({
      vendor: vendorId,
      amount: payoutAmount,
      status: "Pending",
    });

    res.json({
      message: "Payout request submitted successfully",
      payout: {
        amount: payoutAmount,
        commission,
        grossAmount,
        status: payout.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
