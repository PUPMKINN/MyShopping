const Product = require("../models/Product");
const { mongooseToObject } = require("../util/mongoose");
const mongoose = require("mongoose");


// [GET] /product/detail/:id
const show = (req, res, next) => {
  Product.findById(req.params.id)
  .then((product) => {
    res.render("product/product", {
      product: mongooseToObject(product),
    });
    //res.json(product);
  })
  .catch(next);
  //res.send("Product" + req.params.slug);
}

// [GET] /product/create
const create = (req, res, next) => {
  res.render("products/create");
}

// [POST] /product/store
const store = (req, res, next) => {
  //res.json(req.body);
  const formData = req.body;
  formData.image =
    "https://img.youtube.com/vi/" + req.body.videoID + "/sddefault.jpg";
  const product = new Product(formData);
  product.save().then;
  res.redirect("/home");
}

// [GET] /product/:id/edit
const edit = (req, res, next) => {
  Product.findById(req.params.id)
  .then((product) =>
    res.render("products/edit", {
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
