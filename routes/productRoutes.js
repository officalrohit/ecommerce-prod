const express = require("express");
const router = express.Router();
const { getAllProducts } = require("../controllers/productController");


const {
  addProduct,
  getVendorProducts,
  updateProduct,
  deleteProduct,
  getProductById
} = require("../controllers/productController");

const vendorProtect = require("../middleware/vendorMiddleware");

// USER - PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// VENDOR ROUTES

router.post("/", vendorProtect, addProduct);
router.get("/my-products", vendorProtect, getVendorProducts);
router.put("/:id", vendorProtect, updateProduct);
router.delete("/:id", vendorProtect, deleteProduct);


module.exports = router;
