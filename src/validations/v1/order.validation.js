const Joi = require('joi');
const { objectId } = require('../custom.validation');

const createOrder = {
  body: Joi.object().keys({
    fullName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    address: Joi.string().required(),
    customerNote: Joi.string().allow(null).allow(''),
    amount: Joi.number().required(),
    quantity: Joi.number().required(),
    methodPayment: Joi.string(),
    status: Joi.number().required(),
  }),
};

const getOrders = {
  query: Joi.object().keys({
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

const updateOrder = {
  params: Joi.object().keys({
    orderId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      address: Joi.string().required(),
      customerNote: Joi.string(),
      amount: Joi.number().required(),
      quantity: Joi.number().required(),
      methodPayment: Joi.number().required(),
      status: Joi.number().required(),
    })
    .min(1),
};

const deleteOrder = {
  params: Joi.object().keys({
    orderId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOrder,
  getOrders,
  getOrder,
  deleteOrder,
  updateOrder,
};
