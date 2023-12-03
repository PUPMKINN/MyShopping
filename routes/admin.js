const express = require("express")
const router = express.Router();
//const passport = require("passport");
//require("../middlewares/passportAccessToken.js");

//const checkAdmin = require("../middlewares/authenticationAdmin.js")
const adminControllers = require("../controllers/AdminController.js");


const multerConfig = require("../config/multer.js")
const multer = require("multer");


const upload = multerConfig;

const UploadProduct = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'gallery', maxCount: 8 },
]);



router.get("/admin/home-page", adminControllers.getHomePage);
router.get("/admin/product/:productId", adminControllers.getProductDetail)

router.get("/admin/product",  adminControllers.getFormCreateNewProduct)
router.post("/admin/product", checkAdmin, UploadProduct, adminControllers.postANewProduct)

router.get("/admin/productlist", checkAdmin, adminControllers.getProductList)
router.get("/admin/dashboard", checkAdmin, adminControllers.getDashBoard)


module.exports = router;
