const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const cartSchema = mongoose.Schema(
  {
    userId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    productId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    },
    quantity: {
      type: Number,
      require: true,
    },
    size: {
      type: Array,
      require: true,
    },
    color: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
cartSchema.plugin(toJSON);
cartSchema.plugin(paginate);

const Cart = mongoose.model('cart', cartSchema);

module.exports = Cart;
