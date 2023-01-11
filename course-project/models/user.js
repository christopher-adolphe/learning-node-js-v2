const mongodb = require('mongodb');
const { getDatabase } = require('../utils/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  async save() {
    const db = getDatabase();

    try {
      const users = await db.collection('users');
      const result = await users.insertOne(this);

      return result;
    } catch (error) {
      console.log(`Sorry, an error occurred while saving user: ${error}`);
    }
  }

  async addToCart(product) {
    const cartItemIndex = this.cart.items.findIndex(item => item.productId.toString() === product._id.toString());
    const updatedCartItems = [ ...this.cart.items ];
    let newQuantity = 1;

    if (cartItemIndex !== -1) {
      newQuantity = this.cart.items[cartItemIndex].quantity + 1;
      updatedCartItems[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    const db = getDatabase();

    try {
      const users = await db.collection('users');
      const result = await users.updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );

      return result;
    } catch (error) {
      console.log(`Sorry, an error occurred while adding product to cart with id ${product._id}: ${error}`);
    }
  }

  static async findById(userId) {
    const db = getDatabase();

    try {
      const user = await db
        .collection('users')
        .find({ _id: new mongodb.ObjectId(userId) })
        .next();

      return user;
    } catch (error) {
      console.log(`Sorry, an error occurred while fetching user with id ${userId}: ${error}`);
    }
  }
}

module.exports = User;
