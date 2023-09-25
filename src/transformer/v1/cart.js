const getCarts = (data) => {
  const { results, ...meta } = data;
  const products = results.map((i) => {
    const { _id, productId, quantity, createdAt, updatedAt, deletedAt } = i.toObject();
    return {
      _id,
      quantity,
      product: {
        _id: productId?._id || null,
        name: productId?.name || null,
        slug: productId?.slug || null,
        images: productId?.images[0] || null,
        price: productId?.price || null,
      },
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

module.exports = {
  getCarts,
};
