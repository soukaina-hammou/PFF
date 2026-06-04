const Category = require("../models/Category");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    return res.json({ categories });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getCategories };
