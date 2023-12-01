const CustomError = require("../utils/CustomError.util");

const MB = 2;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;

const fileSizeLimiter = (req, res, next) => {
  // Lấy danh sách files từ req.files có được từ user
  const files = req.files;

  // Tạo danh sách chứa các file vượt quá giới hạn cho phép
  const fileOverLimit = [];

  //
  Object.keys(files).forEach((key) => {
    if (files[key].size > FILE_SIZE_LIMIT) {
      fileOverLimit.push(files[key].name);
    }
  });

  if (fileOverLimit.length > 0) {
    return next(
      new CustomError("Tệp bạn gửi vượt quá giới hạn cho phép là 2MB", 413)
    );
  }

  next();
};

module.exports = fileSizeLimiter;
