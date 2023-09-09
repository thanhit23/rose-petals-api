const express = require('express');
const validate = require('../../middlewares/validate');
const { brandValidation } = require('../../validations');
const { brandController } = require('../../controllers/v1');

const router = express.Router();

router.route('/').get(validate(brandValidation.getBrands), brandController.getBrands);

router.route('/all').get(validate(brandValidation.getAllBrands), brandController.getAllBrands);

module.exports = router;
