const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../util/mongoose");

class MeController {
  // [GET] /me/stored/products
  async storedProducts(req, res, next) {
    Product.find({})
      .then((products) => {
        res.render("me/stored-Products", {
          products: mutipleMongooseToObject(products),
        });
      })
      .catch(next);
    //res.render("me/stored-products");
  }
}

module.exports = new MeController();
