"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  status: {
    type: String,
    "default": "I am new!"
  },
  posts: [{
    type: Schema.Types.ObjectId,
    ref: "Post"
  }]
});
module.exports = mongoose.model("User", userSchema);