const Payout = require("../Models/Payout");
const Order = require("../Models/Order");

exports.markPayoutPaid = async (req, res) => {
  try {
    const payout = await Payout.findById(req.params.id);

    if (!payout) {
      return res.status(404).json({ message: "Payout not found" });
    }

    if (payout.status === "Paid") {
      return res.status(400).json({ message: "Payout already paid" });
    }

    // 🔹 Mark payout as PAID
    payout.status = "Paid";
    payout.paidAt = new Date();
    await payout.save();

    // 🔹 Mark items as SETTLED + update timeline
    const orders = await Order.find({ isPaid: true }).populate(
      "items.product",
      "vendor"
    );

    for (const order of orders) {
      let orderUpdated = false;

      order.items.forEach(item => {
        if (
          item.product &&
          item.product.vendor.toString() === payout.vendor.toString() &&
          item.itemStatus === "Delivered" &&
          item.isSettled === false
        ) {
          // 🔹 Mark item settled
          item.isSettled = true;

          // 🆕 ITEM TIMELINE ENTRY
          item.statusHistory.push({
            status: "Settled",
            updatedBy: "admin",
          });

          orderUpdated = true;
        }
      });

      if (orderUpdated) {
        // 🆕 ORDER TIMELINE ENTRY
        order.statusHistory.push({
          status: "Vendor payout settled",
          updatedBy: "admin",
        });

        await order.save();
      }
    }

    res.json({
      message: "Payout marked as paid and items settled successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
