const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ]
});

/**
 * Using the `methods` key on the schema to
 * create an instance method. This allows us
 * to add custom logic to a particular model
 * NOTE: When definig a custom instance method
 * on a schema, we should always use the `function`
 * keyword so that the `this` keyword will refer
 * to the instance of the schema
*/
userSchema.methods.addToCart = async function(productId) {
  const cartItemIndex = this.cart.findIndex(item => item.productId.toString() === productId.toString());
    const updatedCartItems = [ ...this.cart ];
    let newQuantity = 1;

    if (cartItemIndex !== -1) {
      newQuantity = this.cart[cartItemIndex].quantity + 1;
      updatedCartItems[cartItemIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: productId,
        quantity: newQuantity,
      });
    }

    this.cart = updatedCartItems;

    try {
      const result = await this.save();

      return result;
    } catch (error) {
      console.log(`Sorry, an error occurred while adding product to cart with id ${productId}: ${error}`);
    }
}

userSchema.methods.removeFromCart = async function(productId) {
  this.cart = this.cart.filter(item => item.productId.toString() !== productId.toString());

  try {
    const result = await this.save();

    return result;
  } catch (error) {
    console.log(`Sorry, an error occurred while removing product to cart with id ${productId}: ${error}`);
  }
}

const User = mongoose.model('User', userSchema);

module.exports = User;
