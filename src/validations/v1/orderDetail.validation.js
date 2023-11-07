const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createOrder = {
  body: Joi.object().keys({
    products: Joi.array()
      .required()
      .items({
        product: Joi.string().required().custom(objectId),
        quantity: Joi.number().required(),
        price: Joi.number().required(),
      }),
    order: Joi.string().required().custom(objectId),
    discountPercent: Joi.number(),
    shipingFee: Joi.number(),
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
