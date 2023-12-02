const catchAsync = require('../../utils/catchAsync');
const { analyticService } = require('../../services/admin');

const getAnalytics = catchAsync(async (_, res) => {
  const result = await analyticService.getAnalytics();
  return res.success(result);
});

module.exports = {
  getAnalytics,
};
