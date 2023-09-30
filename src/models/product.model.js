const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      require: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      require: true,
    },
    category: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      type: Number,
      required: true,
      default: null,
    },
    images: {
      type: Array,
      required: true,
      default: [],
    },
    description: {
      type: String,
      default: null,
    },
    brand: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Brand',
    },
    rating: {
      type: Number,
      default: 0,
    },
    size: {
      type: Array,
      default: ['M', 'L', 'XL'],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);
productSchema.plugin(paginate);

const Product = mongoose.model('product', productSchema);

module.exports = Product;
