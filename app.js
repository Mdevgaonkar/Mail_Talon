var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

require('dotenv').config();

var index = require('./routes/index');
var authorize = require('./routes/authorize');
//for urls like http://localhost:3000/authorize?code=M179b25f8-2481-1aa5-7b73-8263eaebfd61
// var mail = require('./routes/mail');
var run_comp = require('./routes/run_comparator');
var getUnreadMails = require('./routes/getUnreadMails');


var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/authorize', authorize);
// app.use('/mail', mail);
app.use('/refresh', run_comp);
app.use('/getUnreadMails', getUnreadMails);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // send the error response
  res.status(err.status || 500);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(res.locals));
});

module.exports = app;