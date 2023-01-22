const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      }
    }
  ],
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
