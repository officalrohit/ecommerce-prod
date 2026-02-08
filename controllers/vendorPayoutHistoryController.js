const Payout = require("../models/Payout");

// 🔹 VENDOR PAYOUT HISTORY
exports.getVendorPayoutHistory = async (req, res) => {
  try {
    const vendorId = req.vendor._id;

    const payouts = await Payout.find({ vendor: vendorId })
      .sort({ createdAt: -1 });

    let totalPaid = 0;
    let totalPending = 0;

    payouts.forEach(p => {
      if (p.status === "Paid") {
        totalPaid += p.amount;
      } else if (p.status === "Pending") {
        totalPending += p.amount;
      }
    });

    res.json({
      payouts,
      summary: {
        totalPaid,
        totalPending
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
