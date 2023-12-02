const { first } = require('lodash');

const pick = require('../../utils/pick');
const catchAsync = require('../../utils/catchAsync');
const { productService } = require('../../services/app');

const checkSearchCriteriaRange = (query, key) => {
  const queryString = query;

  if (query[`${key}_min`] >= 0 && query[`${key}_max`]) {
    queryString[key] = { min: query[`${key}_min`], max: query[`${key}_max`] };
  }

  return queryString;
};

const getProducts = catchAsync(async ({ query }, res) => {
  const queryString = first(['price', 'rating'].map((item) => checkSearchCriteriaRange(query, item)));

  const filter = pick(queryString, ['name', 'category', 'brand', 'price', 'rating']);
  const options = pick(queryString, ['sortBy', 'limit', 'page']);

  filter.searchCriteria = { name: 'like', price: 'range', rating: 'range' };
  options.populate = 'brand,category';

  if (queryString.featured) {
    options.sortBy = 'rating:desc';
  }

  if (queryString.best_selling) {
    options.sortBy = 'sold:desc';
  }

  if (queryString.week_top) {
    options.sortBy = 'updatedAt:desc';
  }

  if (queryString.new_top) {
    options.sortBy = 'createdAt:desc';
  }

  const dataProduct = await productService.queryProducts(filter, options);

  const result = {
    ...dataProduct,
    results: query?.related ? dataProduct.results.filter(({ _id }) => _id != query?.related) : dataProduct.results,
  }

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
