const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    sold: Joi.number().required(),
    images: Joi.array().required(),
    size: Joi.array().required(),
    rating: Joi.number().required(),
    description: Joi.string().required(),
    category: Joi.string().required().custom(objectId),
    brand: Joi.string().required().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    price_min: Joi.number().min(0),
    price_max: Joi.number(),
    rating_min: Joi.number().min(0),
    rating_max: Joi.number().max(5),
    sold: Joi.number(),
    brand: Joi.string(),
    featured: Joi.boolean(),
    best_selling: Joi.boolean(),
    week_top: Joi.boolean(),
    new_top: Joi.boolean(),
    category: Joi.string(),
    related: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getProductBySlug = {
  params: Joi.object().keys({
    slug: Joi.string(),
  }),
};

const getProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

const updateProduct = {
  params: Joi.object().keys({
    productId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      price: Joi.number(),
      quantity: Joi.number(),
      sold: Joi.number(),
      brand: Joi.string(),
      images: Joi.array(),
      size: Joi.array(),
      rating: Joi.number(),
      category: Joi.string(),
      description: Joi.string().allow(null),
    })
    .min(1),
};

const deleteProduct = {
  params: Joi.object().keys({
    productId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createProduct,
  getProducts,
  getProduct,
  getProductBySlug,
  deleteProduct,
  updateProduct,
};
