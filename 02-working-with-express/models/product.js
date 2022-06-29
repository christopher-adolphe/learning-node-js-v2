const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);
const dataPath = path.join(rootDir, 'data', 'products.json');
// const products = [];

class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    fs.readFile(dataPath, (error, fileContent) => {
      let products = [];

      if (!error) {
        products = JSON.parse(fileContent);
      }

      products.push(this);

      fs.writeFile(dataPath, JSON.stringify(products), (error) => {
        console.log('Error writing to data file: ', error);
      });
    });
  }

  static fetchAll() {
    // return products;
    fs.readFile(dataPath, (error, fileContent) => {
      if (error) {
        return [];
      }

      return JSON.parse(fileContent);
    });
  }
}

module.exports = Product;
