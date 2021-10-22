const mongoose = require("mongoose");

const MONGODB_URI =
  "mongodb+srv://estebandlp:6DbMV0FNxfu2ZboI@cluster0.e8dgv.mongodb.net/shop?retryWrites=true&w=majority";

const databaseConnect = () => {
  return mongoose.connect(MONGODB_URI);
};

exports.databaseConnect = databaseConnect;
exports.MONGODB_URI = MONGODB_URI;
