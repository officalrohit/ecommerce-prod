const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 🔹 USER
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 ORDER ITEMS (Vendor-level control)
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        // 🔹 Item delivery lifecycle
        itemStatus: {
          type: String,
          enum: ["Placed", "Shipped", "Delivered"],
          default: "Placed",
        },

        // 🆕 ITEM STATUS HISTORY (TIMELINE)
        statusHistory: [
          {
            status: {
              type: String,
              required: true,
            },
            date: {
              type: Date,
              default: Date.now,
            },
            updatedBy: {
              type: String, // vendor / admin / system
              required: true,
            },
          },
        ],

        // 🔹 Finance lifecycle
        isSettled: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // 🔹 PAYMENT (Order-level)
    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    paymentInfo: {
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    // 🔹 ORDER LIFECYCLE (System controlled)
    status: {
      type: String,
      enum: ["Placed", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Placed",
    },

    // 🆕 ORDER STATUS HISTORY (TIMELINE)
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        updatedBy: {
          type: String, // user / vendor / admin / system
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Order || mongoose.model("Order", orderSchema);
