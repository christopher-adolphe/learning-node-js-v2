const { getDatabase } = require('../utils/database');

class Product {
  constructor(productTitle, productImg, productDesc, productPrice) {
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
        .find({ _id: id })
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
