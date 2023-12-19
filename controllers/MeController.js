const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /user/stored/products
const storedProducts = async(req, res, next) => {
  Product.find({})
  .then((products) => {
    res.render("me/stored-Products", {
      products: mutipleMongooseToObject(products),
    });
  })
  .catch(next);
    //res.render("me/stored-products");
}
//[GET] /user/cart 
const getCart = (req, res, next) => {
  res.render("cart/cart");
}
//[GET] /user/checkout
const getCheckOut = (req, res, next) => {
  res.render("checkout/checkout");
}

module.exports = {
  storedProducts,
  getCart,
  getCheckOut,
};
