const Product = require("../models/Product");
const Review = require("../models/Review");
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");
const mongoose = require("mongoose");


// [GET] /product/detail/:id
const show = async(req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

    const reviews = await Review.find({ productId: req.params.id });
    console.log("Product:", product);
    console.log("Reviews:", reviews);
    res.render("product/product", {
      product: mongooseToObject(product),
      reviews: mutipleMongooseToObject(reviews),
    });
  } catch (err) {
    next(err);
  }
}

// [GET] /product/create
const create = (req, res, next) => {
  res.render("updateProduct/user_create");
}

// [POST] /product/store
const store = (req, res, next) => {
  //res.json(req.body);
  const formData = req.body;
  const product = new Product(formData);
  product.save().then;
  res.redirect("/");
}

// [GET] /product/:id/edit
const edit = (req, res, next) => {
  Product.findById(req.params.id)
  .then((product) =>

    res.render("updateProduct/user_update", {
      product: mongooseToObject(product),
    })
  )
  .catch(next);
}

// [PUT] /product/:id
const update = (req, res, next) => {
  Product.updateOne({ _id: req.params.id }, req.body)
  .then(() => res.redirect("/me/stored/products"))
  .catch(next);
  //res.json(req.body);
}

// [DELETE] /Products/:id
const destroy = (req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  Product.deleteOne({ _id: id })
  .then(() => res.redirect("back"))
  .catch((error) => {
    console.error("Lỗi khi xóa bản ghi:", error);
    next(error); // Chuyển error cho middleware xử lý lỗi
  });
}


module.exports = {
  show,
  create, 
  store, 
  edit, 
  update, 
  destroy,
};
