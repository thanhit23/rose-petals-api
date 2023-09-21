const getCarts = (data) => {
  const { results, ...meta } = data;
  const products = results.map((i) => {
    const {
      _id,
      productId: { price, images, name, slug, _id: idProduct },
      quantity,
      createdAt,
      updatedAt,
      deletedAt,
    } = i.toObject();
    return {
      _id,
      quantity,
      product: {
        _id: idProduct,
        name,
        slug,
        images: images[0],
        price,
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
