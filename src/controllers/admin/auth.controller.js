const catchAsync = require('../../utils/catchAsync');
const { roles } = require('../../config/roles');
const { authService, userService, tokenService } = require('../../services/app');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(Object.assign(req.body, { role: roles.admin }));
  const tokens = await tokenService.generateAuthTokens(user);
  res.createSuccess({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPasswordAndRole(email, password, roles.admin);
  const tokens = await tokenService.generateAuthTokens(user);
  res.success({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.success(true);
});

const changePassword = catchAsync(async ({ user: { _id }, body }, res) => {
  await authService.resetPasswordAdmin(_id, body);
  res.success(true);
});

const me = catchAsync(async (req, res) => {
  res.success(req.user);
});

module.exports = {
  changePassword,
  register,
  login,
  logout,
  me,
};
