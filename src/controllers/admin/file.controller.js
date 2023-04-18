const catchAsync = require('../../utils/catchAsync');
const { fileService } = require('../../services/app');

const saveFile = catchAsync(async (req, res) => {
  const arrImages = await fileService.saveFile(req);
  return res.success(arrImages);
});

module.exports = {
  saveFile,
};
