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
//[GET] /user/contact

const getContact = (req, res, next) => {
  res.render("contact/contact");
}

const getWishlist = (req, res, next) => {
  res.render("wishlist/wishlist");
}

module.exports = {
  storedProducts,
  getCart,
  getCheckOut,
  getContact,
  getWishlist,
};
