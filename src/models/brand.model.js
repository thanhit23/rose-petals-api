const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      require: true,
    },
    logo: {
      type: String,
    },
    deleteAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
brandSchema.plugin(toJSON);
brandSchema.plugin(paginate);

/**
 * @typedef Brand
 */

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;
