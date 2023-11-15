const jwt = require('jsonwebtoken');
const moment = require('moment');
const httpStatus = require('http-status');
const config = require('../../config/config');
const userService = require('./user.service');
const { Token } = require('../../models');
const ApiError = require('../../utils/ApiError');
const { tokenTypes } = require('../../config/tokens');

/**
 * Generate token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId, expires, type, secret = config.jwt.secret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Moment} expires
 * @param {string} type
 * @returns {Promise<Token>}
 */
const saveToken = async (token, expires, code, type, user) => {
  const tokenDoc = await Token.create({
    token,
    expires: expires.toDate(),
    type,
    code,
    blacklisted: false,
    ...user,
  });
  return tokenDoc;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, config.jwt.secret);
  const tokenDoc = await Token.findOne({ token, type, user: payload.sub, blacklisted: false });
  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<Object>}
 */
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
  await saveToken(refreshToken, refreshTokenExpires, 0, tokenTypes.REFRESH, { user: user.id });

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }
  const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
  await saveToken(resetPasswordToken, expires, 0, tokenTypes.RESET_PASSWORD, { user: user.id });
  return { token: resetPasswordToken, user };
};

/**
 * Generate verify email token
 * @param {User} user
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async () => {
  const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
  const verifyEmailToken = generateToken('id_user', expires, tokenTypes.CODE);
  const code = Number(Math.floor(Math.random() * (1000001 - 100000)) + 100000);

  await saveToken(verifyEmailToken, expires, code, tokenTypes.CODE);
  return { verifyEmailToken, code };
};

/**
 * Generate verify email token
 * @param {Number} code
 * @returns {Promise<number>}
 */
const verifyCode = async (token, code) => {
  const codes = await Token.findOne({ token, code });
  return codes;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  verifyCode,
  generateVerifyEmailToken,
};
