const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createCart = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    quantity: Joi.number().required(),
    size: Joi.array().default([]),
    color: Joi.string().default(''),
  }),
};

const getCarts = {
  query: Joi.object().keys({
    productId: Joi.string().custom(objectId),
    quantity: Joi.number(),
    size: Joi.string(),
    color: Joi.string(),
  }),
};

const getCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

const updateCart = {
  params: Joi.object().keys({
    cartId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      quantity: Joi.string(),
    })
    .min(1)
    .max(10),
};

const deleteCart = {
  params: Joi.object().keys({
    cartId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  updateCart,
  createCart,
  getCarts,
  getCart,
  deleteCart,
};
