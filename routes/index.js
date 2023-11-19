var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/home');
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login/login');
});

module.exports = router;
