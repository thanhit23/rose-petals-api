const getImageThumbnail = (images) => {
  const baseUrl = process.env.APP_URL;
  if (!images) {
    return '';
  }

  if (Array.isArray(images) && images[0]) {
    return `${baseUrl}/file${images[0]}`;
  }

  return `${baseUrl}/file${images}`;
};

module.exports = {
  getImageThumbnail,
};
