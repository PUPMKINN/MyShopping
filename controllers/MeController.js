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
  //Truyền những món hàng trong cart
  res.render("cart/cart");
}
//[GET] /user/checkout
const getCheckOut = (req, res, next) => {
  //Lưu vào order
  res.render("checkout/checkout");
}
//[GET] /user/contact

const getContact = (req, res, next) => {
  //Gửi thông tin tới admin
  res.render("contact/contact");
}

const getWishlist = (req, res, next) => {
  //Xem danh sách yêu thích , có nút xóa
  res.render("wishlist/wishlist");
}

const getHomePage = (req, res, next) => {
  res.render("home/user_home");
}
const getProfile = (req, res, next) => {
  res.render("home/user_profile");
}
module.exports = {
  storedProducts,
  getCart,
  getCheckOut,
  getContact,
  getWishlist,
  getHomePage,
  getProfile,
};
