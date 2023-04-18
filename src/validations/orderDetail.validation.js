const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOrder = {
  body: Joi.object().keys({
    product: Joi.string().required().custom(objectId),
    order: Joi.string().required().custom(objectId),
    price: Joi.number().required(),
    discountPercent: Joi.number(),
    shipingFee: Joi.number(),
    quantity: Joi.number().required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
    orderDetailId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      price: Joi.number(),
      quantity: Joi.number(),
      discountPercent: Joi.number(),
      shipingFee: Joi.number(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
    orderDetailId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  deleteOrder,
  updateOrder,
};
