const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);
const dataPath = path.join(rootDir, 'data', 'products.json');

// Creating a helper function to read products
// from file
const getProductsFromFile = (productsCb) => {
  /**
   * Since the `readFile()` method of Node.js's
   * file system module is asynchronous, returning
   * the array of products from inside it would
   * not work. That's why we pass a callback function
   * to the `fetchAll()` method which we can call
   * inside `readFile)()` to get the products
  */
  fs.readFile(dataPath, (error, fileContent) => {
    if (error) {
      productsCb([]);
    } else {
      productsCb(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);

      fs.writeFile(dataPath, JSON.stringify(products), (error) => {
        console.log('Error writing to data file: ', error);
      });
    });

    // fs.readFile(dataPath, (error, fileContent) => {
    //   let products = [];

    //   if (!error) {
    //     products = JSON.parse(fileContent);
    //   }

    //   products.push(this);

    //   fs.writeFile(dataPath, JSON.stringify(products), (error) => {
    //     console.log('Error writing to data file: ', error);
    //   });
    // });
  }

  static fetchAll(productsCb) {
    // return products;

     getProductsFromFile(productsCb)
  }
}

module.exports = Product;
