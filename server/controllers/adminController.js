const User = require("../models/User");
const Product = require("../models/Product");
const Category = require("../models/Category");

const bcrypt = require("bcryptjs");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    return res.json({ users });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const createUser = async (req, res) => {
  const { name, email, password, image, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters" });
  }
  try {
    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) return res.status(409).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      image: image || "",
      role: role || "user",
    });
    const { password: _, ...userData } = user.toObject();
    return res.status(201).json({ message: "User created", user: userData });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateUser = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (name !== undefined) user.name = name.trim();
    if (email !== undefined) user.email = email.toLowerCase().trim();
    if (role !== undefined) user.role = role;
    if (password) {
      if (password.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
      user.password = await bcrypt.hash(password, 10);
    }
    await user.save();
    const { password: _, ...userData } = user.toObject();
    return res.json({ message: "User updated", user: userData });
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
    const { name, description, price, images, image, category, countInStock } = req.body;
    const product = await Product.create({
      name,
      description,
      price,
      images: images && images.length > 0 ? images : image ? [image] : [],
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

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.json({ categories });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Category name is required" });
    }
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const category = await Category.create({ name: name.trim(), description: description || "" });
    return res.status(201).json({ message: "Category created", category });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: name?.trim(), description },
      { new: true, runValidators: true },
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.json({ message: "Category updated", category });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.json({ message: "Category deleted" });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};
