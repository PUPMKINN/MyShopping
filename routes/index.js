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
/* GET admin page. */
router.get('/admin', function(req, res, next) {
  res.render('admin/admin');
});

router.get('/product', function(req, res, next) {
  res.render('product/product');
});

/* GET 404 page. */
router.get('/404', function(req, res, next) {
  res.render('404/404');
});


module.exports = router;
