const httpStatus = require('http-status');

const { ProductReview } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { reviewTransfomer } = require('../../transformer/admin');

/**
 * Create a review
 * @param {Object} body
 * @returns {Promise<Review>}
 */
const createReview = async (body) => {
  return ProductReview.create(body);
};

/**
 * Query for reviews
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const getReviews = async (filter, options) => {
  const data = await ProductReview.paginate(filter, options);
  return reviewTransfomer.getReviews(data);
};

/**
 * Get review detail by Id
 * @param id
 * @returns {Promise<Review>}
 */
const getReviewById = async (id) => {
  return ProductReview.findById(id);
};

/**
 * Delete review by id
 * @param {ObjectId} productReviewId
 * @returns {Promise<ProductReview>}
 */
const deleteReviewById = async (productReviewId) => {
  const review = await ProductReview.findById(productReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await review.remove();
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} ProductReviewId
 * @param {Object} updateBody
 */
const updateReviewById = async (productReviewId, updateBody) => {
  const review = await ProductReview.findById(productReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  Object.assign(review, updateBody);
  await review.save();
  return review;
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  deleteReviewById,
  updateReviewById,
};
