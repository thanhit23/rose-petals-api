const getOrders = (data) => {
  const { results, ...meta } = data;
  const orders = results.map((i) => {
    const { user, customerNote, methodPayment = '', phoneNumber, fullName, address, amount, quantity, status, _id, createdAt, updatedAt, deleteAt } = i.toObject();
    return {
      _id,
      user: {
        name: user?.name || null,
        avatar: user?.avatar || null,
        _id: user?._id || null,
      },
      phoneNumber,
      fullName,
      customerNote,
      methodPayment,
      address,
      amount,
      quantity,
      status,
      createdAt,
      updatedAt,
      deleteAt,
    };
  });

  return {
    results: orders,
    ...meta,
  };
};

const getOrder = (data) => {
  const { user, customerNote, methodPayment = '', phoneNumber, fullName, address, amount, quantity, status, _id, createdAt, updatedAt } = data;
  return {
    _id,
    user: {
      name: user?.name || null,
      _id: user?._id || null,
    },
    customerNote,
    phoneNumber,
    fullName,
    methodPayment,
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
