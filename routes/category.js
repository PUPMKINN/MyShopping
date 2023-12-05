const express = require("express");
const router = express.Router();

const categoryController = require("../controllers/CategoryController.js");

router.get("/", categoryController.show);

module.exports = router;