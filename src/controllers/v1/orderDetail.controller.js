const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { orderDetailService, orderService } = require('../../services/app');

const createOrder = catchAsync(async ({ body }, res) => {
  const { products, ...rest } = body;
  products.map(async (product) => {
    await orderDetailService.createOrderDetail({ ...rest, ...product });
  });

  const { order } = body;

  const amount = await orderDetailService.calculatorAmount(order, products);

  await orderService.updateOrderById(order, { amount });

  return res.createSuccess(true);
});

const getListOrderByOrderId = catchAsync(async ({ user: { _id: userId }, query, params: { orderId } }, res) => {
  const filter = pick(query, ['order']);

  filter.searchCriteria = {
    name: 'like',
  };

  const options = pick(query, ['sortBy', 'limit', 'page']);

  options.populate = 'product';

  const result = await orderDetailService.getListOrdersDetailByOrderId(userId, orderId, filter, options);

  return res.success(result);
});

const updateOrder = catchAsync(async ({ params: { orderId, orderDetailId }, body }, res) => {
  const orderDetail = await orderDetailService.updateOrderDetailById(orderDetailId, body);

  const amount = await orderDetailService.calculatorAmount(orderId);

  await orderService.updateOrderById(orderId, { amount });

  res.success(orderDetail);
});

const deleteOrder = catchAsync(async ({ params: { orderId } }, res) => {
  await orderDetailService.deleteListOrderDetailById(orderId);

  const amount = await orderDetailService.calculatorAmount(orderId);

  await orderService.updateOrderById(orderId, { amount });

  res.success(true);
});

module.exports = {
  createOrder,
  updateOrder,
  deleteOrder,
  getListOrderByOrderId,
};
