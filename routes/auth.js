const express = require("express");
const router = express.Router();

const authController = require("../controllers/AuthController");

router.get("/signin", authController.getSignIn);
router.get("/login", authController.getSignIn);
router.get("/signup", authController.getSignUp);
router.get("/register", authController.getSignUp);
router.post("/signin", authController.postSignIn);
router.post("/signup", authController.postSignUp);
router.post("/register", authController.postSignUp);
//router.get("/forget-password", authController.forgetpassword);
router.get("/forget-password", authController.getForgetPassword);
router.post("/forget-password", authController.postForgetPassword);
router.get("/reset-password", authController.getResetPassword);
router.post("/reset-password", authController.postResetPassword);
router.get("/", authController.getHomePage);


module.exports = router;
