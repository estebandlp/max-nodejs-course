"use strict";

var path = require('path');

var fs = require('fs');

var clearImage = function clearImage(filePath) {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, function (err) {
    return console.log(err);
  });
};

exports.clearImage = clearImage;