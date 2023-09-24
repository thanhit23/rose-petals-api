const { omitBy, isNil } = require('lodash');
const catchAsync = require('../../utils/catchAsync');
const { userService } = require('../../services/app');

const updateUser = catchAsync(async ({ user: { _id }, body }, res) => {
  const dataUpdate = omitBy(body, isNil);
  const user = await userService.updateUserById(_id, dataUpdate);
  res.success(user);
});

module.exports = {
  updateUser,
};
