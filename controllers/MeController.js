const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /me/stored/products
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

module.exports = {
  storedProducts,
};
