const getOrders = (data) => {
  const { results, ...meta } = data;
  const orders = results.map((i) => {
    const { user, customerNote, address, amount, quantity, status, _id, createdAt, updatedAt } = i.toObject();
    return {
      _id,
      user: {
        name: user?.name || null,
        _id: user?._id || null,
      },
      customerNote,
      address,
      amount,
      quantity,
      status,
      createdAt,
      updatedAt,
    };
  });

  return {
    results: orders,
    ...meta,
  };
};

const getOrder = (data) => {
  const { user, customerNote, address, amount, quantity, status, _id, createdAt, updatedAt } = data;
  return {
    _id,
    user: {
      name: user?.name || null,
      _id: user?._id || null,
    },
    customerNote,
    address,
    amount,
    quantity,
    status,
    createdAt,
    updatedAt,
  };
};

module.exports = {
  getOrders,
  getOrder,
};
