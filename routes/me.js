const express = require('express');
const router = express.Router();
const meController = require('../controllers/MeController');

router.get('/stored/courses', meController.storedProducts);

module.exports = router;
