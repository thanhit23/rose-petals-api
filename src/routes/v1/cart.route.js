const express = require('express');
const validate = require('../../middlewares/validate');
const { cartValidation } = require('../../validations');
const { cartController } = require('../../controllers/v1');

const router = express.Router();

router
  .route('/')
  .get(validate(cartValidation.getCarts), cartController.getCarts)
  .post(validate(cartValidation.createCart), cartController.createCart);

router
  .route('/:cartId')
  .get(validate(cartValidation.getCart), cartController.getCart)
  .put(validate(cartValidation.updateCart), cartController.updateCart)
  .delete(validate(cartValidation.deleteCart), cartController.deleteCart);

module.exports = router;
