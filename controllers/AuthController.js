const passport = require('../middlewares/passport');
const User = require('../models/User');
const ProductService = require("../services/Product.js")

  //[GET] /
const getHomePage = async (req, res, next) => {
  try {
    const productName = req.query.productName;
    const catalogId = req.query.catalogId;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const manufacturer = req.query.manufacturer;
    const sortByField = req.query.sortByField;
    const sortByOrder = req.query.sortByOrder;

    const productList = await ProductService.PrfilteredAndSortedProducts(productName, catalogId, manufacturer, minPrice, maxPrice, sortByField, sortByOrder);
        
    if (productList) {
      res.render("home/home", { productList: productList });
    }
    else {
      res.status(404).json({ message: "Not found" });
    }

  } catch (error) {
    next(error);
  }
};

 //[GET] /signin
const getSignIn = (req, res, next) => {
  var messages = req.flash('error');
  res.render('login/login', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};

//[POST] /signin
const postSignIn = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin',
    failureFlash: true,
  })(req, res, next); // Thêm dòng này để gọi hàm authenticate
};

//[GET] /signup
const getSignUp = (req, res, next) => {
  var messages = req.flash('error');
  res.render('login/login', {
    messages: messages,
    hasErrors: messages.length > 0,
  });
};

// [POST] /signup
const postSignUp = (req, res, next) => {
  if(req.body.password != req.body.re_password) {
    return res.status(201).json({ error: 'Re_Password is not match with Password!' }).redirect("/signup");
  }
  User.findOne({ 'username': req.body.username })
  .then( (user) => {
    if (user) {
      return res.status(201).json({ error: 'Username is already in use.' }).redirect("/signup");
    }
    else {
      var newUser = new User();
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = newUser.encryptPassword(req.body.password);
      newUser.save()
      .then(() => {
        res.status(201).redirect("/");
      })
      .catch((err) => {
        console.error(err);
        res.status(500).redirect("/signup");
      });
    }
    
  })
  .catch(next);
};

module.exports = {
  getHomePage,
  getSignIn,
  postSignIn,
  getSignUp,
  postSignUp,
};
