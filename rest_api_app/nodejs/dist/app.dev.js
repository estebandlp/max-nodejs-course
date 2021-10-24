"use strict";

var express = require("express");

var feedRoutes = require("./routes/feed");

var authRoutes = require("./routes/auth");

var bodyParser = require("body-parser");

var databaseConnect = require("./util/database").databaseConnect;

var path = require("path");

var multer = require("multer");

var _require = require("uuid"),
    uuidv4 = _require.v4;

var _require2 = require("express-graphql"),
    graphqlHTTP = _require2.graphqlHTTP;

var auth = require("./middleware/is-auth");

var fs = require("fs");

var graphqlSchema = require("./graphql/schema");

var graphqlResolver = require("./graphql/resolvers");

var app = express();
var fileStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "images");
  },
  filename: function filename(req, file, cb) {
    cb(null, uuidv4() + "-" + file.originalname);
  }
});

var fileFilter = function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json());
app.use(multer({
  storage: fileStorage,
  fileFilter: fileFilter
}).single("image"));
app.use("/images", express["static"](path.join(__dirname, "images")));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});
app.use("/feed", feedRoutes);
app.use("/auth", authRoutes);
app.use(auth);
app.put("/post-image", function (req, res, next) {
  if (!req.isAuth) {
    throw new Error("Not authenticated!");
  }

  if (!req.file) {
    return res.status(200).json({
      message: "No file provided!"
    });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  return res.status(201).json({
    message: "File stored.",
    filePath: req.file.path
  });
});
app.use("/graphql", graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolver,
  graphiql: true,
  customFormatErrorFn: function customFormatErrorFn(err) {
    if (!err.originalError) {
      return err;
    }

    var data = err.originalError.data;
    var message = err.message || "An error occurred.";
    var code = err.originalError.code || 500;
    return {
      message: message,
      status: code,
      data: data
    };
  }
}));
app.use(function (error, req, res, next) {
  var status = error.statusCode || 500;
  var message = error.message;
  var data = error.data;
  res.status(status).json({
    message: message,
    data: data
  });
});
databaseConnect().then(function () {
  app.listen(8080);
})["catch"](function (err) {
  throw new Error(err);
});

var clearImage = function clearImage(filePath) {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, function (err) {
    return console.log(err);
  });
};