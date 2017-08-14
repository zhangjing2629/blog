var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var session = require('express-session');
var routes = require('./routes/index');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var flash = require('connect-flash');
var crypto = require('crypto');
var app = express();





app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(methodOverride());
app.use(cookieParser());
app.use(session({
    secret: settings.cookieSecret,
    saveUninitialized: true,
    resave: false,
    store: new MongoStore({
        url: 'mongodb://127.0.0.1/blog'
    })
}));
app.use(express.static(__dirname + '/public'));
app.use(flash());

app.use(function(req,res,next){
  res.locals.user=req.session.user;
  var err = req.flash('error');
  var success = req.flash('success');
  res.locals.error = err.length ? err : null;
  res.locals.success = success.length ? success : null;
  next();
});


routes(app); //路由

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    return res.status(err.status || 500);
    res.render('error');
});
module.exports = app;