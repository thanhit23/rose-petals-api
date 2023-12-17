const httpStatus = require('http-status');

const ApiError = require('../../utils/ApiError');
const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productReviewService } = require('../../services/app');

const createReview = catchAsync(async ({ user: { _id }, body }, res) => {
  const ProductReview = await productReviewService.createReview({ ...body, user: { _id } });
  return res.createSuccess(ProductReview);
});

const getReviews = catchAsync(async (req, res) => {
  const { query } = req;
  const filter = pick(query, ['user', 'product']);
  filter.searchCriteria = {
    name: 'like',
  };

  if (filter.user) {
    if (!req.user) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
    }
  }

  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'user,product';

  const result = await productReviewService.getReviews(filter, options);
  return res.success(result);
});

const updateReview = catchAsync(async ({ params: { productReviewId }, body, query: { productId } }, res) => {
  const ProductReview = await productReviewService.updateReviewById(productReviewId, body, productId);
  res.success(ProductReview);
});

const deleteReview = catchAsync(async ({ params: { productReviewId }, query: { productId } }, res) => {
  await productReviewService.deleteReviewById(productReviewId, productId);
  res.success(true);
});

module.exports = {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
};
