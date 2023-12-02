const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { orderService } = require('../../services/app');
const { orderDetailService } = require('../../services/admin');

const createOrder = catchAsync(async ({ body }, res) => {
  const orderDetail = await orderDetailService.createOrderDetail(body);

  const { order } = body;

  const amount = await orderDetailService.calculatorAmount(order);

  await orderService.updateOrderById(order, { amount });

  return res.createSuccess(orderDetail);
});

const getListOrderByOrderId = catchAsync(async ({ query, params: { orderDetailId } }, res) => {
  const filter = pick(query, ['order', 'fullName']);

  filter.searchCriteria = {
    fullName: 'like',
  };

  const options = pick(query, ['sortBy', 'limit', 'page']);

  options.populate = 'product';

  const result = await orderDetailService.getListOrdersDetailByOrderId(orderDetailId, filter, options);

  return res.success(result);
});

const updateOrder = catchAsync(async ({ params: { orderId, orderDetailId }, body }, res) => {
  const orderDetail = await orderDetailService.updateOrderDetailById(orderDetailId, body);

  const amount = await orderDetailService.calculatorAmount(orderId);

  await orderService.updateOrderById(orderId, { amount });

  res.success(orderDetail);
});

const deleteOrder = catchAsync(async ({ params: { orderId, orderDetailId } }, res) => {
  await orderDetailService.deleteOrderDetailById(orderDetailId);

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
