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
  constructor(productId, productTitle, productImg, productDesc, productPrice) {
    this.id = productId;
    this.title = productTitle;
    this.imgUrl = productImg;
    this.description = productDesc;
    this.price = productPrice;
  }

  save() {
    const saveProductCallback = (products) => {
      if (this.id) {
        const existingProductIndex = products.findIndex(product => product.id === this.id);
        const updatedProducts = [ ...products ];

        updatedProducts[existingProductIndex] = this;

        const updatedData = JSON.stringify(updatedProducts);

        fs.writeFile(dataPath, updatedData, (error) => {
          console.log('Error updating products data file: ', error);
        });
      } else {
        this.id = Math.random().toString();

        products.push(this);

        const data = JSON.stringify(products);

        fs.writeFile(dataPath, data, (error) => {
          console.log('Error saving products data file: ', error);
        });
      }
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

  static delete(id) {
    getDataFromFile((products) => {
      const updatedProducts = products.filter(product => product.id !== id);

      const updatedData = JSON.stringify(updatedProducts);

      fs.writeFile(dataPath, updatedData, (error) => {
        console.log('Error deleting products data file: ', error);
      });
    });
  }
}

module.exports = Product;
