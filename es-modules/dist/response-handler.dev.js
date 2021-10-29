"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _url = require("url");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var resHandler = function resHandler(req, res, next) {
  //   fs.readFile("my-page.html", "utf8", (err, data) => {
  //     res.send(data);
  //   });
  res.sendFile(_path.path.join(__dirname, "my-page.html"));
};

var _default = resHandler;
exports["default"] = _default;