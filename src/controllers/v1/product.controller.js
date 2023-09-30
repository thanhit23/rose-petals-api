const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productService } = require('../../services/app');

const getProducts = catchAsync(async ({ query }, res) => {
  const filter = pick(query, ['name', 'category', 'brand']);
  // eslint-disable-next-line no-console
  console.log(query, 'query');
  filter.searchCriteria = {
    name: 'like',
  };
  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'brand,category';

  if (query.featured) {
    options.sortBy = 'rating:desc';
  }

  if (query.week_top) {
    options.sortBy = 'updatedAt:desc';
  }

  if (query.new_top) {
    options.sortBy = 'createdAt:desc';
  }

  const result = await productService.queryProducts(filter, options);
  return res.success(result);
});

const getProduct = catchAsync(async (req, res) => {
  const {
    params: { productId },
    query,
  } = req;

  const options = pick(query, ['sortBy', 'limit', 'page']);
  options.populate = 'brand,category';

  const product = await productService.getProductById({ _id: productId }, options);
  if (!product) return res.resourceNotFound();
  return res.success(product);
});

module.exports = {
  getProducts,
  getProduct,
};
