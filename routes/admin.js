const express = require("express")
const router = express.Router();
const passport = require("passport");
//require("../middlewares/passportAccessToken.js");
const courseMiddleware = require("../middlewares/courseMiddlewares");
//const checkAdmin = require("../middlewares/authenticationAdmin.js")
const adminController = require("../controllers/AdminController.js");
const profileMiddleware = require("../middlewares/profileMiddlewares");
const {upload, storage} = require('../config/multer');

router.get("/waitingTutor/:id", adminController.getDetailTutor);
router.get("/waitingTutor", adminController.getWaitingListTutor);
router.get("/accepted/:id", adminController.acceptTutor);
router.get("/denied/:id", adminController.denyTutor);

router.get("/account/edit/:id", adminController.getEditUserPage);
router.get("/ban/:id", adminController.banUser);
router.get("/unban/:id", adminController.unbanUser);
router.get("/account", adminController.getAccountPage);

router.get("/courses/create", adminController.getCreateCoursePage);
router.post("/courses/create", courseMiddleware.createValidator, adminController.postCreateCoursePage);
router.get("/courses/edit/:id", adminController.getEditCoursePage);
router.put("/courses/edit/:id", courseMiddleware.createValidator, adminController.putEditCoursePage);
router.delete("/courses/:id", adminController.destroyCourse);
router.get("/courses", adminController.getCoursePage);
router.get("/viewListCourse", adminController.getCoursePage);

router.get('/profile',adminController.profile);
router.post('/profile',upload.single('avatar'), profileMiddleware.postValidator, adminController.editProfile);
router.get("/", adminController.getHomePage);
module.exports = router;
