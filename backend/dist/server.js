// Configuration and Logging handlers
var dotenv = require('dotenv').config();

var morgan = require('morgan');

var debug = require('debug')('server'); // HTTP handlers


var createError = require('http-errors');

var http = require('http');

var path = require('path');

var favicon = require('serve-favicon'); // Express framework and additional middleware


var express = require('express');

var expressHandlebars = require('express-handlebars');

var bodyParser = require('body-parser');

var session = require('express-session');

var cookieParser = require('cookie-parser');

isDevelopment = process.env.MODE === "Development"; // Create and configure the express app

var app = express(); // Express view/template engine setup

debug('Setting up view engine and handlebars templates');
app.set('views', path.join(__dirname + "/../", 'views'));
app.engine('handlebars', expressHandlebars({
  defaultLayout: 'default',
  partialsDir: path.join(app.get('views'), 'partials'),
  layoutDir: path.join(app.get('views'), 'layouts')
}));
app.set('view engine', 'handlebars');
app.set('view cache', !isDevelopment); // view caching in production
// Express middlewares

debug('installing middlewares');
debug('static for public and distributed files');
app.use("/", express.static("public")); // root directory of static content

app.use('/dist', express.static("dist")); // root directory of distributed CSS, JS libraries

debug('cookie parsing');
app.use(cookieParser()); // add cookie support

debug('JSON and POST form encoding');
app.use(bodyParser.json()); // add POST JSON support

app.use(bodyParser.urlencoded({
  extended: true
})); // and POST URL Encoded form support

debug('Adding session support');
app.use(session({
  secret: 'frankie',
  resave: true,
  saveUninitialized: true
})); // Add session support

/* Are we in Development or in Production? */

if (isDevelopment) {
  app.use(morgan("dev"));
  /* log server calls with performance timing with development details */

  /* log call requests with body */

  app.use(function (request, response, next) {
    console.log("Received request for " + request.url + " with/without body");
    if (request.body) console.log(request.body);
    next();
  });
} else {
  app.use(morgan("combined"));
  /* log server calls per standard combined Apache combined format */
}

var routes = require('./routes'); // add the middleware path routing


app.use("/", routes); // add the routes to the express middleware
// catch 404 and forward to error handler

app.use(function (req, res, next) {
  debug('Handling 404 Not Found');
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // error handler

if (isDevelopment) {
  app.use(function (err, req, res, next) {
    debug('Handling 500');
    debug(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
} else {
  app.use(function (err, req, res, next) {
    debug('Handling 500 in production - only message sent to caller');
    debug(err);
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
}

var httpServer = http.Server(app);
var port = process.env.PORT || 3000;
httpServer.listen(port, function () {
  debug("Server started on port " + port);
});