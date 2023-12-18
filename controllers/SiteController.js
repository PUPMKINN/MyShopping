const Product = require("../models/Product");
const { mutipleMongooseToObject } = require("../util/mongoose");


// [GET] /home
const getHomePage = async(req, res, next) => {
  Product.find({})
  .then((products) => {
    res.render("home", {
      products: mutipleMongooseToObject(products),
    });
  })
  .catch(next);
    // Product.find({})
    //   .lean()
    //   .then((Products) => {
    //     Product.find({}).lean();
    //     res.render("home", { Products: Products });
    //   })
    //   .catch((error) => {
    //     next(error);
    //   });
    // Product.find({}, function (err, Products) {
    //   if (!err) {
    //     res.json(Products);
    //   } else {
    //     next(err);
    //     //res.status(400).json({ err: "ERROR!!!" });
    //   }
    // });
    // try {
    //   const Products = await Product.find({});
    //   res.json(Products);
    // } catch (error) {
    //   res.status(400).json({ err: "ERROR!!!" });
    // }
    //res.render("home  ")
}

// [GET] /search
const search = (req, res) => {
  res.render("search");
}

const AboutUs = (req, res) => {
  res.render("aboutus/aboutus");
}

module.exports = {
  getHomePage,
  AboutUs,
  search,
};
