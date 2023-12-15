const Joi = require('joi');
const { password, objectId } = require('./custom.validation');

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    avatar: Joi.string(),
    gender: Joi.number().required().valid(1, 2),
    phoneNumber: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      currentPassword: Joi.string().custom(password),
      newPassword: Joi.string().custom(password),
      name: Joi.string(),
      role: Joi.string(),
      isEmailVerified: Joi.bool(),
      lastLoginAt: Joi.date().allow(null),
      gender: Joi.number().allow(null),
      phoneNumber: Joi.string().allow(null),
      dob: Joi.date().allow(null),
      location: Joi.string().allow(null),
      social: Joi.object().allow(null),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
