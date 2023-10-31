const httpStatus = require('http-status');
const { Cart } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { cartTransfomer } = require('../../transformer/v1');

/**
 * Create a cart
 * @param {Object} body
 * @returns {Promise<Cart>}
 */

const createCart = async (body) => {
  const { productId, userId } = body;
  const cart = await Cart.findOne({ productId, userId });

  if (cart) {
    const quantity = cart.quantity + body.quantity;
    const size = cart.size.includes(cart.size) ? {} : cart.size.push(body.size);
    Object.assign(cart, { ...body, quantity, ...size });
    await cart.save();
    return cart;
  }

  return Cart.create(body);
};

/**
 * Get all cart
 */
const getAllCart = async (userId, options) => {
  const data = await Cart.paginate({ userId, deletedAt: null }, options);
  return cartTransfomer.getCarts(data);
};

/**
 * Get cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const getCartById = async (id) => {
  const cart = await Cart.findById(id);
  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  return cart;
};

/**
 * Update cart by id
 * @param {ObjectId} id
 * @returns {Promise<Cart>}
 */
const updateCart = async (userId, id, body) => {
  const cart = await Cart.findOne({ userId, _id: id });

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  Object.assign(cart, { ...body, quantity: +body.quantity + cart.quantity });
  await cart.save();
  return cart;
};

/**
 * Delete cart by id
 * @param {ObjectId} cartId
 * @returns {Promise<Cart>}
 */
const deleteCartById = async (cartId) => {
  const cart = await getCartById(cartId);

  if (!cart) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await cart.remove();
  return cart;
};

module.exports = {
  createCart,
  getAllCart,
  updateCart,
  getCartById,
  deleteCartById,
};
