const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/UserController');
const {isUser} = require('../middlewares/isAuthenticated');
const orderMiddleware = require("../middlewares/orderMiddlewares");
const beTutorMiddleware = require("../middlewares/beTutorMiddlewares");
const profileMiddleware = require("../middlewares/profileMiddlewares");
const authMiddleware = require("../middlewares/authMiddlewares");
const {upload, storage} = require('../config/multer');

// usermode
router.get('/userMode', isUser, userController.getUserMode);

router.get('/stored/courses/:id', isUser, userController.detailCourses);
router.get('/stored/courses', isUser, userController.storedCourses);
router.get('/stored/coursesAjax', isUser, userController.storedCoursesAjax);

//texting 
router.get('/texting/:id', isUser, userController.getChat);
router.post('/texting/:id', isUser, userController.postChat);


router.get('/profile', isUser, userController.profile);
router.post('/profile', isUser,upload.single('avatar'), profileMiddleware.postValidator,  userController.editProfile);


router.get('/premium', isUser, userController.getPremium);
router.get('/formTutor/:page', isUser, userController.getFormTutor);
router.post('/formTutor/:page', isUser, upload.single('GPAfile'), beTutorMiddleware.postValidator, userController.postFormTutor);

router.get('/contactToTutor/:id', isUser, userController.getContactToTutor);
router.post('/contactToTutor/:id', isUser, orderMiddleware.postValidator,userController.postContactToTutor);

router.get('/changePassword', isUser, userController.getChangePassword);
router.post('/changePassword', isUser, authMiddleware.updateValidator, userController.postChangePassword);

router.get('/courses/:id', isUser,userController.detail);
router.get('/courses/', isUser, userController.showAll);
router.get('/', isUser, userController.getHomePage);




module.exports = router;
