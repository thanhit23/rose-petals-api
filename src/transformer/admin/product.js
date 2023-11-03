const { getImageThumbnail } = require('../../utils/app');
const baseUrl = process.env.APP_URL;

const getProductList = (data) => {
  const { results, ...meta } = data;
  const products = results.map((i) => {
    const { price, size, rating = 0, quantity = 0, sold = 0, description, slug, _id, name, category, brand, createdAt, updatedAt, deletedAt, images } = i.toObject();
    return {
      price,
      description,
      _id,
      name,
      quantity,
      rating,
      sold,
      size,
      slug,
      category: {
        name: category?.name || null,
        _id: category?._id || null,
      },
      brand: {
        name: brand?.name || null,
        _id: brand?._id || null,
      },
      thumbnail: getImageThumbnail(images),
      images,
      deletedAt,
      createdAt,
      updatedAt,
    };
  });

  return {
    results: products,
    ...meta,
  };
};

const getProduct = (data) => {
  const { results, ...meta } = data;

  const { price, description, quantity, size, rating, sold, _id, name, category, slug, brand, createdAt, updatedAt, deletedAt, images } = results[0];

  const products = {
    price,
    description,
    _id,
    name,
    quantity,
    rating,
    sold,
    size,
    slug,
    category: {
      name: category?.name || null,
      _id: category?._id || null,
    },
    brand: {
      name: brand?.name || null,
      _id: brand?._id || null,
    },
    thumbnail: getImageThumbnail(images),
    images,
    deletedAt,
    createdAt,
    updatedAt,
  };

  return {
    results: products,
    ...meta,
  };
};

module.exports = {
  getProduct,
  getProductList,
};
