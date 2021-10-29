"use strict";

var expect = require('chai').expect;

var databaseConnect = require("../util/database").databaseConnect;

var databaseDisconnect = require("../util/database").databaseDisconnect;

var User = require('../models/user');

var FeedController = require('../controllers/feed');

describe('Feed Controller', function () {
  before(function (done) {
    databaseConnect().then(function (result) {
      var user = new User({
        email: 'test@test.com',
        password: 'tester',
        name: 'Test',
        posts: [],
        _id: '5c0f66b979af55031b34728a'
      });
      return user.save();
    }).then(function () {
      done();
    });
  });
  beforeEach(function () {});
  afterEach(function () {});
  it('should add a created post to the posts of the creator', function (done) {
    var req = {
      body: {
        title: 'Test Post',
        content: 'A Test Post'
      },
      file: {
        path: 'abc'
      },
      userId: '5c0f66b979af55031b34728a'
    };
    var res = {
      status: function status() {
        return this;
      },
      json: function json() {}
    };
    FeedController.createPost(req, res, function () {}).then(function (savedUser) {
      expect(savedUser).to.have.property('posts');
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });
  after(function (done) {
    User.deleteMany({}).then(function () {
      return databaseDisconnect();
    }).then(function () {
      done();
    });
  });
});