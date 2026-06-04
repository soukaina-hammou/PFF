const express = require("express");
const { getHeroSlides } = require("../controllers/heroController");

const router = express.Router();

router.get("/", getHeroSlides);

module.exports = router;
