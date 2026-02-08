const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: "Pending" // Pending, Paid
    },
    requestedAt: {
      type: Date,
      default: Date.now
    },
    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Payout || mongoose.model("Payout", payoutSchema);
