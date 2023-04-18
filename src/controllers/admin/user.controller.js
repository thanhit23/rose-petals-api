const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { userService, orderService } = require('../../services/app');

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.createSuccess(user);
});

const getUsers = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name', 'role']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'brand,category';
  const result = await userService.queryUsers(filter, options);
  res.success(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) return res.resourceNotFound();
  return res.success(user);
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  res.success(user);
});

const deleteUser = catchAsync(async ({ params: { userId } }, res) => {
  await orderService.deleteOrderByUserId(userId);

  await userService.deleteUserById(userId);

  res.success(true);
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
