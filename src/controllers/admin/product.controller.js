const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productService } = require('../../services/admin');

const createProduct = catchAsync(async ({ body }, res) => {
  await productService.validateCreateProduct(body);
  const product = await productService.createProduct(body);
  res.createSuccess(product);
});

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

const deleteProduct = catchAsync(async (req, res) => {
  const {
    params: { productId },
  } = req;
  const product = await productService.deleteProductById(productId);
  if (!product) return res.resourceNotFound();
  return res.success(true);
});

const updateProduct = catchAsync(async (req, res) => {
  const {
    params: { productId },
    body,
  } = req;
  const product = await productService.updateProduct(productId, body);
  res.success(product);
});

module.exports = {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  updateProduct,
};
