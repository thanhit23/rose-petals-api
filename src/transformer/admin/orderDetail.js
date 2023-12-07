const { find } = require('lodash');

const { getImageThumbnail } = require('../../utils/app');

const getListOrdersDetailByOrderId = (data, order) => {
  const { results, ...meta } = data;

  const orderDetail = results.map((i) => {
    const { product, quantity, price, _id, size = [] } = i;

    return {
      _id,
      price,
      quantity,
      product: {
        name: product?.name || null,
        _id: product?._id || null,
        size,
        slug: product?.slug || '',
        thumbnail: getImageThumbnail(product?.images) || null,
      },
    };
  });

  const totalPrice = (order.amount - (order.amount  * (results[0]?.discountPercent / 100))) + results[0]?.shipingFee;

  return {
    results: {
      id: order._id,
      products: orderDetail,
      address: order?.address,
      subtotal: order?.amount,
      customerNote: order?.customerNote,
      methodPayment: order?.methodPayment,
      phoneNumber: order?.phoneNumber,
      fullName: order?.fullName,
      totalPrice,
      status: order?.status,
      customNote: order?.customNote,
      shipingFee: results[0]?.shipingFee || 0,
      discountPercent: results[0]?.discountPercent || 0,
      createdAt: results[0]?.createdAt,
      updatedAt: results[0]?.updatedAt,
    },
    ...meta,
  };
};

module.exports = {
  getListOrdersDetailByOrderId,
};
