const { isEmpty } = require('lodash');
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const httpStatus = require('http-status');
const request = require('request');

const { Cart, User, Order } = require('../../models');
const { VNP } = require('../../config/vnp');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');

function sortObject(obj) {
  const sorted = {};
  const str = [];
  let key;
  // eslint-disable-next-line no-restricted-syntax
  for (key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }

  str.sort();
  // eslint-disable-next-line no-plusplus
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

const getIPAddress = (req) => {
  return (
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
  );
};

const createpayment = catchAsync(async (req, res) => {
  const {
    user: { _id },
    body: { orderId, amount, language = 'vn', bankCode = 'NCB' },
  } = req;

  const carts = await Cart.find({ userId: _id });

  if (!carts) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const ipAddr = getIPAddress(req);

  const returnUrl = `${VNP.RETURN_URL}/order/${orderId}?userId=${_id}`;

  const vnpParams = {
    vnp_Version: VNP.VERSION,
    vnp_TmnCode: VNP.TMN_CODE,
    vnp_TxnRef: orderId,
    vnp_Locale: isEmpty(language) ? 'vn' : language,
    vnp_Command: 'pay',
    vnp_CurrCode: 'VND',
    vnp_OrderType: 'other',
    vnp_OrderInfo: `Thanh toan cho ma GD: ${orderId}`,
    vnp_IpAddr: ipAddr,
    vnp_BankCode: bankCode,
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_CreateDate: createDate,
  };

  const params = sortObject(vnpParams);
  const signData = querystring.stringify(params, { encode: false });
  const hmac = crypto.createHmac('sha512', VNP.HASH_SECRET);

  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  params.vnp_SecureHash = signed;
  const vnpUrl = `${VNP.URL}?${querystring.stringify(params, { encode: false })}`;

  return res.createSuccess({ url: vnpUrl });
});

const getVnpayReturn = catchAsync(async ({ query }, res) => {
  const { userId, ...params } = query;

  const orderId = params.vnp_TxnRef;

  const secureHash = params.vnp_SecureHash;

  delete params.vnp_SecureHash;

  delete params.vnp_SecureHashType;

  const vnpParams = sortObject(params);

  const rspCode = vnpParams.vnp_ResponseCode;

  const signData = querystring.stringify(vnpParams, { encode: false });
  const hmac = crypto.createHmac('sha512', VNP.HASH_SECRET);

  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  if (secureHash !== signed) {
    return res.error('Checksum failed', { RspCode: '97' });
  }

  if (rspCode === '00') {
    await Cart.deleteMany({ userId });
    await User.findByIdAndUpdate(userId, { $set: { cart: [] } });
    res.redirect(`https://rose-petals.vercel.app/thank`);
  } else {
    await Order.findOneAndDelete({ _id: orderId });
    res.redirect(`https://rose-petals.vercel.app/checkout`);
  }
});

const getVnpayIpn = catchAsync(async (req, res) => {
  const vnpParams = req.query;

  const secureHash = vnpParams.vnp_SecureHash;

  const rspCode = vnpParams.vnp_ResponseCode;

  delete vnpParams.vnp_SecureHash;
  delete vnpParams.vnp_SecureHashType;
  // eslint-disable-next-line no-console
  console.log(vnpParams, 'vnpParams');
  const a = {
    vnp_Amount: '1000000',
    vnp_BankCode: 'NCB',
    vnp_OrderInfo: 'Thanh toan cho ma GD: 65709fb439d5206b65edc7cba',
    vnp_ResponseCode: '00',
    vnp_TmnCode: 'X56H06H4',
    vnp_TransactionNo: '14224059',
    vnp_TxnRef: '65709fb439d5206b65edc7cba',
  };

  // const params = sortObject(vnpParams);
  const signData = querystring.stringify(a, { encode: false });
  // eslint-disable-next-line global-require
  const cryptos = require('crypto');
  const hmac = cryptos.createHmac('sha512', VNP.HASH_SECRET);
  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  const paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  // let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  // let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  // eslint-disable-next-line no-console
  console.log(secureHash, 'secureHash');
  // eslint-disable-next-line no-console
  console.log(signed, 'signed');
  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === '0') {
          // kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode === '00') {
            // thanh cong
            // paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            // eslint-disable-next-line no-console
            console.log('checkOrderId', checkOrderId);
            // eslint-disable-next-line no-console
            console.log('checkAmount', checkAmount);
            res.success({
              rspCode,
              Message: 'Payment successful',
            });
          } else {
            // that bai
            // paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.redirect(`http://localhost:5173/checkout`);
            // res.status(200).json({ rspCode, Message: "Giao dịch thất bại" });
          }
        } else {
          res.error('This order has been updated to the payment status', {
            RspCode: '02',
          });
        }
      } else {
        res.error('Amount invalid', { RspCode: '02' });
      }
    } else {
      res.error('Order not found', { RspCode: '01' });
    }
  } else {
    res.error('Checksum failed', { RspCode: '97' });
  }
});

const querydr = catchAsync(async (req, res) => {
  const date = new Date();
  const txnRef = req.body.orderId;
  const transactionDate = req.body.transDate;
  const requestId = moment(date).format('HHmmss');
  const command = 'querydr';
  const orderInfo = `Truy van GD ma: ${txnRef}`;

  const ipAddr = getIPAddress(req);

  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const arrayCreateDate = [
    requestId,
    VNP.VERSION,
    command,
    VNP.TMN_CODE,
    txnRef,
    transactionDate,
    createDate,
    ipAddr,
    orderInfo,
  ];

  const hmac = crypto.createHmac('sha512', VNP.HASH_SECRET);

  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const secureHash = hmac.update(new Buffer(arrayCreateDate.join('|'), 'utf-8')).digest('hex');

  const dataObj = {
    vnp_RequestId: requestId,
    vnp_Version: VNP.VERSION,
    vnp_Command: command,
    vnp_TmnCode: VNP.TMN_CODE,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_TransactionDate: transactionDate,
    vnp_CreateDate: createDate,
    vnp_IpAddr: ipAddr,
    vnp_SecureHash: secureHash,
  };

  request(
    {
      url: VNP.API,
      method: 'POST',
      json: true,
      body: dataObj,
    },
    (error, response) => {
      if (response.body.vnp_ResponseCode === '00') {
        return res.success(true);
      }

      res.error(response.body.vnp_Message);
    }
  );
});

module.exports = {
  getVnpayReturn,
  createpayment,
  getVnpayIpn,
  querydr,
};
