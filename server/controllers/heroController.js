const HeroSlide = require("../models/HeroSlide");

const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlide.find({ active: true }).sort({ order: 1, createdAt: -1 });
    return res.json({ slides });
  } catch {
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getHeroSlides };
