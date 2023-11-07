const { getImageThumbnail } = require('../../utils/app');

const getListOrdersDetailByOrderId = (data, totalPrice) => {
  const { results, ...meta } = data;

  const orderDetail = results.map((i) => {
    const { product, quantity, price, _id } = i.toObject();

    return {
      _id,
      price,
      quantity,
      product: {
        name: product?.name || null,
        _id: product?._id || null,
        thumbnail: getImageThumbnail(product?.images) || null,
      },
    };
  });

  return {
    results: {
      products: orderDetail,
      totalPrice,
      shipingFee: results[0]?.shipingFee || 0,
      discountPercent: results[0]?.discountPercent || 0,
      createdAt: results[0].createdAt,
      updatedAt: results[0].updatedAt,
    },
    ...meta,
  };
};

module.exports = {
  getListOrdersDetailByOrderId,
};
