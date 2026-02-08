const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔹 VENDOR REGISTER
exports.registerVendor = async (req, res) => {
  const { shopName, ownerName, email, password } = req.body;

  try {
    const vendorExists = await Vendor.findOne({ email });
    if (vendorExists) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const vendor = await Vendor.create({
      shopName,
      ownerName,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Vendor registered successfully. Await admin approval."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 VENDOR LOGIN
exports.loginVendor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!vendor.isApproved) {
      return res.status(403).json({
        message: "Vendor not approved by admin yet"
      });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor._id, role: vendor.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      vendor: {
        id: vendor._id,
        shopName: vendor.shopName,
        email: vendor.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
