const mongodb = require('mongodb');
const { getDatabase } = require('../utils/database');

class User {
  constructor(username, email, cart, id) {
    this.name = username;
    this.email = email;
    this.cart = cart ? cart : [];
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

  async addToCart(productId) {
    const cartItemIndex = this.cart.findIndex(item => item.productId.toString() === productId.toString());
    const updatedCartItems = [ ...this.cart ];
    let newQuantity = 1;

    if (cartItemIndex !== -1) {
      newQuantity = this.cart[cartItemIndex].quantity + 1;
      updatedCartItems[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new mongodb.ObjectId(productId),
        quantity: newQuantity,
      });
    }

    const updatedCart = updatedCartItems;

    const db = getDatabase();

    try {
      const users = await db.collection('users');
      const result = await users.updateOne(
        { _id: this._id },
        { $set: { cart: updatedCart } }
      );

      return result;
    } catch (error) {
      console.log(`Sorry, an error occurred while adding product to cart with id ${productId}: ${error}`);
    }
  }

  async removeFromCart(productId) {
    const db = getDatabase();
    this.cart = this.cart.filter(item => item.productId.toString() !== productId.toString());

    try {
      const users = await db.collection('users');
      
      await users.updateOne(
        { _id: this._id },
        { $set: { cart: this.cart } }
      )
    } catch (error) {
      console.log(`Sorry, an error occurred while removing product to cart with id ${productId}: ${error}`);
    }
  }

  async getCart() {
    const db = getDatabase();

    try {
      const productIds = this.cart.map(cartItem => cartItem.productId);
      const products = await db
        .collection('products')
        .find({ _id: { $in: productIds }})
        .toArray();

      return products.map(product => {
        const quantity = this.cart.find(cartItem => cartItem.productId.toString() === product._id.toString()).quantity;
        
        return {
          ...product,
          quantity,
        }
      });
    } catch (error) {
      console.log(`Sorry, an error occurred while retrieving products from cart: ${error}`);
    }
  }

  async createOrder() {
    const db = getDatabase();

    try {
      const cartProducts = await this.getCart();
      const order = {
        userId: this._id,
        items: cartProducts,
      };
      
      await db
        .collection('orders')
        .insertOne(order);

      this.cart = [];

      await db
        .collection('users')
        .updateOne(
          { _id: this._id },
          { $set: { cart: this.cart }}
        );
    } catch (error) {
      console.log(`Sorry, an error occurred while creating order: ${error}`);
    }
  }

  async getOrders() {
    const db = getDatabase();

    try {
      const orders = await db
        .collection('orders')
        .find({ userId: this._id })
        .toArray();

      return orders;
    } catch (error) {
      console.log(`Sorry, an error occurred while retrieving products from cart: ${error}`);
    }
  }
}

module.exports = User;
