const mongodb = require('mongodb');
const { getDatabase } = require('../utils/database');

class Product {
  constructor(productTitle, productImg, productDesc, productPrice, id) {
    this.title = productTitle;
    this.imageUrl = productImg;
    this.description = productDesc;
    this.price = productPrice;
    this._id = new mongodb.ObjectId(id);
  }

  async save() {
    const db = getDatabase();

    if (this._id) {
      try {
        const products = await db.collection('products');
        /**
         * Using the `updateOne()` method to find the
         * document corresponding to `this._id` and
         * using the `$set` option to instruct mongodb
         * to update the document with the properties
         * of the `Product` object model
        */
        const result = await products.updateOne({ _id: this._id }, { $set: this });
  
        console.log('Updated product: ', result);
      } catch (error) {
        console.log(`Sorry, an error occurred while updating product: ${error}`);
      }
    } else {
      try {
        const products = await db.collection('products');
        const result = await products.insertOne(this);
  
        console.log('Saved product: ', result);
      } catch (error) {
        console.log(`Sorry, an error occurred while saving product: ${error}`);
      }
    }
  }

  static async fetchAll() {
    const db = getDatabase();
    
    try {
      const products = await db
        .collection('products')
        .find()
        .toArray();

      return products;
    } catch (error) {
      console.log(`Sorry, an error occurred while fetching products: ${error}`);
    }
  }

  static async findById(id) {
    // return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
    const db = getDatabase();

    try {
      const product = await db
        .collection('products')
        /**
         * We need to convert the `id` received as
         * request parameter into a mongodb ObjectId
         * before using it in the `find()` method
        */
        .find({ _id: new mongodb.ObjectId(id) })
        /**
         * The `next()` method returns the document
         * that satisfies the filter from the `find()`
         * method
        */
        .next();

      return product;
    } catch (error) {
      console.log(`Sorry, an error occurred while fetching product with id ${id}: ${error}`);
    }
  }

  // static deleteById(id) {

  // }
}

module.exports = Product;
