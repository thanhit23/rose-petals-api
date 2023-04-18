const baseUrl = process.env.APP_URL;

const getBrandsList = (data) => {
  const { results, ...meta } = data;
  const products = results.map((i) => {
    const { _id, name, logo, createdAt, updatedAt, slug } = i.toObject();
    return {
      _id,
      name,
      logo: `${baseUrl}/file${logo}`,
      slug,
      createdAt,
      updatedAt,
    };
  });

  return {
    results: products,
    ...meta,
  };
};

const getBrand = (data) => {
  const { _id, name, logo, createdAt, updatedAt, slug } = data;

  return {
    _id,
    name,
    logo: `${baseUrl}/file${logo}`,
    slug,
    createdAt,
    updatedAt,
  };
};

module.exports = {
  getBrandsList,
  getBrand,
};
