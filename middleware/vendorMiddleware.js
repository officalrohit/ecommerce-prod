const jwt = require("jsonwebtoken");
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

    const vendor = await Vendor.findById(decoded.id);
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
