"use strict";
exports.__esModule = true;
exports.getDb = exports.connect = void 0;
var mod_ts_1 = require("https://deno.land/x/mongo@v0.8.0/mod.ts");
var db;
function connect() {
    var client = new mod_ts_1.MongoClient();
    client.connectWithUri("mongodb+srv://estebandlp:6DbMV0FNxfu2ZboI@cluster0.e8dgv.mongodb.net/shop?retryWrites=true&w=majority");
    db = client.database("todo-app");
}
exports.connect = connect;
function getDb() {
    return db;
}
exports.getDb = getDb;
