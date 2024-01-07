const Course = require("../models/Course");
const User = require("../models/User");
const BeTutor = require("../models/BeTutor");
const Order = require("../models/Order");
const Review = require("../models/Review");
const Contact = require("../models/Contact");
const CourseService = require("../services/product");

const { validationResult, check } = require("express-validator");
const { mutipleMongooseToObject, mongooseToObject } = require("../util/mongoose");
const UserService = require("../services/user");
const profileService = require("../services/profile");

// [GET] /user/stored/courses
const storedCourses = async (req, res, next) => {
  const orders = await Order.find({ userId: req.user._id });

  const pageSize = 4;
  //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
  const totalCourses = orders.length;
  const totalPages = Math.ceil(totalCourses / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
  console.log(orders.length);
  const namePage = "courses";
  const orderList = await Order.find({ userId: req.user._id }).populate('courseId userId').skip(skipAmount).limit(pageSize).lean();
  res.render("user/courses", {
    orders: orderList,
    user: mongooseToObject(req.user),
    pages: pages,
    prevPage: prevPage,
    currentPage: currentPage,
    nextPage: nextPage,
    namePage: namePage,
    layout: 'user',
  });
}

// [GET] /user/stored/courses/Order._id
const detailCourses = async (req, res, next) => {
  const order = Order.findById(req.params.id).populate('courseId userId');
  const user = await User.findById(req.user._id).lean();
  res.render("user/stored-courses", {
    orders: mongooseToObject(order),
    layout: 'user',
    user: user,
  });
}


const getUserMode = async (req, res, next) => {
  const user = await User.findById(req.user._id).lean();
  res.render('user/userMode', {
    user: user,
    layout: 'user',
  });
}


// [GET] /user/profile
const profile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Tìm user trong database dựa vào userId
    const user = await User.findById(userId).populate('avatar');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.render('user/editprofile', { user: mongooseToObject(user), layout: 'user', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
//[POST] /tutor/profile
const editProfile = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    if (req.file) {
      await profileService.cropImage(req.file.filename);
      req.body.avatar = req.file.filename;
    }
    User.updateOne({ _id: req.user._id }, req.body)
      .then(res.status(200).json({ msg: 'Cập nhật thông tin thành công' }))
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}

// [GET] /user/premium
const getPremium = async(req, res, next) => {
  const role = req.user.role;
  const user = await User.findById(req.user._id).lean();
  res.render('user/signuptotutor', { user: user, layout: role, role: role });
}
// [GET] /user/formTutor/123
const getFormTutor = async(req, res, next) => {
  let price;
  if (req.params.page == '1') { price = 199000 }
  else if (req.params.page == '2') { price = 1999000 }
  else if (req.params.page == '3') { price = 3999000 };

  const role = req.user.role;
  const user = await User.findById(req.user._id).lean();
  res.render('user/formbetutor', {
    user: user,
    price: price,
    page: req.params.page,
    layout: role,
    role: role,
  });
}
// [POST] /user/formTutor/123
//fullname, phoneNumber, GPA, GPAfile
const postFormTutor = async (req, res, next) => {
  // Verify user input
  const result = validationResult(req);
  if (!result.isEmpty()) {
    console.log(result.array());
    res.status(400).json({ errors: result.array() });
    return;
  }
  //chống spam
  const checkBeTutor = await BeTutor.find({ tutorId: req.user._id, status: "waiting" });
  if (checkBeTutor.length > 0) return res.status(304).json({ success: true, error: "Bạn đã đăng ký rồi! Hãy chờ admin phản hồi bạn!" });

  var leftDay = Number.MAX_SAFE_INTEGER;
  var leftCourse = Number.MAX_SAFE_INTEGER;
  const beTutors = await BeTutor.find({ tutorId: req.user._id, status: "accepted" }).populate('tutorId');
  for (let i = 0; i < beTutors.length; i++) {
    const uploadDuration = beTutors[i].tutorId.amountDayUpload * 24 * 60 * 60 * 1000; // Convert days to milliseconds
    const timeSincePost = Date.now() - new Date(beTutors[i].datePost).getTime(); // Calculate time since post in milliseconds
    const temp = uploadDuration - timeSincePost;
    if (temp > 0 && temp < leftDay) leftDay = temp;

    const amountCourseUploaded = await Course.find({ tutor: req.user._id }).countDocuments();
    console.log(beTutors[i].tutorId.amountCourseUpload, amountCourseUploaded)
    const tempCourse = beTutors[i].tutorId.amountCourseUpload - amountCourseUploaded;
    if (tempCourse > 0 && tempCourse < leftCourse) leftCourse = tempCourse;
  }
  leftDay = leftDay === Number.MAX_SAFE_INTEGER ? 0 : Math.ceil(leftDay / (24 * 60 * 60 * 1000));
  leftCourse = leftCourse === Number.MAX_SAFE_INTEGER ? 0 : leftCourse;
  if (leftDay > 0 || leftCourse > 0) {
    return res.status(304).json({ success: true, error: "Bạn đã là tutor rồi! Hãy chờ hết hạn để đăng ký mới!" });
  }

  let price;
  if (req.params.page == '1') { price = 199000 }
  else if (req.params.page == '2') { price = 1999000 }
  else if (req.params.page == '3') { price = 3999000 };
  try {
    const { fullname, phoneNumber, GPA, comment } = req.body;
    var savedUser = {
      fullname: req.body.fullname,
      phoneNumber: req.body.phoneNumber,
      GPA: req.body.GPA,
    }
    if (req.file) {
      savedUser.GPAfile = req.file.filename;
    }

    // Lưu user vào database
    try {
      await User.updateOne({ _id: req.user._id }, savedUser);
    } catch (updateError) {
      console.error(updateError);
      return res.status(400).json({ success: false, error: 'Cập nhật thông tin không thành công' });
    }
    let newTutor;
    newTutor = new BeTutor({
      price: price,
      tutorId: req.user._id,
      comment: req.body.comment,
    });
    try {
      await newTutor.save();
    } catch (saveError) {
      console.error(saveError);
      return res.status(401).json({ success: false, error: 'Gửi thất bại' });
    }
    return res.status(200).json({ success: true, msg: "Đã gửi yêu cầu tới admin!" })

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}



const getContactToTutor = async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate('tutor');
  const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
  let amountOfReviews;

  if (reviews === null || reviews.length === 0) {
    amountOfReviews = 0;
  } else {
    amountOfReviews = reviews.length;
  }
  console.log(amountOfReviews)
  const role = req.user.role;
  const user = await User.findById(req.user._id).lean();
  res.render('user/contactToTutor', {
    course: mongooseToObject(course),
    amountOfReviews: amountOfReviews,
    layout: role,
    role: role,
    user: user,
  });
}

const postContactToTutor = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    //Chống spam
    const checkOrder = await Order.find({ userId: req.user._id, courseId: req.params.id, status: "Subscribing" || "Learning" });
    //console.log(checkOrder.length);
    if (checkOrder.length > 0) return res.status(304).json({ success: true, error: "Bạn đã đăng ký khóa học rồi! Hãy chờ tutor accept bạn vào khóa học!" })

    const formData = req.body;
    formData.courseId = req.params.id;
    formData.userId = req.user._id;

    const order = new Order(formData);
    await order.save();
    console.log(order)
    return res.status(200).json({ success: true, msg: "đã gửi contact thành công! Vui lòng chờ đợi phản hồi" });
    //return res.send("Thêm review thành công!").redirect("/user/home");
  }
  catch (err) {
    next(err);
  }
}

