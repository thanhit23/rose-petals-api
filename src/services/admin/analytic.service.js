const moment = require('moment');
const { isEmpty } = require('lodash');

const { OrderDetail, Order, Product } = require('../../models');

const getAnalytics = async () => {
  const currentMonth = moment().format('MM');
  let soldTotal = 0;
  let soldMonth = 0;
  let amountTotal = 0;
  let amountMonth = 0;
  let amountCurrentDate = 0;
  let shippingTotal = 0;
  let shippingMonth = 0;

  const orders = await Order.find();
  const products = await Product.find();
  const orderDetails = await OrderDetail.find();

  const orderTotal = orders.length;
  const orderMonth = orders.filter((order) => moment(order.updatedAt).format('MM') === currentMonth).length;

  // eslint-disable-next-line array-callback-return
  orders.map(({ _id, amount, createdAt }) => {
    amountTotal += amount || 0;

    const orderDetail = orderDetails.find(({ order }) => {
      return String(order) === String(_id);
    });

    if (!isEmpty(orderDetail)) {
      if (moment(orderDetail.createdAt).format('MM') === currentMonth) {
        shippingMonth += amount;
      }

      shippingTotal += orderDetail.shipingFee;
    }

    if (moment(createdAt).format('MM') === currentMonth) {
      amountMonth += amount;
    }

    if (moment(createdAt).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
      amountCurrentDate += amount;
    }
  });

  // eslint-disable-next-line array-callback-return
  products.map((product) => {
    soldTotal += product.sold || 0;

    if (moment(product.createdAt).format('MM') === currentMonth) {
      soldMonth += product.sold || 0;
    }
  });

  return {
    orderMonth,
    orderTotal,
    amountTotal,
    amountMonth,
    amountCurrentDate,
    soldTotal,
    soldMonth,
    shippingTotal,
    shippingMonth,
  };
};

module.exports = {
  getAnalytics,
};
