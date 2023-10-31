const catchAsync = require('../../utils/catchAsync');
const { cartService } = require('../../services/app');

const createCart = catchAsync(async (req, res) => {
  const { body, user } = req;
  const cart = await cartService.createCart({ ...body, userId: user._id });
  return res.createSuccess(cart);
});

const getCarts = catchAsync(async (req, res) => {
  const { user } = req;
  const options = { populate: 'productId' };

  const result = await cartService.getAllCart(user._id, options);
  return res.success(result);
});

const getCart = catchAsync(async (req, res) => {
  const {
    params: { cartId },
  } = req;
  const cart = await cartService.getCartById(cartId);
  if (!cart) return res.resourceNotFound();
  return res.success(cart);
});

const updateCart = catchAsync(async ({ user: { _id }, params: { cartId }, body }, res) => {
  const cart = await cartService.updateCart(_id, cartId, body);
  res.success(cart);
});

const deleteCart = catchAsync(async ({ params: { cartId } }, res) => {
  await cartService.deleteCartById(cartId);
  res.success(true);
});

module.exports = {
  createCart,
  updateCart,
  getCarts,
  getCart,
  deleteCart,
};
