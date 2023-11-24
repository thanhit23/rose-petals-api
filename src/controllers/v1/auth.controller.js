const httpStatus = require('http-status');

const catchAsync = require('../../utils/catchAsync');
const { roles } = require('../../config/roles');
const { User } = require('../../models');
const { authService, userService, tokenService, emailService } = require('../../services/app');
const ApiError = require('../../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.createSuccess({ user, tokens });
});

const me = catchAsync(async (req, res) => {
  res.success(req.user);
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPasswordAndRole(email, password, roles.user);
  const tokens = await tokenService.generateAuthTokens(user);
  res.success({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.noContent();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.success({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  const email = await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.success(email);
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.success({});
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const email = await User.findOne({ email: req.body.email });
  if (email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already exists');
  }
  const verifyEmailToken = await tokenService.generateVerifyEmailToken();

  await emailService.sendVerificationEmail(req.body.email, verifyEmailToken);
  res.success(verifyEmailToken);
});

const sendVerificationCode = catchAsync(async ({ body: { token, code } }, res) => {
  const verifyCode = await tokenService.verifyCode(token, code);
  if (!verifyCode) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invalid code');
  }
  res.success({ verifyCode });
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.noContent();
});

module.exports = {
  me,
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  sendVerificationCode,
};
