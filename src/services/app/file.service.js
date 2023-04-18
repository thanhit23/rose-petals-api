/**
 * Create a product
 * @param {Object} body
 * @returns {Promise<Product>}
 */
const saveFile = async (req) => {
  const arrImages = req.files.map((item) => `/resources/images/${item.originalname}`);
  return arrImages;
};

module.exports = {
  saveFile,
};
