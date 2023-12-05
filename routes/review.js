const express = require("express")
const router = express.Router();

const reviewController = require("../controllers/ReviewController");

router.post('/store/:id', reviewController.store);

module.exports = router;