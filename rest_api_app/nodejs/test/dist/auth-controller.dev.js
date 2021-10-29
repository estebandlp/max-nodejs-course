"use strict";

var expect = require("chai").expect;

var sinon = require("sinon");

var databaseConnect = require("../util/database").databaseConnect;

var databaseDisconnect = require("../util/database").databaseDisconnect;

var User = require("../models/user");

var AuthController = require("../controllers/auth");

describe("Auth Controller", function () {
  before(function (done) {
    databaseConnect().then(function (result) {
      var user = new User({
        email: "test@test.com",
        password: "tester",
        name: "Test",
        posts: [],
        _id: "5c0f66b979af55031b34728a"
      });
      return user.save();
    }).then(function () {
      done();
    });
  });
  beforeEach(function () {});
  afterEach(function () {});
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne["throws"]();
    var req = {
      body: {
        email: "test@test.com",
        password: "tester"
      }
    };
    AuthController.login(req, {}, function () {}).then(function (result) {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });
    User.findOne.restore();
  });
  it("should send a response with a valid user status for an existing user", function (done) {
    var req = {
      userId: "5c0f66b979af55031b34728a"
    };
    var res = {
      statusCode: 500,
      userStatus: null,
      status: function status(code) {
        this.statusCode = code;
        return this;
      },
      json: function json(data) {
        this.userStatus = data.status;
      }
    };
    AuthController.getUserStatus(req, res, function () {}).then(function () {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
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