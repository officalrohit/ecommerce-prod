const Payout = require("../Models/Payout");

// 🔹 ADMIN SETTLEMENT DASHBOARD
exports.getAdminSettlementDashboard = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate("vendor", "shopName email")
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
      summary: {
        totalPaid,
        totalPending,
        totalPayouts: payouts.length
      },
      payouts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
