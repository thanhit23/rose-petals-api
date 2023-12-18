const Joi = require('joi');

const updateUser = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().allow(null),
      name: Joi.string().allow(null),
      isEmailVerified: Joi.bool().allow(null),
      gender: Joi.number().allow(null),
      phoneNumber: Joi.string().allow(null),
      dob: Joi.date().allow(null),
      avatar: Joi.string().allow(null),
      location: Joi.string().allow(null),
    })
    .min(1),
};

const uploadAvatar = {
  body: Joi.object()
    .keys({
      avatar: Joi.string().required(),
    })
    .min(1),
};

module.exports = {
  updateUser,
  uploadAvatar,
};
