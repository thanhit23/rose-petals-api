const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createReview = {
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
    rating: Joi.number().min(0).max(5),
    content: Joi.string(),
  }),
};

const getReviews = {
  query: Joi.object().keys({
    user: Joi.string(),
    content: Joi.string(),
    product: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getReviewDetail = {
  params: Joi.object().keys({
    productReviewId: Joi.string().custom(objectId),
  }),
};

const updateReview = {
  params: Joi.object().keys({
    productReviewId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      rating: Joi.number().min(0).max(5),
      content: Joi.string(),
    })
    .min(1),
};

const deleteReview = {
  params: Joi.object().keys({
    productReviewId: Joi.string().custom(objectId).required(),
  }),
  query: Joi.object().keys({
    productId: Joi.string().custom(objectId).required(),
  }),
};

module.exports = {
  createReview,
  getReviews,
  getReviewDetail,
  deleteReview,
  updateReview,
};
