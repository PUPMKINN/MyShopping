const User = require('../models/User');
const ProductService = require("../services/Product.js")

  //[GET] /
const show = async (req, res, next) => {
  try {
    const productName = req.query.productName;
    const catalogId = req.query.catalogId;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const manufacturer = req.query.manufacturer;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;

    const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        
    if (productList) {
      res.render("category/category", { productList: productList });
    }
    else {
      res.status(404).json({ message: "Not found" });
    }

  } catch (error) {
    next(error);
  }
};

module.exports = {
    show,
  };