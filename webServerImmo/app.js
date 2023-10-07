var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var keys=require('./config/keys')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var cookiesession = require('express-session')
var authRoutes= require('./routes/auth-routes');
var cookiesession=require('express-session');
var passportSetup=require("./config/passeport-setup");
var passport = require('passport')

var app = express();  






//encrypt our cookie
app.use(cookiesession({
    maxAge: 24*60*60*1000,
    secret: [keys.session.cookieKey]
}));

//intialize passport
app.use(passport.initialize());
app.use(passport.session());


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRoutes);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const mongoose = require('mongoose')


mongoose.connect('mongodb://localhost:27017/').then(() => {
    console.log('Database connected')
}).catch((e) => {
    console.log(e.message)
})

module.exports = app;
