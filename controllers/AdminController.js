//const { json } = require("body-parser");
//const connection = require("../config/database.js");
const mongoose = require("mongoose");

// Model
const User = require("../models/User.js");
const Review = require("../models/Review.js");
const Course = require("../models/Course.js");
const BeTutor = require("../models/BeTutor.js");
const Order = require("../models/Order.js");


//Service
const CourseService = require("../services/product");
const UserService = require("../services/user");
const { mongooseToObject, mutipleMongooseToObject } = require("../util/mongoose");

//const { use } = require("passport");
//const jwt = require("jsonwebtoken");
const { sendMail } = require("./mailAPI.js");
const { validationResult } = require("express-validator");



require('dotenv').config();

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
    console.log(userList);


    // console.log(JSON.stringify(reviewList, null, 2));
    res.render('home/adminhome', { user: req.user, layout: 'admin', reviewList: reviewList, userList: userList });
  } catch (error) {
    console.error(error);
    next(error);
  }
}


//[GET] /admin/waitingTutor?page=*
const getWaitingListTutor = async (req, res, next) => {
  //filter and sort ở đây
  const searchField = req.query.searchField;
  const sortByField = req.query.sortByField;
  const sortByOrder = req.query.sortByOrder;
  var filter = { status: "waiting" };
  var sort = {};
  if (searchField !== `None` && searchField) {
    const checkUser = await BeTutor.findOne({ username: searchField });
    if (checkUser) filter.username = searchField;
    else {
      const checkEmail = await BeTutor.findOne({ email: searchField });
      if (checkEmail) filter.email = searchField;
      else filter.role = searchField;
    }
  }
  if (sortByField !== `None` && sortByField) {
    if (sortByField === 'GPA') {
        sort['tutorId.GPA'] = sortByOrder === `desc` ? -1 : 1;
    } else {
        sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
    }
}
  //tính toán phân trang
  const pageSize = 12;
  const tutorListFull = await BeTutor.find(filter).sort(sort).populate('tutorId');
  const totalTutor = tutorListFull.length;
  const totalPages = Math.ceil(totalTutor / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
  const tutorList = await BeTutor.find(filter).sort(sort).populate('tutorId').skip(skipAmount).limit(pageSize);
  console.log(tutorList);

  res.render('admin/waitingTutor', {
    tutorList: mutipleMongooseToObject(tutorList),
    amountTutor: tutorList.length,
    pages: pages,
    prevPage: prevPage,
    currentPage: currentPage,
    nextPage: nextPage,
    layout: 'admin',
  })
}
//[GET] /admin/waitingTutor/BeTutor._Id
const getDetailTutor = async (req, res, next) => {
  const tutor = await BeTutor.findById(req.params.id).populate('tutorId');

  console.log(tutor)
  res.render('admin/detailTutor', {
    tutor: mongooseToObject(tutor),
    layout: 'admin',
  })
}
//[GET] /admin/accepted/BeTutor._id
const acceptTutor = async (req, res, next) => {
  try {
    const beTutor = await BeTutor.findById(req.params.id).populate('tutorId');
    if (!beTutor) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    //Xử lí khi accept user đăng ký gói rẻ nhất 
    if (beTutor.price == 199000) {
      let formData = {
        amountCourseUpload: 5,
        amountDayUpload: 30,
        role: "tutor",
      };
      beTutor.status = "accepted";
      await beTutor.save();
      await User.updateOne({ _id: beTutor.tutorId }, formData);
      return res.status(200).json({ msg: 'Accepted thành công!' });
    }//Xử lí khi accept user đăng ký gói trung bình  
    else if (beTutor.price == 1999000) {
      let formData = {
        amountCourseUpload: 10,
        amountDayUpload: 365,
        role: "tutor",
      };
      beTutor.status = "accepted";
      await beTutor.save();
      await User.updateOne({ _id: beTutor.tutorId }, formData);
      return res.status(200).json({ msg: 'Accepted thành công!' });
    }//Xử lí khi accept user đăng ký gói mắc nhất  
    else if (beTutor.price == 3999000) {
      let formData = {
        amountCourseUpload: 999999,
        amountDayUpload: 999999,
        role: "tutor",
      };
      beTutor.status = "accepted";
      await beTutor.save();
      await User.updateOne({ _id: beTutor.tutorId }, formData);
      return res.status(200).json({ msg: 'Accepted thành công!' });
    }
  } catch {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
//[GET] /admin/denied/BeTutor._id
const denyTutor = async (req, res, next) => {
  try {
    const beTutor = await BeTutor.findById(req.params.id).populate('tutorId');
    if (!beTutor) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    //beTutor.deleteOne({_id: req.params.id});
    beTutor.status = "denied";
    await beTutor.save();
    return res.status(200).json({ msg: 'Denied thành công!' });
  } catch {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

const getAccountPage = async (req, res, next) => {
  // 1 list user, amount of user
  const searchField = req.query.searchField;
  const sortByField = req.query.sortByField;
  const sortByOrder = req.query.sortByOrder;
  var filter = { role: { $in: ["user", "tutor"] } };
  var sort = {};
  if (searchField !== `None` && searchField) {
    const checkUser = await User.findOne({ username: searchField });
    if (checkUser) filter.username = searchField;
    else {
      const checkEmail = await User.findOne({ email: searchField });
      if (checkEmail) filter.email = searchField;
      else filter.role = searchField;
    }
  }
  if (sortByField !== `None` && sortByField) {
    sort[sortByField] = sortByOrder === `desc` ? -1 : 1;
  }
  //tính toán phân trang
  const pageSize = 12;
  const userListFull = await User.find(filter).sort(sort);
  const totalTutor = userListFull.length;
  const totalPages = Math.ceil(totalTutor / pageSize);
  const pageNumber = parseInt(req.query.page) || 1;
  const skipAmount = (pageNumber - 1) * pageSize;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
  var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
  var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
  const userList = await User.find(filter).sort(sort).skip(skipAmount).limit(pageSize);
  console.log(userList);

  res.render('admin/viewListAccount', {
    userList: mutipleMongooseToObject(userList),
    amountTutor: userList.length,
    pages: pages,
    prevPage: prevPage,
    currentPage: currentPage,
    nextPage: nextPage,
    layout: 'admin',
  })
}
const getEditUserPage = async (req, res, next) => {
  const user = await User.findById(req.params.id).lean();
  res.render("admin/detailUser", {
    user: user,
    layout: "admin"
  })
}
const banUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    user.ban = true;
    await user.save();
    return res.status(200).json({ msg: 'Ban thành công!' });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
const unbanUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'Không tìm thấy thông tin' });
    }
    user.ban = false;
    await user.save();
    return res.status(200).json({ msg: 'Unban thành công!' });

  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
const putEditUserPage = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  User.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({ success: true, redirectUrl: '/admin', msg: "Chỉnh sửa khóa học thành công!" }))
    .catch(next);
}
const destroyUser = async (req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  User.deleteOne({ _id: id })
    .then(() => res.status(200).json({ success: true, redirectUrl: '/admin', msg: "Xóa user thành công!" }))
    .catch((error) => {
      console.error("Lỗi khi xóa bản ghi:", error);
      next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const getCoursePage = async (req, res, next) => {
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
    const role = "admin"
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    const currentPage = Math.max(1, Math.min(totalPages, pageNumber));
    var nextPage = currentPage + 1; if (nextPage > totalPages) nextPage = totalPages;
    var prevPage = currentPage - 1; if (prevPage < 1) prevPage = 1;
    console.log(courses.length);

    res.render('admin/category', {
      courses: courses,
      pages: pages,
      prevPage: prevPage,
      currentPage: currentPage,
      nextPage: nextPage,
      role: role,
      layout: 'admin',

    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    next(error);
  }
}
const getCreateCoursePage = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate('avatar').lean();
  res.render("admin/createCourse", {
    user: user,
    layout: 'admin',
  })
}
const postCreateCoursePage = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  const formData = req.body;
  formData.tutor = req.user._id;
  const course = new Course(formData);
  course.save()
    .then(() => res.status(200).json({ success: true, redirectUrl: '/admin', msg: "Tạo khóa học thành công!" }))
    .catch(next);
}
const getEditCoursePage = async (req, res, next) => {
  //Edit sản phẩm 
  Course.findById(req.params.id).populate('tutor')
    .then((course) =>
      res.render("admin/editCourse", {
        course: mongooseToObject(course),
        layout: 'admin',
      })
    )
    .catch(next);
}
const putEditCoursePage = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  Course.updateOne({ _id: req.params.id }, req.body)
    .then(() => res.status(200).json({ success: true, redirectUrl: '/admin', msg: "Chỉnh sửa môn học thành công!" }))
    .catch(next);
}
const destroyCourse = async (req, res, next) => {
  var id = new mongoose.Types.ObjectId(req.params.id);
  await Review.deleteMany({ courseId: id });
  await Order.deleteMany({ courseId: id });
  Course.deleteOne({ _id: id })
    .then(() => res.status(200).json({ success: true, redirectUrl: '/admin', msg: "Xóa môn học thành công!" }))
    .catch((error) => {
      console.error("Lỗi khi xóa bản ghi:", error);
      next(error); // Chuyển error cho middleware xử lý lỗi
    });
}

const profile = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Tìm user trong database dựa vào userId
    const user = await User.findById(userId).populate('avatar');

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    console.log(user)

    res.render('tutormode/editprofile', { user: mongooseToObject(user), layout: 'admin', });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
const editProfile = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(400).json({ errors: result.array() });
    return;
  }
  try {
    if (req.file) {
      await profileService.cropImage(req.file.filename);
      req.body.avatar = req.file.filename;
    }
    await User.updateOne({ _id: req.user._id }, req.body);
    res.status(200).json({ msg: 'Cập nhật thông tin thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
}
module.exports = {
  getHomePage,
  getWaitingListTutor,
  getDetailTutor,
  acceptTutor,
  denyTutor,
  getEditUserPage,
  putEditUserPage,
  destroyUser,
  getAccountPage,
  getEditCoursePage,
  putEditCoursePage,
  destroyCourse,
  getCoursePage,
  profile,
  editProfile,
  banUser,
  unbanUser,
  getCreateCoursePage,
  postCreateCoursePage
}