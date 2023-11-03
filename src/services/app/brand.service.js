const httpStatus = require('http-status');
const slugify = require('slugify');

const { Brand, Product } = require('../../models');
const { brandTransfomer } = require('../../transformer/admin');
const ApiError = require('../../utils/ApiError');

/**
 * Create a brand
 * @param {Object} body
 * @returns {Promise<Brand>}
 */
const createBrand = async (body) => {
  const { name } = body;
  const slug = slugify(name, { lower: true });

  const brand = await Brand.findOne({ slug });
  if (brand) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Name already taken');
  }

  return Brand.create({ ...body, slug });
};

/**
 * Query for brands
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryBrands = async (filter, options) => {
  const data = await Brand.paginate(filter, options);
  return brandTransfomer.getBrandsList(data);
};

/**
 * Get brand detail by Id
 * @param id
 * @returns {Promise<Brand>}
 */
const getBrandById = async (id) => {
  const data = await Brand.findById(id);
  return brandTransfomer.getBrand(data);
};

const getBrandBySlug = async (slug) => {
  const brand = await Brand.findOne({ slug });
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  return brand;
};

const getAllBrands = async () => {
  return Brand.find();
};

/**
 * Delete brand by id
 * @param {ObjectId} brandId
 * @returns {Promise<Brand>}
 */
const deleteBrandById = async (brandId) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  const product = await Product.findOne({ brand: brandId });

  if (product) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Brand existing products');
  }
  await brand.remove();
  return brand;
};

const updateBrandById = async (brandId, updateBody) => {
  const brand = await Brand.findById(brandId);
  if (!brand) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  Object.assign(brand, updateBody);
  await brand.save();
  return brand;
};

module.exports = {
  createBrand,
  queryBrands,
  getBrandBySlug,
  getAllBrands,
  getBrandById,
  deleteBrandById,
  updateBrandById,
};
