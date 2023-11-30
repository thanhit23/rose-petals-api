const { isEmpty } = require('lodash');
const moment = require('moment');
const querystring = require('qs');
const crypto = require('crypto');
const httpStatus = require('http-status');

const { Cart, User, Order } = require('../../models');
const { VNP } = require('../../config/vnp');
const ApiError = require('../../utils/ApiError');
const catchAsync = require('../../utils/catchAsync');
const { orderDetailService, orderService } = require('../../services/app');

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

const createpayment = catchAsync(async (req, res) => {
  const {
    user: { _id },
    body: { orderId, amount, language = 'vn' },
  } = req;

  const carts = await Cart.find({ userId: _id });

  if (!carts) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');

  const ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  let vnpUrl = VNP.URL;
  const returnUrl = `${VNP.RETURN_URL}?userId=${req.body.userId}`;
  const bankCode = req.body.bankCode || 'NCB';

  const vnpParams = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: VNP.TMN_CODE,
    vnp_Locale: isEmpty(language) ? 'vn' : language,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: `Thanh toan cho ma GD:${orderId}`,
    vnp_OrderType: 'other',
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (bankCode !== null && bankCode !== '') {
    vnpParams.vnp_BankCode = bankCode;
  }

  const params = sortObject(vnpParams);
  const signData = querystring.stringify(params, { encode: false });
  const hmac = crypto.createHmac('sha512', VNP.HASH_SECRET);

  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
  params.vnp_SecureHash = signed;
  vnpUrl += `?${querystring.stringify(params, { encode: false })}`;

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

  const vnpParam = sortObject(vnpParams);
  const secretKey = VNP.HASH_SECRET;
  const signData = querystring.stringify(vnpParam, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  // eslint-disable-next-line security/detect-new-buffer, no-buffer-constructor
  const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

  const paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  // let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  // let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  const checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  const checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
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

const deleteOrder = catchAsync(async ({ params: { orderId } }, res) => {
  await orderDetailService.deleteOrderDetailById(orderId);

  const amount = await orderDetailService.calculatorAmount(orderId);

  await orderService.updateOrderById(orderId, { amount });

  res.success(true);
});

module.exports = {
  createpayment,
  getVnpayIpn,
  deleteOrder,
  getVnpayReturn,
};
