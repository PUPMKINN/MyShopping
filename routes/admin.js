const express = require("express")
const router = express.Router();
const passport = require("passport");
//require("../middlewares/passportAccessToken.js");
const courseMiddleware = require("../middlewares/courseMiddlewares");
//const checkAdmin = require("../middlewares/authenticationAdmin.js")
const adminController = require("../controllers/AdminController.js");
const profileMiddleware = require("../middlewares/profileMiddlewares");
const {upload, storage} = require('../config/multer');
const { isAdmin } = require('../middlewares/isAuthenticated');

router.get("/waitingTutor/:id", isAdmin, adminController.getDetailTutor);
router.get("/waitingTutor", isAdmin,adminController.getWaitingListTutor);
router.get("/accepted/:id", isAdmin,adminController.acceptTutor);
router.get("/denied/:id", isAdmin,adminController.denyTutor);

router.get("/account/edit/:id", isAdmin,adminController.getEditUserPage);
router.get("/ban/:id", isAdmin,adminController.banUser);
router.get("/unban/:id", isAdmin,adminController.unbanUser);
router.get("/account", isAdmin,adminController.getAccountPage);

router.get("/courses/create", isAdmin,adminController.getCreateCoursePage);
router.post("/courses/create", isAdmin,courseMiddleware.createValidator, adminController.postCreateCoursePage);
router.get("/courses/edit/:id", isAdmin,adminController.getEditCoursePage);
router.put("/courses/edit/:id", isAdmin,courseMiddleware.createValidator, adminController.putEditCoursePage);
router.delete("/courses/:id", isAdmin,adminController.destroyCourse);
router.get("/courses", isAdmin,adminController.getCoursePage);
router.get("/viewListCourse", isAdmin,adminController.getCoursePage);

router.get('/profile',isAdmin,adminController.profile);
router.post('/profile',isAdmin,upload.single('avatar'), profileMiddleware.postValidator, adminController.editProfile);
router.get("/", isAdmin,adminController.getHomePage);
module.exports = router;
