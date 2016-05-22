// =====================================================================
// set up ==============================================================
// =====================================================================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/main');
var app = express();

// ======================================================================
// view engine setup ====================================================
// ======================================================================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ======================================================================
// connect to database ==================================================
// ======================================================================
mongoose.connect(config.database);

require('./models/Souls');
require('./models/Users');

require('./config/passport');

var routes = require('./routes/index');
var users = require('./routes/users');

// ======================================================================
// uncomment after placing your favicon in /public ======================
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// ======================================================================
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ======================================================================
// Include public directory =============================================
// ======================================================================
app.use(express.static(path.join(__dirname, 'public')));

// ======================================================================
// include templates directory ==========================================
// ======================================================================
app.use(express.static(path.join(__dirname, 'views')));

// ======================================================================
// include bower directory ==============================================
// ======================================================================
app.use(express.static(path.join(__dirname, './bower_components')));

app.use(passport.initialize());

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
