const express = require('express');
const validate = require('../../middlewares/validate');
const { categoryValidation } = require('../../validations');
const { categoryController } = require('../../controllers/v1');

const router = express.Router();

router.route('/').get(validate(categoryValidation.getCategories), categoryController.getCategories);

router.route('/all').get(validate(categoryValidation.getAllCategories), categoryController.getAllCategories);

module.exports = router;
