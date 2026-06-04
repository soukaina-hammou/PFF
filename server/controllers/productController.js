const Product = require("../models/Product");

const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find({}).skip(skip).limit(limit),
      Product.countDocuments({}),
    ]);

    return res.json({
      products,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
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
