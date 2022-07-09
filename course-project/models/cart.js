const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);
const dataPath = path.join(rootDir, 'data', 'cart.json');

class Cart {
  static addItem(id, price) {
    fs.readFile(dataPath, (error, fileContent) => {
      let cart = {
        items: [],
        totalPrice: 0,
      };

      if (!error) {
        cart = JSON.parse(fileContent);
      }

      const existingProductIndex = cart.items.findIndex(item => item.id === id);
      const existingProduct = cart.items[existingProductIndex];

      if (existingProduct) {
        const updatedProduct = { ...existingProduct };
        updatedProduct.quantity = updatedProduct.quantity + 1;
        cart.items[existingProductIndex] = updatedProduct;
      } else {
        const newProduct = { id, quantity: 1 };
        cart.items = [ ...cart.items, newProduct ];
      }

      cart.totalPrice = cart.totalPrice + +price;

      const cartData = JSON.stringify(cart);

      fs.writeFile(dataPath, cartData, (error) => {
        console.log('Error writing to cart.json file: ', error);
      });
    });
  }
}

module.exports = Cart;
