const Product = require("../models/Product");

// 🔹 ADD PRODUCT
exports.addProduct = async (req, res) => {
  const { title, description, price, stock, images } = req.body;

  try {
    const product = await Product.create({
      title,
      description,
      price,
      stock,
      images,
      vendor: req.vendor._id
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET VENDOR PRODUCTS
exports.getVendorProducts = async (req, res) => {
  const products = await Product.find({ vendor: req.vendor._id });
  res.json(products);
};

// 🔹 UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.vendor.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  Object.assign(product, req.body);
  await product.save();

  res.json(product);
};

// 🔹 DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  if (product.vendor.toString() !== req.vendor._id.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
};


// 🔹 GET ALL PRODUCTS (USER)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    .populate('vendor', 'shopeName') // latest first
    .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE PRODUCT DETAILS (USER)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    .populate('vendor', 'shopeName');

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
   // Invalid ObjectId handle
   if (error.kind === 'ObjectId') {
     return res.status(404).json({ message: "Invalid product ID" });
   }
   res.status(500).json({ message: error.message });
  }
};