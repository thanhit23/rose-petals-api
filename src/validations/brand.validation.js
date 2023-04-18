const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createBrand = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    logo: Joi.string().required(),
  }),
};

const getBrands = {
  query: Joi.object().keys({
    name: Joi.string(),
    logo: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getAllBrands = {
  query: Joi.object().keys({
    name: Joi.string(),
    logo: Joi.string(),
  }),
};

const getBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(objectId),
  }),
};

const getBrandBySlug = {
  params: Joi.object().keys({
    slug: Joi.string(),
  }),
};

const updateBrand = {
  params: Joi.object().keys({
    brandId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      logo: Joi.string(),
    })
    .min(1),
};

const deleteBrand = {
  params: Joi.object().keys({
    brandId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createBrand,
  getAllBrands,
  getBrandBySlug,
  getBrands,
  getBrand,
  deleteBrand,
  updateBrand,
};
