"use strict";

var http = require("http");

var server = http.createServer(function (req, res) {
  res.end("Hello world (from Node)!");
});
server.listen(3000);