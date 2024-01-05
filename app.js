const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const flash = require('express-flash');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const MongoStore = require('connect-mongo');

const route = require('./routes/index');
const db = require('./config/dbMongo');
const passport = require('./middlewares/passport');
const exphbs = require('./util/helpers');
const app = express();

// Connect to DB
db.connect();

//Session for registry
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
    store: MongoStore.create({ mongoUrl: 'mongodb+srv://thduy161103:A6DWueoYXaz2NLtO@cluster0.7dzahsd.mongodb.net/TUS?retryWrites=true&w=majority' })
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.engine('hbs', exphbs.engine);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//dùng để chỉnh form từ post sang put
app.use(methodOverride('_method'));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(process.cwd(), 'public')));

route(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;