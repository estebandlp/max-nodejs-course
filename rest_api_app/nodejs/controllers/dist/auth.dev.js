"use strict";

var _require = require("express-validator/check"),
    validationResult = _require.validationResult;

var bcrypt = require("bcryptjs");

var jwt = require("jsonwebtoken");

var User = require("../models/user");

exports.signup = function _callee(req, res, next) {
  var errors, error, hashedPw, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          errors = validationResult(req);

          if (errors.isEmpty()) {
            _context.next = 7;
            break;
          }

          error = new Error("Validation failed.");
          error.statusCode = 422;
          error.data = errors.array();
          throw error;

        case 7:
          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(req.body.password, 12));

        case 9:
          hashedPw = _context.sent;
          user = new User({
            email: req.body.email,
            password: hashedPw,
            name: req.body.name
          });
          _context.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          res.status(201).json({
            message: "User created!",
            userId: user._id
          });
          _context.next = 21;
          break;

        case 16:
          _context.prev = 16;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

          if (!_context.t0.statusCode) {
            _context.t0.statusCode = 500;
          }

          next(_context.t0);

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

exports.login = function _callee2(req, res, next) {
  var loadedUser, error, isEqual, _error, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap(User.findOne({
            email: req.body.email
          }));

        case 3:
          loadedUser = _context2.sent;

          if (loadedUser) {
            _context2.next = 8;
            break;
          }

          error = new Error("A user with this email could not be found.");
          error.statusCode = 401;
          throw error;

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(bcrypt.compare(req.body.password, loadedUser.password));

        case 10:
          isEqual = _context2.sent;

          if (isEqual) {
            _context2.next = 15;
            break;
          }

          _error = new Error("Wrong password!");
          _error.statusCode = 401;
          throw _error;

        case 15:
          token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
          }, "somesupersecretsecret", {
            expiresIn: "1h"
          });
          res.status(200).json({
            token: token,
            userId: loadedUser._id.toString()
          });
          return _context2.abrupt("return");

        case 20:
          _context2.prev = 20;
          _context2.t0 = _context2["catch"](0);

          if (!_context2.t0.statusCode) {
            _context2.t0.statusCode = 500;
          }

          next(_context2.t0);
          return _context2.abrupt("return", _context2.t0);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

exports.getUserStatus = function _callee3(req, res, next) {
  var user, error;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.userId));

        case 3:
          user = _context3.sent;

          if (user) {
            _context3.next = 8;
            break;
          }

          error = new Error("User not found.");
          error.statusCode = 404;
          throw error;

        case 8:
          res.status(200).json({
            status: user.status
          });
          _context3.next = 15;
          break;

        case 11:
          _context3.prev = 11;
          _context3.t0 = _context3["catch"](0);

          if (!_context3.t0.statusCode) {
            _context3.t0.statusCode = 500;
          }

          next(_context3.t0);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

exports.updateUserStatus = function _callee4(req, res, next) {
  var user, error;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(User.findById(req.userId));

        case 3:
          user = _context4.sent;

          if (user) {
            _context4.next = 8;
            break;
          }

          error = new Error("User not found.");
          error.statusCode = 404;
          throw error;

        case 8:
          user.status = req.body.status;
          _context4.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.status(200).json({
            message: "User updated"
          });
          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);

          if (!_context4.t0.statusCode) {
            _context4.t0.statusCode = 500;
          }

          next(_context4.t0);

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};