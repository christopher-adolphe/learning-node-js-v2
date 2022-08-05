const { getDatabase } = require('../utils/database');

class Product {
  constructor(productId, productTitle, productImg, productDesc, productPrice) {
    this.id = productId;
    this.title = productTitle;
    this.imageUrl = productImg;
    this.description = productDesc;
    this.price = productPrice;
  }

  async save() {
    const db = getDatabase();

    try {
      const products = await db.collection('products');
      const result = await products.insertOne(this);

      console.log('Saved product: ', result);
    } catch (error) {
      console.log(`Sorry, an error occurred while saving product: ${error}`);
    }
  }

  // static fetchAll() {
  //   return db.execute('SELECT * FROM products');
  // }

  // static findById(id) {
  //   return db.execute('SELECT * FROM products WHERE products.id = ?', [id]);
  // }

  // static deleteById(id) {

  // }
}

module.exports = Product;
