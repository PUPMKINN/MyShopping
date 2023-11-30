const passport = require('passport');
const User = require('../models/User');

//[GET] /
const getHomePage = (req, res, next) => {
  res.render('home/home');
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
  User.findOne({ 'username': req.body.username })
  .then((user) => {
    if (!user) {
      res.redirect("login/login")
      res.status(400).json({ error: 'Not user found' });
    }
    else if (!user.validPassword(req.body.password)) {
      res.redirect("login/login")
      res.status(400).json({ error: 'Wrong password' });
    }
    else {
      res.redirect("/");
      //res.status(200).json({ message: 'Sign in successfully' });
    }
  })
  .catch(next);
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
  User.findOne({ 'username': req.body.username })
  .then( (user) => {
    if (user) {
      res.redirect("login/login");
      return res.json({ error: 'Username is already in use.' });
    }
    var newUser = new User();
    newUser.username = req.body.username;
    newUser.email = req.body.email;
    newUser.password = newUser.encryptPassword(req.body.password);
    newUser.save()
    .then(() => {
      res.redirect('login/login');
      res.json({ message: 'User registered successfully' });
    })
    .catch((err) => {
      console.error(err);
      res.redirect("login/login");
      res.json({ error: 'Internal Server Error' });
    });
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
