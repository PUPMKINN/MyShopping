const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductController');

router.get('/create', productController.create);
router.post('/store', productController.store);
router.get('/:id/edit', productController.edit);
router.put('/:id', productController.update);
router.delete('/:id', productController.destroy);
router.get('/:slug', productController.show);

module.exports = router;