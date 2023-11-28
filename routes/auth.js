const express = require("express");
const router = express.Router();

const loginController = require("../controllers/AuthController");


router.get("/login", loginController.getSignIn);
router.get("/signup", loginController.getSignUp);
router.post("/login", loginController.postSignIn);
router.post("/signup", loginController.postSignUp);
//router.get("/register", loginController.register);
//router.get("/forget-password", loginController.forgetpassword);
router.get("/", loginController.index);


module.exports = router;
