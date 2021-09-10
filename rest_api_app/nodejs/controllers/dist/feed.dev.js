"use strict";

var _require = require("express-validator/check"),
    validationResult = _require.validationResult;

var Post = require("../models/post");

exports.getPosts = function (req, res, next) {
  Post.find().then(function (posts) {
    res.status(200).json({
      message: "Post fetched!",
      posts: posts
    });
  })["catch"](function (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  });
};

exports.createPost = function (req, res, next) {
  var errors = validationResult(req);

  if (!errors.isEmpty()) {
    var error = new Error("Validation failed.");
    error.statusCode = 422;
    throw error;
  }

  if (!req.file) {
    var _error = new Error("No image provided.");

    _error.statusCode = 422;
    throw _error;
  }

  var title = req.body.title;
  var content = req.body.content;
  var imageUrl = req.file.path;
  var post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: {
      name: "Tebuso"
    }
  });
  post.save().then(function (post) {
    res.status(201).json({
      message: "Post created!",
      post: post
    });
  })["catch"](function (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  });
};

exports.getPost = function (req, res, next) {
  var postId = req.params.postId;
  Post.findById(postId).then(function (post) {
    if (!post) {
      var error = new Error("Post not found.");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      message: "Post fetched!",
      post: post
    });
  })["catch"](function (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }

    next(err);
  });
};