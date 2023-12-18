const User = require('../models/User');
const ProductService = require("../services/Product.js")

  //[GET] /category ? productName=""
const show = async (req, res, next) => {
  try {
    const productName = req.query.productName;
    //const catalogId = req.query.catalogId;
    const color = req.query.color; // ARRAY[1,2,3,4,6,7,]
    const size = req.query.size;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const brand = req.query.brand;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;

    const pageSize = 12;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await ProductService.PrfilteredAndSorted(
      productName, color, size, brand, minPrice, maxPrice, sortByField, sortByOrder
    );
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const productList = await ProductService.PrfilteredSortedPaging(
      productName, color, size, brand, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
    );
      
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    
    if (productList) {
      res.render("category/category", { 
        productList: productList,
        pages: pages,
        prevPage: prevPage,
        currentPage: currentPage,
        nextPage: nextPage,
      });
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