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
router.post("/product", checkAdmin, UploadProduct, adminControllers.postANewProduct)

router.get("/productlist", checkAdmin, adminControllers.getProductList)
router.get("/dashboard", checkAdmin, adminControllers.getDashBoard)

router.get("/account", adminControllers.getAccountPage);
router.get("/add", adminControllers.addProduct);
router.get("/calendar", adminControllers.getCalendar);
router.get("/change-password", adminControllers.changePassword);
router.get("/confirm-password", adminControllers.confirmPassword);
router.get("/contact", adminControllers.getContact);
router.get("/delivery", adminControllers.getDelivery);
router.get("/edit", adminControllers.getEdit);
router.get("/profile", adminControllers.getProfile);
router.get("/", adminControllers.getHomePage);

module.exports = router;
