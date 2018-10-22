var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var apiRouter = require('./routes/api')

var app = express();

// Connecting to the mongo DB
const DB_ADDRESS = "mongodb://admin:admin@pub-shard-00-00-yuru1.mongodb.net:27017,pub-shard-00-01-yuru1.mongodb.net:27017,pub-shard-00-02-yuru1.mongodb.net:27017/test?ssl=true&replicaSet=Pub-shard-0&authSource=admin&retryWrites=true";
const db = mongoose.connect(DB_ADDRESS);


// setting body parser middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// setting etag to false prevnting 304 responses
app.set('etag', false);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/api', apiRouter);


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

module.exports = app;
