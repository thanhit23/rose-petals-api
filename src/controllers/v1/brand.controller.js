const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { brandService } = require('../../services/app');

const getBrands = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  const result = await brandService.queryBrands(filter, options);
  return res.success(result);
});

const getAllBrands = catchAsync(async (req, res) => {
  const result = await brandService.getAllBrands();
  return res.success(result);
});

module.exports = {
  getBrands,
  getAllBrands,
};
