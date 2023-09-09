const express = require('express');
const validate = require('../../middlewares/validate');
const { productValidation } = require('../../validations');
const { productController } = require('../../controllers/v1');

const router = express.Router();

router.route('/').get(validate(productValidation.getProducts), productController.getProducts);

router.route('/search/:slug').get(validate(productValidation.getProducts), productController.getProducts);

router.route('/:productId').get(validate(productValidation.getProduct), productController.getProduct);

module.exports = router;
