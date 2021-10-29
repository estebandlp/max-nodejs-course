"use strict";

var mongoose = require("mongoose");

var MONGODB_URI = "mongodb+srv://estebandlp:6DbMV0FNxfu2ZboI@cluster0.e8dgv.mongodb.net/shop?retryWrites=true&w=majority";

var databaseConnect = function databaseConnect() {
  return mongoose.connect(MONGODB_URI);
};

var databaseDisconnect = function databaseDisconnect() {
  return mongoose.databaseDisconnect();
};

exports.databaseConnect = databaseConnect;
exports.databaseDisconnect = databaseDisconnect;
exports.MONGODB_URI = MONGODB_URI;