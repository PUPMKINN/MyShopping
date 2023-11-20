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
/* GET 404 page. */
router.get('/404', function(req, res, next) {
  res.render('404/404');
});

router.get('/product_page', function(req, res, next) {
  res.render('product_page/product_page');
});


module.exports = router;
