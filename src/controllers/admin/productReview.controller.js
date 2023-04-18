const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productReviewService } = require('../../services/app');

const createReview = catchAsync(async ({ body }, res) => {
  const ProductReview = await productReviewService.createReview(body);
  return res.createSuccess(ProductReview);
});

const getReviews = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'user,product';

  const result = await productReviewService.getReviews(filter, options);
  return res.success(result);
});

const getReviewDetail = catchAsync(async ({ params: { productReviewId } }, res) => {
  const ProductReview = await productReviewService.getReviewById(productReviewId);
  if (!ProductReview) return res.resourceNotFound();
  return res.success(ProductReview);
});

const updateReview = catchAsync(async ({ params: { productReviewId }, body }, res) => {
  const ProductReview = await productReviewService.updateReviewById(productReviewId, body);
  res.success(ProductReview);
});

const deleteReview = catchAsync(async ({ params: { productReviewId } }, res) => {
  await productReviewService.deleteReviewById(productReviewId);
  res.success(true);
});

module.exports = {
  createReview,
  getReviews,
  getReviewDetail,
  updateReview,
  deleteReview,
};
