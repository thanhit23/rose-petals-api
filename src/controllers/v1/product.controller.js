const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productService } = require('../../services/app');

const getProducts = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name', 'category', 'brand']);
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'brand,category';

  const result = await productService.queryProducts(filter, options);
  return res.success(result);
});

const getProduct = catchAsync(async (req, res) => {
  const {
    params: { productId },
  } = req;
  const product = await productService.getProductById(productId);
  if (!product) return res.resourceNotFound();
  return res.success(product);
});

module.exports = {
  getProducts,
  getProduct,
};
