const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { brandService } = require('../../services/app');

const createBrand = catchAsync(async ({ body }, res) => {
  const brand = await brandService.createBrand(body);
  return res.createSuccess(brand);
});

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

const getBrand = catchAsync(async (req, res) => {
  const {
    params: { brandId },
  } = req;
  const brand = await brandService.getBrandById(brandId);
  if (!brand) return res.resourceNotFound();
  return res.success(brand);
});

const updateBrand = catchAsync(async (req, res) => {
  const brand = await brandService.updateBrandById(req.params.brandId, req.body);
  res.success(brand);
});

const deleteBrand = catchAsync(async (req, res) => {
  await brandService.deleteBrandById(req.params.brandId);
  res.success(true);
});

module.exports = {
  createBrand,
  getBrands,
  getAllBrands,
  getBrand,
  updateBrand,
  deleteBrand,
};
