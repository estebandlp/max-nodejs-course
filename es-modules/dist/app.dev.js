"use strict";

var _express = _interopRequireDefault(require("express"));

var _responseHandler = _interopRequireDefault(require("./response-handler.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.get("/", _responseHandler["default"]);
app.listen(3000);