//const { json } = require("body-parser");
//const connection = require("../config/database.js");
const mongoose = require("mongoose");

// Model
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const Product = require("../models/Product.js");
const Order = require("../models/Order.js");
const Contact = require("../models/Contact.js");
//const Catalog = require("../models/Catalog.js");

//Service
const ProductService = require("../services/Product.js")

const { use } = require("passport");
//const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailApi.js");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose.js");


require('dotenv').config();

const getHomePage = async (req, res, next) => {
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
            res.render("admin/home/admin", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}


const getDashBoard = (req, res, next) => {
    try {
        const user = req.user;
        res.render("DashBoardAdmin.ejs");
    }
    catch {
        next(error);
    }
}

const getProductDetail = async (req, res, next) => {
    try {

        const productId = req.params.productId;

        const { productInfo, relatedProducts, productReviews } = await ProductService.getAnProductDetail(productId);


        if (productInfo) {

            // Render file in here! Pleases!!!!!!!!!

            res.status(200).json({ productInfo, relatedProducts, productReviews });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getFormCreateNewProduct = (req, res, next) => {
    try {

        res.render("CreateNewProduct.ejs");
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}



const postANewProduct = async (req, res, next) => {
    if (!req.files) {
        return res.status(400).json({ error: "No file uploaded" });
    }
    try {
        const product = {};
        const { thumbnail, gallery } = await ProductService.saveFileAndGetUrlFromThumbnailAndGallery(req.files);

        product.thumbnail = thumbnail;
        product.gallery = gallery;
        product.catalogId = new mongoose.Types.ObjectId(req.body.catalogId);
        product.name = req.body.name;
        product.price = req.body.price;
        product.description = req.body.description;
        product.discount = req.body.discount;
        product.status = req.body.status;
        product.manufacturer = req.body.manufacturer;

        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json({ message: "Create product successfully", newProduct });

    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const getProductList = async (req, res, next) => {
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
            res.render("AdminProducts.ejs", { productList: productList });
        }
        else {
            res.status(404).json({ message: "Not found" });
        }

    } catch (error) {
        next(error);
    }
}

const getAccountPage = async (req, res, next) => {
    // 1 list user, amount of user
    const userListFull = await User.find();
    const pageSize = 4;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const totalCourses = userListFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if(nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if(prevPage < 1) prevPage = 1;
    const userList = await User.find().skip(skipAmount).limit(pageSize).lean();
    res.render('admin/account/admin-account', {
        userList: userList,
        amountOfUser: userList.length,
        pages: pages,
        prevPage: prevPage,
        currentPage: currentPage,
        nextPage: nextPage,
    });
}
const getEditUserPage = async (req, res, next) => {
    const user = await User.findById(req.params.id).lean();
    res.render("", {
        user: user,
    })
}
const putEditUserPage = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    User.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa khóa học thành công!"}))
    .catch(next);
}
const destroyUser = async (req, res, next) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    User.deleteOne({ _id: id })
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Xóa user thành công!"}))
    .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const getAddProduct = (req, res, next) => {
    //
    res.render('admin/add/add');
}
const postAddProduct = async (req, res, next) => {
// Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
  }
  //res.json(req.body);
  const checkList = await Product.find({name: req.body.name});
  if(checkList!=null) {
    return res.status(304).json({error: 'Bạn đã đăng món hàng này rồi!'})
  }
  const formData = req.body;
  const product = new Product(formData);
  product.save().then;
  return res.status(200).json({success: true, redirectUrl: '/admin', msg: "Đăng khóa học thành công!"})

}

const getCalendar = (req, res, next) => {
    //
    res.render('admin/calendar/calendar');
}
const changePassword = (req, res, next) => {
    // Bên user
    res.render('admin/change-password/change-password');
}
const confirmPassword = (req, res, next) => {
    // Bên user
    res.render('admin/confirm-password/confirm-password');
}
const getContact = async (req, res, next) => {
    //Bên user
    const contactList = await Contact.find().populate('userId').lean();
    res.render('admin/contact/contact');
}

const getDelivery = async(req, res, next) => {
    // Hiển thị trạng thái order
    const orderList = await Order.find().populate('userId listItem').lean();

    res.render('admin/delivery/delivery', {
        orderList: orderList,
        amountOfOrder: orderList.length,
    });
}
const getEditDeliveryPage = async (req, res, next) => {
    const order = await Order.findById(req.params.id).lean();
    res.render("", {
        order: order,
    })
}
const putEditDeliveryPage = async (req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    Order.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa món hàng thành công!"}))
    .catch(next);
}
const destroyDelivery = async (req, res, next) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    Order.deleteOne({ _id: id })
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Xóa user thành công!"}))
    .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const getProductPage = async(req, res, next) => {
    const productList = await Product.find().lean();
    res.render("", {
        productList: productList,
        amountOfProduct: productList.length,
    })
}
const getEditProductPage = async(req, res, next) => {
    //Edit sản phẩm 
    const product = await Product.findById(req.params.id).lean()
    res.render('admin/edit/edit', {
      product: product,
    })
}
const putEditProductPage = async(req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    Product.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa món hàng thành công!"}))
    .catch(next);
}
const destroyProduct = async (req, res, next) => {
    var id = new mongoose.Types.ObjectId(req.params.id);
    Product.deleteOne({ _id: id })
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Xóa user thành công!"}))
    .catch((error) => {
        console.error("Lỗi khi xóa bản ghi:", error);
        next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const getProfile = async(req, res, next) => {
    //Xem thông tin profile, có nút update profile
    const user = User.findById(req.user._id).lean();
    res.render('admin/profile/admin-profile', {
        user: user,
    });
}
const putEditProfile = async(req, res, next) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      res.status(400).json({ errors: result.array() });
      return;
    }
    User.updateOne({ _id: req.user._id }, req.body)
    .then(() => res.status(200).json({success: true, redirectUrl: '/admin', msg: "Chỉnh sửa món hàng thành công!"}))
    .catch(next);
}
module.exports = {
    getHomePage,
    getDashBoard,
    getProductDetail,
    getFormCreateNewProduct,
    postANewProduct,
    getProductList,
    getAccountPage,
    getEditUserPage,
    putEditUserPage,
    destroyUser,
    getAddProduct,
    postAddProduct,
    getCalendar,
    changePassword,
    confirmPassword,
    getContact,
    getDelivery,
    getEditDeliveryPage,
    putEditDeliveryPage,
    destroyDelivery,
    getProductPage,
    getEditProductPage,
    putEditProductPage,
    destroyProduct,
    getProfile,
    putEditProfile,
}