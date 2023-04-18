const { getImageThumbnail } = require('../../utils/app');
const baseUrl = process.env.APP_URL;

const getProductList = (data) => {
  const { results, ...meta } = data;
  const products = results.map((i) => {
    const { price, description, _id, name, category, brand, createdAt, updatedAt, deletedAt, images } = i.toObject();
    return {
      price,
      description,
      _id,
      name,
      category: {
        name: category?.name || null,
        _id: category?._id || null,
      },
      brand: {
        name: brand?.name || null,
        _id: brand?._id || null,
      },
      thumbnail: getImageThumbnail(images),
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
  const { price, description, _id, name, category, slug, brand, createdAt, updatedAt, deletedAt, images } = data;
  const imagesArr = images.map(i => ({
    fullUrl: `${baseUrl}/file${i}`,
    path: i
  }));

  return {
    _id,
    price,
    images: imagesArr,
    description,
    name,
    category,
    brand,
    slug,
    deletedAt,
    createdAt,
    updatedAt
  };
};

module.exports = {
  getProduct,
  getProductList,
};
