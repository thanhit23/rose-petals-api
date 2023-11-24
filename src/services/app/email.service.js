const nodemailer = require('nodemailer');
const config = require('../../config/config');
const logger = require('../../config/logger');

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {object} options
 * @returns {Promise}
 */
const sendEmail = async (to, subject, options) => {
  const msg = { from: config.email.from, to, subject, ...options };
  await transport.sendMail(msg);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `https://rose-petals.vercel.app/auth/reset-password?token=${token.token}`;

  const html = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        p {
          margin: 0;
        }
        a {
          text-decoration: none;
        }
        .container {
          height: 100vh;
          font-family: 'system-ui';
        }
        .wrapper {
          border: 1px solid #e8e8e8;
          border-radius: 10px;
        }
        .wrapper-header {
          padding: 20px;
          border-bottom: 1px solid #e8e8e8;
        }
        .wrapper-header > img{
          scale: 1.2;
          width: 105px;
          height: 70px;
          display: inline;
          object-fit: cover;
        }
        .name-website {
          display: inline;
          margin-top: 18px;
          font-size: 50px;
          font-weight: 700;
          font-family: sans-serif;
        }
        .title {
          height: 100px;
          background-color: #4084f4;
          position: relative;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
        }
        .title h2 {
          margin: 0;
          position: absolute;
          bottom: 20px;
          font-size: 25px;
          left: 20px;
          color: white;
        }
        .content {
          padding: 20px;
        }
        .text-red {
          color: #e32727
        }
        .text-13 {
          font-size: 13px;
        }
        .wrapper-code {
          padding: 10px;
          margin: 20px 0;
          text-align: center;
        }
        .btn-reset-password {
          padding: 10px 20px;
          background-color: #22BC66;
          color: #fff;
          border-radius: 8px;
        }
        .code {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }
        .notfi {
          margin: 10px 0;
          line-height: 1.4;
        }
        .footer {
          padding: 20px;
          color: white;
          background-color: #333;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
        }
        .text-white {
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wrapper">
          <div class="wrapper-header">
            <img src="https://rose-petals.vercel.app/static/media/logo.524255663532c9a4ccb7.png" style="display: inline;" />
            <div class="name-website">
              <span>ROSE PETAL</span>
            </div>
          </div>
          <div class="content">
            <div class="notfi">
              <p class="text-13">
                Hi ${token.user.name},
              </p>
              </br>
              <p class="text-13">
                You recently requested to reset your password for your Rose-Petals account. Use the button below to reset it. This password reset is only valid for the next 24 hours.
              </p>
            </div>
            <div class="wrapper-code">
              <a href="${resetPasswordUrl}" target="_blank">
                <span class="btn-reset-password">Reset your password</span>
              </a>
            </div>
            <div class="notfi">
              <p class="text-13">If you did not request a password reset, please ignore this email or contact support if you have questions.</p>
              </br>
              <div>
                <span class="text-13">Thanks,</span>
                <div class="text-13">The Rose Petal Team.</div>
              </div>
            </div>
          </div>
          <div class="footer text-13">
            <div style="margin-bottom: 15px;">
              <p class="text-white" style="margin-bottom: 10px;">Contact:</p>
              <div style="margin-left: 20px;">
                <p class="text-white" style="margin-bottom: 5px;">Email: duythanhit3002@gmail.com</p>
                <p class="text-white">Tel: 09-6906-7361</p>
              </div>
            </div>

            <p class="text-white">Copyright © 2023 Rose Petals Inc. All rights reserved</p>
          </div>
        </div>
      </div>
    </body>
  </html>
`;
  await sendEmail(to, subject, { html });
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        p {
          margin: 0;
        }
        .container {
          height: 100vh;
          font-family: 'system-ui';
        }
        .wrapper {
          border: 1px solid #e8e8e8;
          border-radius: 10px;
        }
        .wrapper-header {
          padding: 20px;
          border-bottom: 1px solid #e8e8e8;
        }
        .wrapper-header > img{
          scale: 1.2;
          width: 105px;
          height: 70px;
          display: inline;
          object-fit: cover;
        }
        .name-website {
          display: inline;
          margin-top: 18px;
          font-size: 50px;
          font-weight: 700;
          font-family: sans-serif;
        }
        .title {
          height: 100px;
          background-color: #4084f4;
          position: relative;
          border-top-right-radius: 10px;
          border-top-left-radius: 10px;
        }
        .title h2 {
          margin: 0;
          position: absolute;
          bottom: 20px;
          font-size: 25px;
          left: 20px;
          color: white;
        }
        .content {
          padding: 20px;
        }
        .text-red {
          color: #e32727
        }
        .text-13 {
          font-size: 13px;
        }
        .wrapper-code {
          padding: 10px;
          margin: 20px 0;
          text-align: center;
        }
        .wrapper-code > span {
          padding: 20px 40px;
          border-radius: 22px;
          background: rgb(240, 248, 255);
        }
        .code {
          text-align: center;
          font-size: 24px;
          font-weight: bold;
        }
        .notfi {
          margin: 10px 0;
          line-height: 1.4;
        }
        .footer {
          padding: 20px;
          color: white;
          background-color: #333;
          border-bottom-right-radius: 10px;
          border-bottom-left-radius: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="wrapper">
          <div class="wrapper-header">
            <img src="https://rose-petals.vercel.app/static/media/logo.524255663532c9a4ccb7.png" style="display: inline;" />
            <div class="name-website">
              <span>ROSE PETAL</span>
            </div>
          </div>
          <div class="content">
            <p class="text-13 text-red">Please check the authentication number.</p>
            <div class="notfi">
              <p class="text-13">
                Hello. We will send you the required authentication number to verify your identity.
              </p>
              <p class="text-13">
                Please enter the 6-digit verification number below.
              </p>
            </div>
            <div class="wrapper-code">
              <span class="code">${token.code}</span>
            </div>
          </div>
          <div class="footer text-13">
            <div style="margin-bottom: 15px;">
              <p style="margin-bottom: 10px;">Contact:</p>
              <div style="margin-left: 20px;">
                <p style="margin-bottom: 5px;">Email: duythanhit3002@gmail.com</p>
                <p>Tel: 09-6906-7361</p>
              </div>
            </div>

            <p>Copyright © 2023 Rose Petals Inc. All rights reserved</p>
          </div>
        </div>
      </div>
    </body>
  </html>`;

  await sendEmail(to, subject, { html });
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
};
