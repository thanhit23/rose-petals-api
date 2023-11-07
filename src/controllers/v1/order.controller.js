const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { orderService, orderDetailService } = require('../../services/app');

const createOrder = catchAsync(async ({ user, body }, res) => {
  const order = await orderService.createOrder({ ...body, user: user._id });
  return res.createSuccess(order);
});

const getOrders = catchAsync(async ({ user: { _id }, query }, res) => {
  const filter = pick({ ...query, user: _id }, ['name', 'user']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'user';

  const result = await orderService.queryOrders(filter, options);
  return res.success(result);
});

const getAllOrders = catchAsync(async (req, res) => {
  const result = await orderService.getAllOrders();
  return res.success(result);
});

const getOrder = catchAsync(async ({ params: { orderId } }, res) => {
  const options = pick({}, ['sortBy', 'limit', 'page']);
  options.populate = 'user';

  const order = await orderService.getOrderById(orderId, options);
  if (!order) return res.resourceNotFound();

  return res.success(order);
});

const updateOrder = catchAsync(async ({ params: { orderId }, body }, res) => {
  const order = await orderService.updateOrderById(orderId, body);
  res.success(order);
});

const deleteOrder = catchAsync(async ({ params: { orderId } }, res) => {
  await orderService.deleteOrderById(orderId);
  await orderDetailService.deleteListOrderDetailById(orderId);
  res.success(true);
});

module.exports = {
  createOrder,
  getOrders,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
};
