const express = require('express');
const router = express.Router();
const meController = require('../controllers/MeController');

router.get('/stored/courses', meController.storedProducts);
router.get('/cart', meController.getCart);
router.get('/checkout', meController.getCheckOut);

module.exports = router;
