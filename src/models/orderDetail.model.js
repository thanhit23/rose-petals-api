const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const orderDetailSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      require: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    price: {
      type: Number,
      require: true,
    },
    discountPercent: {
      type: Number,
    },
    shipingFee: {
      type: Number,
    },
    quantity: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
orderDetailSchema.plugin(toJSON);
orderDetailSchema.plugin(paginate);

/**
 * @typedef OrderDetail
 */

const OrderDetail = mongoose.model('orderDetail', orderDetailSchema);

module.exports = OrderDetail;
