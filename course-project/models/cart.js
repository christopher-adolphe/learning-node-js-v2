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

      cart.totalPrice = (cart.totalPrice + +price).toFixed(2);

      const cartData = JSON.stringify(cart);

      fs.writeFile(dataPath, cartData, (error) => {
        console.log('Error writing to cart.json file: ', error);
      });
    });
  }

  static deleteItem(id, price) {
    fs.readFile(dataPath, (error, fileContent) => {
      const cart = JSON.parse(fileContent);
      const updatedCart = { ...cart };
      const deletedItem = updatedCart.items.find(item => item.id === id);

      if (!deletedItem) {
        console.log('Deleted item not found in cart.');
        return;
      }

      updatedCart.items = updatedCart.items.filter(item => item.id !== id);
      updatedCart.totalPrice = (updatedCart.totalPrice - (+price * deletedItem.quantity)).toFixed(2);

      const updatedCartData = JSON.stringify(updatedCart);

      fs.writeFile(dataPath, updatedCartData, (error) => {
        console.log('Error writing to cart.json file: ', error);
      });
    });
  }

  static getCart(getCartData) {
    fs.readFile(dataPath, (error, fileContent) => {
      if (error) {
        getCartData(null);
      } else {
        const cart = JSON.parse(fileContent);

        getCartData(cart);
      }
    });
  }
}

module.exports = Cart;
