const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    size: Joi.string().required(),
  }),
};

const getCarts = {
  query: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    quantity: Joi.number(),
    size: Joi.string(),
  }),
};

const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createCart,
  getCarts,
  getCart,
  deleteCart,
};