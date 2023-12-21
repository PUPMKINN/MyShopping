const express = require('express');
const router = express.Router();
const meController = require('../controllers/MeController');

router.get('/stored/courses', meController.storedProducts);
router.get('/cart', meController.getCart);
router.get('/checkout', meController.getCheckOut);
router.get('/contact', meController.getContact);
router.get('/wishlist', meController.getWishlist);
router.get('/profile', meController.getProfile);
router.get('/', meController.getHomePage);



module.exports = router;
