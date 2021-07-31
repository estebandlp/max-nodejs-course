const Product = require("../models/product");
const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;
class User {
  constructor(username, email, cart, id) {
    this._id = id;
    this.name = username;
    this.email = email;
    this.cart = cart ? cart : { items: [] };
  }

  save() {
    const db = getDb();
    return db
      .collection("users")
      .insertOne(this)
      .catch((err) => {
        console.log(err);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.equals(product._id);
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongoDb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return getDb()
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  deleteItemFromCart(prodId) {
    const updatedCart = this.cart.items.filter((item) => {
      return !item.productId.equals(prodId);
    });

    return getDb()
      .collection("users")
      .updateOne(
        { _id: new mongoDb.ObjectId(this._id) },
        { $set: { cart: { items: updatedCart } } }
      );
  }

  getCart() {
    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });

    return Product.findByIdIn(productIds).then((products) => {
      let productIndex = 0;
      return products.map((product) => {
        productIndex = this.cart.items.findIndex((item) =>
          item.productId.equals(product._id)
        );

        return {
          ...product,
          quantity: this.cart.items[productIndex].quantity,
        };
      });
    });
  }

  addOrder() {
    const db = getDb();

    return this.getCart()
      .then((products) => {
        const order = {
          items: products,
          user: {
            _id: new mongoDb.ObjectId(this._id),
            name: this.name,
          },
        };

        return db.collection("orders").insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };

        return db
          .collection("users")
          .updateOne(
            { _id: new mongoDb.ObjectId(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();

    return db
      .collection("orders")
      .find({ "user._id": this._id })
      .toArray()
      .then((orders) => {
        return orders;
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection("users")
      .find({ _id: new mongoDb.ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }
}

module.exports = User;