const getHomePage = async (req, res, next) => {
  try {
    const reviewList = await Review.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "course"
        }
      },
      {
        $unwind: "$course"
      },
      {
        $project: {
          courseId: 1,
          userId: 1,
          rating: 1,
          comment: 1,
          datePost: 1,
          commentLength: { $strLenCP: "$comment" },
          user: 1, // include all fields from the user document
          course: 1 // include all fields from the course document
        }
      },
      {
        $sort: { rating: -1, commentLength: -1 }
      }
    ]).limit(3);

    const tutors = await User.find({ role: 'tutor' });
    let userList = await Promise.all(tutors.map(async (tutor) => {
      let averageRating = await UserService.getAverageRatingForTutor(tutor._id.toString());
      //console.log(averageRating);
      return {
        ...tutor.toObject(),
        averageRating: averageRating ? averageRating.averageRating : 0
      };
    }));
    // Sort the userList based on averageRating in descending order
    userList.sort((a, b) => b.averageRating - a.averageRating);

    // Apply skip and limit - here skip 0 and limit 4
    userList = userList.slice(0, 4);
    //console.log(userList);

    const user = await User.findById(req.user._id).lean();
    // console.log(JSON.stringify(reviewList, null, 2));
    res.render('home/userhome', { user: user, layout: 'user', reviewList: reviewList, userList: userList });
  } catch (error) {
    console.error(error);
    next(error);
  }
};
// [GET] /user/courses?page=*;
const showAll = async (req, res, next) => {
  try {
    const searchField = req.query.searchField;
    const courseName = req.query.courseName;
    const tutorName = req.query.tutorName;
    const faculty = req.query.faculty;
    const studentCourse = req.query.studentCourse;
    const average = req.query.average;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;


    const pageSize = 12;
    //filter thay vào trên đây (filter xong lấy ra coursesFull, courses)
    const coursesFull = await CourseService.filteredAndSorted(
      searchField, courseName, tutorName, faculty, studentCourse, average, minPrice, maxPrice, sortByField, sortByOrder
    );
    const totalCourses = coursesFull.length;
    const totalPages = Math.ceil(totalCourses / pageSize);
    const pageNumber = parseInt(req.query.page) || 1;
    const skipAmount = (pageNumber - 1) * pageSize;
    const courses = await CourseService.filteredSortedPaging(
      searchField, courseName, tutorName, faculty, studentCourse, average, minPrice, maxPrice, sortByField, sortByOrder, skipAmount, pageSize
    );
    const role = "user";
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
    console.log(courses.length);
    
    const user = await User.findById(req.user._id).lean();
    res.render('catalog/category', {
      courses: courses,
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
      layout: 'user',
      role: role,
      user: user,
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
}

// [GET] /user/courses/:id
const detail = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('tutor');
    if (!course) {
      return res.status(404).render("404"); // Handle the case where the product is not found
    }

    const coursesListOfTutor = await Course.find({ tutor: course.tutor }).populate('tutor');
    const reviews = await Review.find({ courseId: req.params.id }).populate('userId');
    let amountOfReviews;
    if (reviews === null || reviews.length === 0) {
      amountOfReviews = 0;
    } else {
      amountOfReviews = reviews.length;
    }
    const coursesListOfName = await Course.find({ name: course.name }).populate('tutor');
    console.log(coursesListOfName);
    const user = await User.findById(req.user._id).lean();
    res.render("courses/detail", {
      course: mongooseToObject(course),
      coursesListOfTutor: mutipleMongooseToObject(coursesListOfTutor),
      reviews: mutipleMongooseToObject(reviews),
      amountOfReviews: amountOfReviews,
      coursesListOfName: mutipleMongooseToObject(coursesListOfName),
      layout: 'user',
      user: user,
    });
  } catch (err) {
    next(err);
  }
}

const getChangePassword = async (req, res, next) => {
  const role = req.user.role;
  const user = await User.findById(req.user._id).lean();
  res.render('auth/updatePassword', { user: user, layout: role, role: role });
}
const postChangePassword = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: "New password and confirmation do not match" });
    }
    const user = await User.findById(req.user._id);
    const isMatch = await user.validPassword(oldPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Mật khẩu cũ không đúng' });
    }
    user.password = newPassword;
    await user.save();
    return res.status(200).json({ success: true, msg: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
module.exports = {
  storedCourses,
  detailCourses,
  profile,
  editProfile,
  getPremium,
  getFormTutor,
  postFormTutor,
  getUserMode,
  getHomePage,
  getContactToTutor,
  postContactToTutor,
  showAll,
  detail,
  getChangePassword,
  postChangePassword,
};
