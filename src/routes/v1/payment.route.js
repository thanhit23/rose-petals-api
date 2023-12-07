const express = require('express');

const { paymentController } = require('../../controllers/v1');

const router = express.Router();

router.route('/create').post(paymentController.createpayment);
router.route('/vnpay/return').get(paymentController.getVnpayReturn);
router.route('/vnpay/ipn').get(paymentController.getVnpayIpn);
router.route('/vnpay/querydr').post(paymentController.querydr);

module.exports = router;
