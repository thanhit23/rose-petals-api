const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { orderService } = require('../../services/app');

const createOrder = catchAsync(async ({ body, user: { _id } }, res) => {
  const order = await orderService.createOrder({ ...body, user: _id });
  return res.createSuccess(order);
});

const getOrders = catchAsync(async ({ query, user: { _id } }, res) => {
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'user';

  const result = await orderService.queryOrders({ user: _id }, options);
  return res.success(result);
});

const getOrder = catchAsync(async ({ params: { orderId } }, res) => {
  const options = pick({}, ['sortBy', 'limit', 'page']);
  options.populate = 'user';

  const order = await orderService.getOrderById(orderId, options);
  if (!order) return res.resourceNotFound();

  return res.success(order);
});

module.exports = {
  createOrder,
  getOrders,
  getOrder,
};
