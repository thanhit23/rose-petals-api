const { omitBy, isNil } = require('lodash');

const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { userService, orderService } = require('../../services/app');

const getAnalytics = catchAsync(async ({ user: { _id }, query }, res) => {
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'user';
  const user = await orderService.queryOrders({ userId: _id }, options);
  res.success(user);
});

const updateUser = catchAsync(async ({ user: { _id }, body }, res) => {
  const dataUpdate = omitBy(body, isNil);
  const user = await userService.updateUserById(_id, dataUpdate);
  res.success(user);
});

module.exports = {
  getAnalytics,
  updateUser,
};
