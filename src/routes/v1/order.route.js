const express = require('express');
const validate = require('../../middlewares/validate');
const { orderValidation } = require('../../validations/v1');
const { orderController } = require('../../controllers/v1');

const router = express.Router();

router
  .route('/')
  .get(validate(orderValidation.getOrders), orderController.getOrders)
  .post(validate(orderValidation.createOrder), orderController.createOrder);

module.exports = router;
