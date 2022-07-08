const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);
const dataPath = path.join(rootDir, 'data', 'products.json');

const getDataFromFile = (retrieveDataCallback) => {
  fs.readFile(dataPath, (error, fileContent) => {
    if (error) {
      retrieveDataCallback([]);
    } else {
      retrieveDataCallback(JSON.parse(fileContent));
    }
  });
};

class Product {
  constructor(ProductTitle, ProductImg, productDesc, productPrice) {
    this.title = ProductTitle;
    this.imgUrl = ProductImg;
    this.description = productDesc;
    this.price = productPrice;
  }

  save() {
    this.id = Math.random().toString();
    const saveProductCallback = (products) => {
      products.push(this);

      const data = JSON.stringify(products);

      fs.writeFile(dataPath, data, (error) => {
        console.log('Error writing to data file: ', error);
      });
    };

    getDataFromFile(saveProductCallback);
  }

  static fetchAll(getAllProductsCallback) {
    getDataFromFile(getAllProductsCallback);
  }

  static findById(id, getProductByIdCallback) {
    const getAllProductsCallback = (products) => {
      const product = products.find(product => product.id === id);

      getProductByIdCallback(product);
    };

    getDataFromFile(getAllProductsCallback);
  }
}

module.exports = Product;
