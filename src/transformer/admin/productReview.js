const { getImageThumbnail } = require('../../utils/app');

const getReviews = (data) => {
  const { results, ...meta } = data;
  const reviews = results.map((i) => {
    const { user, product, rating, _id, content, createdAt, updatedAt } = i.toObject();
    return {
      _id,
      user: {
        name: user?.name || null,
        avatar: user?.avatar || null,
        _id: user?._id || null,
      },
      product: {
        name: product?.name || null,
        thumbnail: getImageThumbnail(product?.images) || null,
        _id: product?._id || null,
      },
      rating,
      content,
      createdAt,
      updatedAt,
    };
  });

  return {
    results: reviews,
    ...meta,
  };
};

module.exports = {
  getReviews,
};
