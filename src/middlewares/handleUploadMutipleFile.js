const path = require('path');
const multer = require('multer');

const mutipleFile = () => {
  const storage = multer.diskStorage({
    destination: (res, file, callback) => {
      callback(null, path.join(__dirname, '../uploads/'));
    },
    filename: (res, file, callback) => {
      callback(null, file.originalname);
    },
  });
  const upload = multer({ storage });
  return upload.array('file');
};

module.exports = {
  mutipleFile,
};
