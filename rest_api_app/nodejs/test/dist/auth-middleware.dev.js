"use strict";

var expect = require('chai').expect;

var jwt = require('jsonwebtoken');

var sinon = require('sinon');

var authMiddleware = require('../middleware/is-auth-to-test');

describe('Auth middleware', function () {
  it('should throw an error if no authorization header is present', function () {
    var req = {
      get: function get() {
        return null;
      }
    };
    expect(authMiddleware.bind(this, req, {}, function () {})).to["throw"]('Not authenticated.');
  });
  it('should throw an error if the authorization header is only one string', function () {
    var req = {
      get: function get() {
        return 'xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, function () {})).to["throw"]();
  });
  it('should yield a userId after decoding the token', function () {
    var req = {
      get: function get() {
        return 'Bearer asdf';
      }
    };
    sinon.stub(jwt, 'verify');
    jwt.verify.returns({
      userId: 'abc'
    });
    authMiddleware(req, {}, function () {});
    expect(req).to.have.property('userId');
    expect(req).to.have.property('userId', 'abc');
    expect(jwt.verify.called).to.be["true"];
    jwt.verify.restore();
  });
  it('should throw an error if the token cannot be verified', function () {
    var req = {
      get: function get() {
        return 'Bearer xyz';
      }
    };
    expect(authMiddleware.bind(this, req, {}, function () {})).to["throw"]();
  });
});