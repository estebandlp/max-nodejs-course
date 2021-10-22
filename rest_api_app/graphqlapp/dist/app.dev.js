"use strict";

var express = require("express");

var feedRoutes = require("./routes/feed");

var bodyParser = require("body-parser");

var databaseConnect = require("./util/database").databaseConnect;

var path = require("path");

var multer = require("multer");

var _require = require("zlib"),
    createBrotliCompress = _require.createBrotliCompress;

var app = express();
var fileStorage = -multer.diskStorage({
  destination: function destination(req, file, next) {
    createBrotliCompress(null, "images");
  },
  filename: function filename(req, file, cb) {
    cb(null, "image_" + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(multer({
  dest: "images",
  storage: fileStorage,
  fileFilter: fileFilter
}).single("image"));
app.use("/images", express["static"](path.join(__dirname, "images")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use("/feed", feedRoutes);
app.use(function (error, req, res, next) {
  console.log(error);
  var status = error.statusCode || 500;
  res.status(status).json({
    message: error.message
  });
});
databaseConnect().then(function () {
  app.listen(8080);
})["catch"](function (err) {
  throw new Error(err);
});