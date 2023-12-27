const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Contact = require("../models/Contact");
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
  const user = User.findById(req.user._id);
  res.render("cart/cart", {
    user: user,
  });
}
//[GET] /user/checkout
const getCheckOut = (req, res, next) => {
  //Lưu vào order
  const user = User.findById(req.user._id);
  res.render("checkout/checkout", {
    user: user,
  });
}
//[POST] /user/checkout
const postCheckOut = (req, res, next) => {
  //Lưu vào order
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  const formData = req.body;
  const order = new Order(formData);
  order.save().then;
  return res.status(200).json({success: true, redirectUrl: '/admin', msg: "Đã mua hàng!"})
}

//[GET] /user/contact
const getContact = (req, res, next) => {
  //Gửi thông tin tới admin
  res.render("contact/contact");
}
//[POST] /user/contact
const postContact = (req, res, next) => {
  //Lưu vào order
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  const formData = req.body;
  const contact = new Contact(formData);
  contact.save().then;
  return res.status(200).json({success: true, redirectUrl: '/admin', msg: "Đã mua hàng!"})
}

const getWishlist = (req, res, next) => {
  //Xem danh sách yêu thích , có nút xóa
  const user = User.findById(req.user._id);
  res.render("wishlist/wishlist", {
    user: user,
  });
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
  postCheckOut,
  getContact,
  postContact,
  getWishlist,
  getHomePage,
  getProfile,
};
