const httpStatus = require('http-status');

const { ProductReview } = require('../../models');
const Product = require('./product.service');
const ApiError = require('../../utils/ApiError');
const { reviewTransfomer } = require('../../transformer/admin');

const caculateRating = async (productId) => {
  let totalRating = 0;
  let avgRating = 0;

  const productReview = await ProductReview.find({ product: productId });

  if (productReview.length) {
    productReview.forEach(({ rating }) => {
      totalRating += rating;
    });
    avgRating = totalRating / productReview.length;
  }

  return Product.updateProduct(productId, { rating: avgRating });
};

/**
 * Create a review
 * @param {Object} body
 * @returns {Promise<Review>}
 */
const createReview = async (body) => {
  await ProductReview.create(body);

  const review = await caculateRating(body.product);

  return review;
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
const deleteReviewById = async (productReviewId, productId) => {
  const review = await ProductReview.findById(productReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await review.remove();

  await caculateRating(productId);
  return review;
};

/**
 * Delete review by id
 * @param {ObjectId} ProductReviewId
 * @param {Object} updateBody
 */
const updateReviewById = async (productReviewId, updateBody, productId) => {
  const review = await ProductReview.findById(productReviewId);
  if (!review) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  Object.assign(review, updateBody);
  await review.save();

  caculateRating(productId);
  return review;
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  deleteReviewById,
  updateReviewById,
};
