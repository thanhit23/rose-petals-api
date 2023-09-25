const express = require('express');
const validate = require('../../middlewares/validate');
const { userValidation } = require('../../validations/v1');
const { userController } = require('../../controllers/v1');

const router = express.Router();

router.route('/analytics').get(userController.getAnalytics);

router.route('/').put(validate(userValidation.updateUser), userController.updateUser);

module.exports = router;
