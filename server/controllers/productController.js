const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ products });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ product });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getProducts, getProduct };
