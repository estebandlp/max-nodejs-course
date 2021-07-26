const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    if (id) this._id = new mongoDb.ObjectId(id);
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOperation;

    if (this._id) {
      dbOperation = db
        .collection("products")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOperation = db.collection("products").insertOne(this);
    }

    return dbOperation
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(id) })
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection("products")
      .find({ _id: new mongoDb.ObjectId(productId) })
      .next()
      .then((product) => {
        return product;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
