const mongoose = require("mongoose");

const databaseConnect = () => {
  return mongoose.connect(
    "mongodb+srv://estebandlp:6DbMV0FNxfu2ZboI@cluster0.e8dgv.mongodb.net/shop?retryWrites=true&w=majority"
  );
};

module.exports = databaseConnect; 
