const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://estebandlp:6DbMV0FNxfu2ZboI@cluster0.e8dgv.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!.'
}

exports.getDb = getDb; 
exports.mongoConnect = mongoConnect;
