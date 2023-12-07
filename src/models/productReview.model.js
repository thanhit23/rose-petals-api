const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      require: true,
    },
    rating: {
      type: Number,
      require: true,
      default: 0,
    },
    content: {
      type: String,
      require: false,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productReviewSchema.plugin(toJSON);
productReviewSchema.plugin(paginate);

/**
 * @typedef Review
 */

const ProductReview = mongoose.model('ProductReview', productReviewSchema);

module.exports = ProductReview;
