const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  slug: {
    type: String,
    require: true,
    unique: true,
  },
  deleteAt: {
    type: Date,
    default: null,
  },
});

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

/**
 * @typedef Category
 */

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
