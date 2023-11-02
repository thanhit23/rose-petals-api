const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { categoryService } = require('../../services/app');

const createCategory = catchAsync(async ({ body }, res) => {
  const category = await categoryService.createCategory(body);
  return res.createSuccess(category);
});

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

const getCategory = catchAsync(async (req, res) => {
  const {
    params: { categoryId },
  } = req;
  const category = await categoryService.getCategoryById(categoryId);
  if (!category) return res.resourceNotFound();
  return res.success(category);
});

const getCategoryBySlug = catchAsync(async (req, res) => {
  const {
    params: { slug },
  } = req;
  const category = await categoryService.getCategoryBySlug(slug);
  if (!category) return res.resourceNotFound();
  return res.success(category);
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await categoryService.updateCategoryById(req.params.categoryId, req.body);
  res.success(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await categoryService.deleteCategoryById(req.params.categoryId);
  res.success(true);
});

module.exports = {
  createCategory,
  getCategories,
  getAllCategories,
  getCategory,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
};
