const Cart = require("../models/Cart");
const Product = require("../models/Product");

// 🔹 ADD TO CART
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user });

    if (!cart) {
      cart = await Cart.create({
        user: req.user,
        items: [{ product: productId, quantity }]
      });
      return res.status(201).json(cart);
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET USER CART
exports.getCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user }).populate(
    "items.product",
    "title price images"
  );

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json(cart);
};

// 🔹 UPDATE QUANTITY
exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  item.quantity = quantity;
  await cart.save();
  res.json(cart);
};

// 🔹 REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  const cart = await Cart.findOne({ user: req.user });

  if (!cart) {
    return res.status(404).json({ message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    item => item.product.toString() !== req.params.productId
  );

  await cart.save();
  res.json(cart);
};
