const User = require("../models/User");
const Product = require("../models/Product");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({ users });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({ message: "User deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    return res.json({ products });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, countInStock } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      image: image || "",
      category,
      countInStock: countInStock || 0,
    });
    return res.status(201).json({ message: "Product created", product });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product updated", product });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
