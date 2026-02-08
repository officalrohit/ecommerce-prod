const express = require("express");
const router = express.Router();

const {
  adminLogin,
  getAllVendors,
  approveVendor
} = require("../controllers/adminController");

const adminProtect = require("../middleware/adminMiddleware");

router.post("/login", adminLogin);
router.get("/vendors", adminProtect, getAllVendors);
router.put("/approve-vendor/:id", adminProtect, approveVendor);

module.exports = router;
