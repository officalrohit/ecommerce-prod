const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

const vendorProtect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "vendor") {
      return res.status(403).json({ message: "Vendor access only" });
    }

    let vendor = await Vendor.findById(decoded.id);

    // Backward compatibility: older accounts were created in the User model
    // with role=vendor, but vendor APIs expect a Vendor document.
    if (!vendor) {
      const legacyVendorUser = await User.findById(decoded.id);

      if (legacyVendorUser && legacyVendorUser.role === "vendor") {
        vendor = await Vendor.findOne({ email: legacyVendorUser.email });

        if (!vendor) {
          vendor = await Vendor.create({
            shopName: legacyVendorUser.name,
            ownerName: legacyVendorUser.name,
            email: legacyVendorUser.email,
            password: legacyVendorUser.password,
            isApproved: true,
            role: "vendor",
          });
        }
      }
    }

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    if (!vendor.isApproved) {
      return res.status(403).json({ message: "Vendor not approved" });
    }

    // 🔥 THIS LINE IS MOST IMPORTANT
    req.vendor = vendor;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = vendorProtect;
