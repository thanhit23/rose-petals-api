const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { categoryService } = require('../../services/app');

const getCategories = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  const result = await categoryService.queryCategory(filter, options);
  return res.success(result);
});

const getAllCategories = catchAsync(async (req, res) => {
  const result = await categoryService.queryAllCategories();
  return res.success(result);
});

module.exports = {
  getCategories,
  getAllCategories,
};
