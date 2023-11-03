const httpStatus = require('http-status');
const slugify = require('slugify');
const { Category, Product } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */

const createCategory = async (categoryBody) => {
  const { name } = categoryBody;
  if (await Category.findOne({ name })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category Name already exists');
  }
  const slug = slugify(categoryBody.name, { lower: true });
  return Category.create({ ...categoryBody, slug });
};

/**
 * Query for category
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryCategory = async (filter, options) => {
  return await Category.paginate(filter, options);
};

/**
 * Get all category
 */
const queryAllCategories = async () => {
  return await Category.find();
};

/**
 * Get category by slug
 * @param {String} slug
 * @returns {Promise<Category>}
 */
const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  return category;
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  return category;
};
/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */

const updateCategoryById = async (categoryId, updateBody) => {
  const { name } = updateBody;
  const slug = slugify(name, { lower: true });
  const category = await getCategoryById(categoryId);
  const categoryName = await Category.findOne({ name });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  if (categoryName) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already exists');
  }
  Object.assign(category, { ...updateBody, slug });
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  const product = await Product.findOne({ category: categoryId });

  if (product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category existing products');
  }
  await category.remove();
  return category;
};

module.exports = {
  createCategory,
  queryCategory,
  queryAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategoryById,
  deleteCategoryById,
};
