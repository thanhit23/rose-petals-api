const httpStatus = require('http-status');

const { OrderDetail } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { orderDetailTransfomer } = require('../../transformer/admin');

/**
 * Create a order detail
 * @param {Object} body
 * @returns {Promise<OrderDetail>}
 */
const createOrderDetail = async (body) => {
  return OrderDetail.create(body);
};

/**
 * Get order detail by Id
 * @param id
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<ListOrderDetail>}
 */
const getListOrdersDetailByOrderId = async (orderDetailId, filter, options) => {
  const data = await OrderDetail.paginate({ order: orderDetailId, ...filter }, options);
  return orderDetailTransfomer.getListOrdersDetailByOrderId(data);
};

/**
 * Get order detail by Id
 * @param id
 * @returns {Promise<OrderDetail>}
 */
const getOrderDetailById = async (id) => OrderDetail.findById(id);

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<OrderDetail>}
 */
const deleteOrderDetailById = async (orderId) => {
  const orderDetail = await getOrderDetailById(orderId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await orderDetail.remove();
  return orderDetail;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @returns {Promise<OrderDetail>}
 */
const deleteListOrderDetailById = async (orderId) => {
  const data = await OrderDetail.find({ order: orderId });
  let orderDetail;

  data.map(async ({ _id }) => {
    orderDetail = await getOrderDetailById(_id);

    if (!orderDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
    }

    await orderDetail.remove();
  });

  return orderDetail;
};

/**
 * Calculator amount order by id
 * @param {ObjectId} orderId
 * @returns {Promise<OrderDetail>}
 */
const calculatorAmount = async (orderId) => {
  let result = 0;

  const data = await OrderDetail.find({ order: orderId });

  // eslint-disable-next-line no-return-assign
  data.map(({ price, quantity }) => (result += price * quantity));

  return result;
};

/**
 * Delete order by id
 * @param {ObjectId} orderId
 * @param {Object} updateBody
 */
const updateOrderDetailById = async (orderId, updateBody) => {
  const orderDetail = await getOrderDetailById(orderId);
  if (!orderDetail) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  Object.assign(orderDetail, updateBody);
  await orderDetail.save();
  return orderDetail;
};

module.exports = {
  calculatorAmount,
  createOrderDetail,
  getListOrdersDetailByOrderId,
  deleteListOrderDetailById,
  deleteOrderDetailById,
  updateOrderDetailById,
};
