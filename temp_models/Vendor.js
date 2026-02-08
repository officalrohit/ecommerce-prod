const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true
    },
    ownerName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    isApproved: {
      type: Boolean,
      default: false // ❗ admin approval needed
    },
    role: {
      type: String,
      default: "vendor"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vendor", vendorSchema);
