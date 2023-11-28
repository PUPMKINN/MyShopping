// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('home/home');
// });

// /* GET login page. */
// router.get('/login', function(req, res, next) {
//   res.render('login/login');
// });
// /* GET admin page. */
// router.get('/admin', function(req, res, next) {
//   res.render('admin/admin');
// });

// /* GET product page. */
// router.get('/product', function(req, res, next) {
//   res.render('product/product');
// });

// /* GET category page. */
// router.get('/category', function(req, res, next) {
//   res.render('category/category');
// });

// /* GET cart page. */
// router.get('/cart', function(req, res, next) {
//   res.render('cart/cart');
// });

// /* GET checkout page. */
// router.get('/checkout', function(req, res, next) {
//   res.render('checkout/checkout');
// });


// /* GET 404 page. */
// router.get('/404', function(req, res, next) {
//   res.render('404/404');
// });


// module.exports = router;
const meRouter = require("./me");
const siteRouter = require("./site");
const productRouter = require("./product");
const authRouter = require("./auth");

function route(app) {
  //   app.get("/news", function (req, res) {
  //     res.render("news");
  //   });
  app.use("/news", newsRouter);

  //   app.get("/search", function (req, res) {
  //     console.log(req.query.q);
  //     res.render("search");
  //   });

  app.post("/search", function (req, res) {
    console.log(req.body);
    res.send("");
  });
  //   app.get("/", function (req, res) {
  //     res.render("home");
  //   });
  app.use("/me", meRouter);
  app.use("/product", productRouter);
  app.use("/home", siteRouter);
  app.use("/", authRouter);
}

module.exports = route;
