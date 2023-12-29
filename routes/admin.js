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



router.get("/adminhome", adminControllers.getHomePage);
router.get("/product/:productId", adminControllers.getProductDetail)

router.get("/product", adminControllers.getFormCreateNewProduct)
router.post("/product", UploadProduct, adminControllers.postANewProduct)

router.get("/productlist", adminControllers.getProductList)
router.get("/dashboard", adminControllers.getDashBoard)

router.get("/account/edit/:id", adminControllers.getEditUserPage);
router.put("/account/edit/:id", adminControllers.putEditUserPage);
router.delete("/account/:id", adminControllers.destroyUser);
router.get("/account", adminControllers.getAccountPage);
router.get("/add", adminControllers.getAddProduct);
router.post("/add", adminControllers.postAddProduct);
router.get("/calendar", adminControllers.getCalendar);
//router.get("/change-password", adminControllers.changePassword);
//router.get("/confirm-password", adminControllers.confirmPassword);
router.get("/contact", adminControllers.getContact);
router.get("/delivery/edit/:id", adminControllers.getEditDeliveryPage);
router.put("/delivery/edit/:id", adminControllers.putEditDeliveryPage);
router.delete("/delivery/:id", adminControllers.destroyDelivery);
router.get("/delivery", adminControllers.getDelivery);
router.get("/product/edit/:id", adminControllers.getEditProductPage);
router.put("/product/edit/:id", adminControllers.putEditProductPage);
router.delete("product/:id", adminControllers.destroyProduct);
router.get("/product", adminControllers.getProductPage);
router.get("/profile", adminControllers.getProfile);
router.put("/profile", adminControllers.putEditProfile);
router.get("/", adminControllers.getHomePage);

module.exports = router;
