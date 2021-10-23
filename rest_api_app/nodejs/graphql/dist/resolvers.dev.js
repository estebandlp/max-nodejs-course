"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var bcrypt = require('bcryptjs');

var validator = require('validator');

var jwt = require('jsonwebtoken');

var User = require('../models/user');

var Post = require('../models/post');

var _require = require('../util/file'),
    clearImage = _require.clearImage;

module.exports = {
  createUser: function createUser(_ref, req) {
    var userInput, errors, error, existingUser, _error, hashedPw, user, createdUser;

    return regeneratorRuntime.async(function createUser$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            userInput = _ref.userInput;
            //   const email = args.userInput.email;
            errors = [];

            if (!validator.isEmail(userInput.email)) {
              errors.push({
                message: 'E-Mail is invalid.'
              });
            }

            if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, {
              min: 5
            })) {
              errors.push({
                message: 'Password too short!'
              });
            }

            if (!(errors.length > 0)) {
              _context.next = 9;
              break;
            }

            error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(User.findOne({
              email: userInput.email
            }));

          case 11:
            existingUser = _context.sent;

            if (!existingUser) {
              _context.next = 15;
              break;
            }

            _error = new Error('User exists already!');
            throw _error;

          case 15:
            _context.next = 17;
            return regeneratorRuntime.awrap(bcrypt.hash(userInput.password, 12));

          case 17:
            hashedPw = _context.sent;
            user = new User({
              email: userInput.email,
              name: userInput.name,
              password: hashedPw
            });
            _context.next = 21;
            return regeneratorRuntime.awrap(user.save());

          case 21:
            createdUser = _context.sent;
            return _context.abrupt("return", _objectSpread({}, createdUser._doc, {
              _id: createdUser._id.toString()
            }));

          case 23:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  login: function login(_ref2) {
    var email, password, user, error, isEqual, _error2, token;

    return regeneratorRuntime.async(function login$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            email = _ref2.email, password = _ref2.password;
            _context2.next = 3;
            return regeneratorRuntime.awrap(User.findOne({
              email: email
            }));

          case 3:
            user = _context2.sent;

            if (user) {
              _context2.next = 8;
              break;
            }

            error = new Error('User not found.');
            error.code = 401;
            throw error;

          case 8:
            _context2.next = 10;
            return regeneratorRuntime.awrap(bcrypt.compare(password, user.password));

          case 10:
            isEqual = _context2.sent;

            if (isEqual) {
              _context2.next = 15;
              break;
            }

            _error2 = new Error('Password is incorrect.');
            _error2.code = 401;
            throw _error2;

          case 15:
            token = jwt.sign({
              userId: user._id.toString(),
              email: user.email
            }, 'somesupersecretsecret', {
              expiresIn: '1h'
            });
            return _context2.abrupt("return", {
              token: token,
              userId: user._id.toString()
            });

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  createPost: function createPost(_ref3, req) {
    var postInput, error, errors, _error3, user, _error4, post, createdPost;

    return regeneratorRuntime.async(function createPost$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            postInput = _ref3.postInput;

            if (req.isAuth) {
              _context3.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            errors = [];

            if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {
              min: 5
            })) {
              errors.push({
                message: 'Title is invalid.'
              });
            }

            if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, {
              min: 5
            })) {
              errors.push({
                message: 'Content is invalid.'
              });
            }

            if (!(errors.length > 0)) {
              _context3.next = 13;
              break;
            }

            _error3 = new Error('Invalid input.');
            _error3.data = errors;
            _error3.code = 422;
            throw _error3;

          case 13:
            _context3.next = 15;
            return regeneratorRuntime.awrap(User.findById(req.userId));

          case 15:
            user = _context3.sent;

            if (user) {
              _context3.next = 20;
              break;
            }

            _error4 = new Error('Invalid user.');
            _error4.code = 401;
            throw _error4;

          case 20:
            post = new Post({
              title: postInput.title,
              content: postInput.content,
              imageUrl: postInput.imageUrl,
              creator: user
            });
            _context3.next = 23;
            return regeneratorRuntime.awrap(post.save());

          case 23:
            createdPost = _context3.sent;
            user.posts.push(createdPost);
            _context3.next = 27;
            return regeneratorRuntime.awrap(user.save());

          case 27:
            return _context3.abrupt("return", _objectSpread({}, createdPost._doc, {
              _id: createdPost._id.toString(),
              createdAt: createdPost.createdAt.toISOString(),
              updatedAt: createdPost.updatedAt.toISOString()
            }));

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  posts: function posts(_ref4, req) {
    var page, error, perPage, totalPosts, posts;
    return regeneratorRuntime.async(function posts$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            page = _ref4.page;

            if (req.isAuth) {
              _context4.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            if (!page) {
              page = 1;
            }

            perPage = 2;
            _context4.next = 9;
            return regeneratorRuntime.awrap(Post.find().countDocuments());

          case 9:
            totalPosts = _context4.sent;
            _context4.next = 12;
            return regeneratorRuntime.awrap(Post.find().sort({
              createdAt: -1
            }).skip((page - 1) * perPage).limit(perPage).populate('creator'));

          case 12:
            posts = _context4.sent;
            return _context4.abrupt("return", {
              posts: posts.map(function (p) {
                return _objectSpread({}, p._doc, {
                  _id: p._id.toString(),
                  createdAt: p.createdAt.toISOString(),
                  updatedAt: p.updatedAt.toISOString()
                });
              }),
              totalPosts: totalPosts
            });

          case 14:
          case "end":
            return _context4.stop();
        }
      }
    });
  },
  post: function post(_ref5, req) {
    var id, error, post, _error5;

    return regeneratorRuntime.async(function post$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            id = _ref5.id;

            if (req.isAuth) {
              _context5.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            _context5.next = 7;
            return regeneratorRuntime.awrap(Post.findById(id).populate('creator'));

          case 7:
            post = _context5.sent;

            if (post) {
              _context5.next = 12;
              break;
            }

            _error5 = new Error('No post found!');
            _error5.code = 404;
            throw _error5;

          case 12:
            return _context5.abrupt("return", _objectSpread({}, post._doc, {
              _id: post._id.toString(),
              createdAt: post.createdAt.toISOString(),
              updatedAt: post.updatedAt.toISOString()
            }));

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    });
  },
  updatePost: function updatePost(_ref6, req) {
    var id, postInput, error, post, _error6, _error7, errors, _error8, updatedPost;

    return regeneratorRuntime.async(function updatePost$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            id = _ref6.id, postInput = _ref6.postInput;

            if (req.isAuth) {
              _context6.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            _context6.next = 7;
            return regeneratorRuntime.awrap(Post.findById(id).populate('creator'));

          case 7:
            post = _context6.sent;

            if (post) {
              _context6.next = 12;
              break;
            }

            _error6 = new Error('No post found!');
            _error6.code = 404;
            throw _error6;

          case 12:
            if (!(post.creator._id.toString() !== req.userId.toString())) {
              _context6.next = 16;
              break;
            }

            _error7 = new Error('Not authorized!');
            _error7.code = 403;
            throw _error7;

          case 16:
            errors = [];

            if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, {
              min: 5
            })) {
              errors.push({
                message: 'Title is invalid.'
              });
            }

            if (validator.isEmpty(postInput.content) || !validator.isLength(postInput.content, {
              min: 5
            })) {
              errors.push({
                message: 'Content is invalid.'
              });
            }

            if (!(errors.length > 0)) {
              _context6.next = 24;
              break;
            }

            _error8 = new Error('Invalid input.');
            _error8.data = errors;
            _error8.code = 422;
            throw _error8;

          case 24:
            post.title = postInput.title;
            post.content = postInput.content;

            if (postInput.imageUrl !== 'undefined') {
              post.imageUrl = postInput.imageUrl;
            }

            _context6.next = 29;
            return regeneratorRuntime.awrap(post.save());

          case 29:
            updatedPost = _context6.sent;
            return _context6.abrupt("return", _objectSpread({}, updatedPost._doc, {
              _id: updatedPost._id.toString(),
              createdAt: updatedPost.createdAt.toISOString(),
              updatedAt: updatedPost.updatedAt.toISOString()
            }));

          case 31:
          case "end":
            return _context6.stop();
        }
      }
    });
  },
  deletePost: function deletePost(_ref7, req) {
    var id, error, post, _error9, _error10, user;

    return regeneratorRuntime.async(function deletePost$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            id = _ref7.id;

            if (req.isAuth) {
              _context7.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            _context7.next = 7;
            return regeneratorRuntime.awrap(Post.findById(id));

          case 7:
            post = _context7.sent;

            if (post) {
              _context7.next = 12;
              break;
            }

            _error9 = new Error('No post found!');
            _error9.code = 404;
            throw _error9;

          case 12:
            if (!(post.creator.toString() !== req.userId.toString())) {
              _context7.next = 16;
              break;
            }

            _error10 = new Error('Not authorized!');
            _error10.code = 403;
            throw _error10;

          case 16:
            clearImage(post.imageUrl);
            _context7.next = 19;
            return regeneratorRuntime.awrap(Post.findByIdAndRemove(id));

          case 19:
            _context7.next = 21;
            return regeneratorRuntime.awrap(User.findById(req.userId));

          case 21:
            user = _context7.sent;
            user.posts.pull(id);
            _context7.next = 25;
            return regeneratorRuntime.awrap(user.save());

          case 25:
            return _context7.abrupt("return", true);

          case 26:
          case "end":
            return _context7.stop();
        }
      }
    });
  },
  user: function user(args, req) {
    var error, user, _error11;

    return regeneratorRuntime.async(function user$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (req.isAuth) {
              _context8.next = 4;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 4:
            _context8.next = 6;
            return regeneratorRuntime.awrap(User.findById(req.userId));

          case 6:
            user = _context8.sent;

            if (user) {
              _context8.next = 11;
              break;
            }

            _error11 = new Error('No user found!');
            _error11.code = 404;
            throw _error11;

          case 11:
            return _context8.abrupt("return", _objectSpread({}, user._doc, {
              _id: user._id.toString()
            }));

          case 12:
          case "end":
            return _context8.stop();
        }
      }
    });
  },
  updateStatus: function updateStatus(_ref8, req) {
    var status, error, user, _error12;

    return regeneratorRuntime.async(function updateStatus$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            status = _ref8.status;

            if (req.isAuth) {
              _context9.next = 5;
              break;
            }

            error = new Error('Not authenticated!');
            error.code = 401;
            throw error;

          case 5:
            _context9.next = 7;
            return regeneratorRuntime.awrap(User.findById(req.userId));

          case 7:
            user = _context9.sent;

            if (user) {
              _context9.next = 12;
              break;
            }

            _error12 = new Error('No user found!');
            _error12.code = 404;
            throw _error12;

          case 12:
            user.status = status;
            _context9.next = 15;
            return regeneratorRuntime.awrap(user.save());

          case 15:
            return _context9.abrupt("return", _objectSpread({}, user._doc, {
              _id: user._id.toString()
            }));

          case 16:
          case "end":
            return _context9.stop();
        }
      }
    });
  }
};