const httpStatus = require('http-status');
const { isEqual, isEmpty } = require('lodash');
const { ObjectId } = require('mongodb');

const { OrderDetail, Order, Cart } = require('../../models');
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

const integrateCartProduct = (cart, data) => {
  return data.results.map(({ product, ...orders }) => {
    const productCart = cart.find(({ productId }) =>  String(productId) === String(product._id));

    return { product, size: productCart?.size || [] , ...orders._doc };
  });
};

/**
 * Get order detail by Id
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<ListOrderDetail>}
 */
const getListOrdersDetailByOrderId = async (user, orderId, filter, options) => {
  const order = await Order.findOne({ _id: ObjectId(orderId) });
  const cart = await Cart.find({ userId: user });

  if (!isEqual(user, order.user)) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Permission denied');
  }

  const data = await OrderDetail.paginate({ order: orderId, ...filter }, options);

  const result = await integrateCartProduct(cart, data);

  return orderDetailTransfomer.getListOrdersDetailByOrderId({ ...data, results: result }, order);
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
  const order = await OrderDetail.remove({ order: { $in: orderId } });

  return order;
};

/**
 * Calculator amount order by id
 * @param {ObjectId} orderId
 * @returns {Promise<OrderDetail>}
 */
const calculatorAmount = async (order, products) => {
  let result = 0;

  const data = await OrderDetail.find({ order });

  if (isEmpty(data) && !isEmpty(products)) {
    await products.map(({ price, quantity }) => {
      result += price * quantity
    })

    return result;
  }

  await data.map(({ price, quantity }) => {
    result += price * quantity
  });

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
