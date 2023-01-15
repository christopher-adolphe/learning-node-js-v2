const mongoose = require('mongoose');

/**
 * Instantiating a `Schema` object using the constructor
 * from `mongoose`. The `Schema` constructor takes an object
 * as parameter where the key-value pairs represent the
 * structure of our model
*/
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    /**
     * Using the `ref` property to indicate mongoose
     * that the `userId` property relates to the `User`
     * model
    */
    ref: 'User',
    required: true,
  }
});

/**
 * Using the `model` function from `mongoose` to define
 * our model. It takes two parameters; a string to be
 * used as the name of the model and a schema object.
 * Behind the scenes, `mongoose` then connect this schema
 * to the name
 */
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
