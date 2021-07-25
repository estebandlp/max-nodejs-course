const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://<userName>:<password>@<clusterName>.e8dgv.mongodb.net/<databaseName>?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("Connected!");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!'
}

exports.getDb = getDb; 
exports.mongoConnect = mongoConnect;
