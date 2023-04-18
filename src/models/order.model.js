const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    customerNote: {
      type: String,
    },
    amount: {
      type: Number,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    status: {
      type: Number,
      require: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderSchema.plugin(toJSON);
orderSchema.plugin(paginate);

/**
 * @typedef Order
 */

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
