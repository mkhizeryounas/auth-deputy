var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const staticSettings = {
  etag: false
};

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public"), staticSettings));
app.use(
  "/bower_components",
  express.static(path.join(__dirname, "bower_components"), staticSettings)
);

app.use(require("./src/middlewares/response"));
app.use(require("cors")());

// MongoDB
require("./config/db");
require("./src/modules/default.seed")();

// Routes
const routes = require("./config/routes");
routes(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.reply({ statusCode: 404 });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // res.locals.error = req.app.get("env") === "development" ? err : {};
  console.log("ERROR:", err);
  if (err.isJoi || err.hasOwnProperty("errors") || err.name === "MongoError")
    err.status = 422;
  res.reply({ data: err.message, statusCode: err.status || 500 });
});

module.exports = app;
