const db = require('../utils/database');

const Cart = require('./cart');

class Product {
  constructor(productId, productTitle, productImg, productDesc, productPrice) {
    this.id = productId;
    this.title = productTitle;
    this.imgUrl = productImg;
    this.description = productDesc;
    this.price = productPrice;
  }

  save() {
    return db.execute('INSERT INTO products (title, price, description, imageUrl) VALUES (?, ?, ?, ?)', [
      this.title,
      this.price,
      this.description,
      this.imgUrl
    ]);
  }

  static fetchAll() {
    return db.execute('SELECT * FROM products');
  }

  static findById(id) {
    return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  }

  static deleteById(id) {

  }
}

module.exports = Product;
