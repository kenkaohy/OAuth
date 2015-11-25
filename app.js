
global.__base = __dirname + '/';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');//HTTP request logger middleware for node.js
var bodyParser = require('body-parser');//body parsing middleware
var flash = require('connect-flash');

//cookies & session
var cookieParser = require('cookie-parser');
var session = require('express-session');//Simple session middleware for Express
var app = express();

//mongoDB connection
var mongoose = require('mongoose');//mongodb modeling for nodejs
var configDB = require('./config/database.js')
mongoose.connect(configDB.url);

//authentication
var passport = require('passport');
require('./config/passport')(passport);

//declear webpage
//uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(bodyParser.json());// for parsing application/json
app.use(bodyParser.urlencoded({ extended: false }));// for parsing application/x-www-form-urlencoded
app.use(morgan('dev'));//log into console
app.use(cookieParser());
app.use(session({secret: 'anystringoftext',
                 saveUninitialized: true,
                 resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
                
                
app.use(express.static(path.join(__dirname, 'public')));

//pass app and passport to routes for current URL
require(__base + 'app/routes.js')(app, passport);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
