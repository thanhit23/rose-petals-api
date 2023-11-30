const express = require('express');

const request = require('request');
const moment = require('moment');
const crypto = require('crypto');

const { VNP } = require('../../config/vnp');
const { paymentController } = require('../../controllers/v1');

const router = express.Router();

router.route('/create').post(paymentController.createpayment);
router.route('/vnpay/return').get(paymentController.getVnpayReturn);
router.route('/vnpay/ipn').get(paymentController.getVnpayIpn);

router.post('/querydr', function (req, res) {
  const date = new Date();

  // eslint-disable-next-line camelcase
  const vnp_TmnCode = VNP.TMN_CODE;
  const secretKey = VNP.HASH_SECRET;
  // eslint-disable-next-line camelcase
  const vnp_Api = VNP.API;

  // eslint-disable-next-line camelcase
  const vnp_TxnRef = req.body.orderId;
  // eslint-disable-next-line camelcase
  const vnp_TransactionDate = req.body.transDate;

  // eslint-disable-next-line camelcase
  const vnp_RequestId = moment(date).format('HHmmss');
  // eslint-disable-next-line camelcase
  const vnp_Version = '2.1.0';
  // eslint-disable-next-line camelcase
  const vnp_Command = 'querydr';
  // eslint-disable-next-line camelcase
  const vnp_OrderInfo = `Truy van GD ma:${vnp_TxnRef}`;

  // eslint-disable-next-line camelcase
  const vnp_IpAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // eslint-disable-next-line camelcase
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  // eslint-disable-next-line camelcase
  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TxnRef}|${vnp_TransactionDate}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;

  const hmac = crypto.createHmac('sha512', secretKey);
  // eslint-disable-next-line camelcase, security/detect-new-buffer, no-buffer-constructor
  const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };
  // /merchant_webapi/api/transaction
  // let result = {}
  request(
    {
      url: vnp_Api,
      method: 'POST',
      json: true,
      body: dataObj,
    },
    function (error, response) {
      // console.log(response);
      // result = response
      res.json({ data: response });
    }
  );
  // console.log(req.body)
  // res.json({ data: result })
});

router.post('/refund', function (req) {
  const date = new Date();

  // eslint-disable-next-line camelcase
  const vnp_TmnCode = VNP.TMN_CODE;
  const secretKey = VNP.HASH_SECRET;
  // eslint-disable-next-line camelcase
  const vnp_Api = VNP.API;

  // eslint-disable-next-line camelcase
  const vnp_TxnRef = req.body.orderId;
  // eslint-disable-next-line camelcase
  const vnp_TransactionDate = req.body.transDate;
  // eslint-disable-next-line camelcase
  const vnp_Amount = req.body.amount * 100;
  // eslint-disable-next-line camelcase
  const vnp_TransactionType = req.body.transType;
  // eslint-disable-next-line camelcase
  const vnp_CreateBy = req.body.user;

  // eslint-disable-next-line camelcase
  const vnp_RequestId = moment(date).format('HHmmss');
  // eslint-disable-next-line camelcase
  const vnp_Version = '2.1.0';
  // eslint-disable-next-line camelcase
  const vnp_Command = 'refund';
  // eslint-disable-next-line camelcase
  const vnp_OrderInfo = `Hoan tien GD ma:${vnp_TxnRef}`;

  // eslint-disable-next-line camelcase
  const vnp_IpAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // eslint-disable-next-line camelcase
  const vnp_CreateDate = moment(date).format('YYYYMMDDHHmmss');

  // eslint-disable-next-line camelcase
  const vnp_TransactionNo = '0';

  // eslint-disable-next-line camelcase
  const data = `${vnp_RequestId}|${vnp_Version}|${vnp_Command}|${vnp_TmnCode}|${vnp_TransactionType}|${vnp_TxnRef}|${vnp_Amount}|${vnp_TransactionNo}|${vnp_TransactionDate}|${vnp_CreateBy}|${vnp_CreateDate}|${vnp_IpAddr}|${vnp_OrderInfo}`;
  const hmac = crypto.createHmac('sha512', secretKey);
  // eslint-disable-next-line camelcase, security/detect-new-buffer, no-buffer-constructor
  const vnp_SecureHash = hmac.update(new Buffer(data, 'utf-8')).digest('hex');

  const dataObj = {
    vnp_RequestId,
    vnp_Version,
    vnp_Command,
    vnp_TmnCode,
    vnp_TransactionType,
    vnp_TxnRef,
    vnp_Amount,
    vnp_TransactionNo,
    vnp_CreateBy,
    vnp_OrderInfo,
    vnp_TransactionDate,
    vnp_CreateDate,
    vnp_IpAddr,
    vnp_SecureHash,
  };

  request(
    {
      url: vnp_Api,
      method: 'POST',
      json: true,
      body: dataObj,
    },
    function (error, response) {
      // eslint-disable-next-line no-console
      console.log(response);
    }
  );
});

module.exports = router;
