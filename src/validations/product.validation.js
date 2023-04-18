const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProduct = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    price: Joi.number().required(),
    images: Joi.array().required(),
    description: Joi.string().required(),
    category: Joi.string().required().custom(objectId),
    brand: Joi.string().required().custom(objectId),
  }),
};

const getProducts = {
  query: Joi.object().keys({
    name: Joi.string(),
    price: Joi.number(),
    brand: Joi.string(),
    images: Joi.array(),
    description: Joi.string(),
    category: Joi.string(),
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
      brand: Joi.string(),
      images: Joi.array(),
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
