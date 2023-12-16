const { omitBy, isNil } = require('lodash');
const catchAsync = require('../../utils/catchAsync');
const { userService } = require('../../services/app');

const updateUser = catchAsync(async ({ user: { _id }, body }, res) => {
  const dataUpdate = omitBy(body, isNil);
  const user = await userService.updateUserById(_id, dataUpdate);
  res.success(user);
});

const uploadAvatar = catchAsync(async ({ user: { _id }, body }, res) => {
  const dataUpdate = omitBy(body, isNil);
  const user = await userService.updateAvatar(_id, dataUpdate);
  res.success(user);
});

const getAnalytics = catchAsync(async ({ user: { _id } }, res) => {
  const user = await userService.getAnalytics(_id);
  res.success(user);
});

module.exports = {
  updateUser,
  uploadAvatar,
  getAnalytics,
};
