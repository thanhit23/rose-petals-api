const bcrypt = require('bcryptjs');
const httpStatus = require('http-status');
const { User, Order } = require('../../models');
const ApiError = require('../../utils/ApiError');

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (userBody) => {
  if (await User.isEmailTaken(userBody.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async (filter, options) => {
  return await User.paginate(filter, options);
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
 */
const getUserById = async (id) => {
  return User.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<User>}
 */
const getUserByEmail = async (email) => {
  return User.findOne({ email });
};

/**
 * Get user by email
 * @param {string} email
 * @param {string} role
 * @returns {Promise<User>}
 */
const getUserByEmailAndRole = async (email, role) => {
  return User.findOne({ email, role });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async (userId, updateBody, resetPassword = false) => {
  const user = await getUserById(userId);
  const { password = '' } = user;

  if (resetPassword) {
    const mismatch = bcrypt.compareSync(updateBody.currentPassword, password);

    if (!mismatch) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Password mismatch');
    }
  }

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }

  const emailtoken = await User.isEmailTaken(updateBody.email, userId);

  if (updateBody.email && emailtoken) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  const body = updateBody.newPassword ? { ...updateBody, password: updateBody.newPassword } : updateBody;

  Object.assign(user, body);
  await user.save();
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const forgotPassword = async (userId, password) => {
  const user = await getUserById(userId);
  Object.assign(user, password);
  await user.save();
  return user;
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateAvatar = async (userId, updateBody) => {
  const user = await getUserById(userId);

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const getAnalytics = async (user) => {
  const totalOrder = await Order.find({ user });
  const awaitingShipment = await Order.find({ user, status: 1 });
  const awaitingDelivery = await Order.find({ user, status: 2 });
  const awaitingPayments = await Order.find({ user, status: 3 });

  return {
    totalOrder: totalOrder.length || 0,
    awaitingShipment: awaitingShipment.length || 0,
    awaitingDelivery: awaitingDelivery.length || 0,
    awaitingPayments: awaitingPayments.length || 0,
  };
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Resource not found');
  }
  await user.remove();
  return user;
};

module.exports = {
  createUser,
  forgotPassword,
  getUserByEmailAndRole,
  getAnalytics,
  updateAvatar,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById,
};
