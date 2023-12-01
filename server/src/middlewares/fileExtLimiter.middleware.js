const path = require("path");
const CustomError = require("../utils/CustomError.util");

const fileExtLimiter = (allowedExtArr) => {
  return (req, res, next) => {
    const files = req.files;

    if (!files) {
      return next(new CustomError("Vui lòng chọn file", 400));
    }

    // Tạo danh sách chứa đuôi các files
    const fileExtensions = [];

    // Push đuôi vào danh sách vừa tạo
    Object.keys(files).forEach((key) => {
      fileExtensions.push(path.extname(files[key].name));
    });

    // Tính toán cho phép hay không?
    const allowed = fileExtensions.every((ext) => allowedExtArr.includes(ext));

    if (!allowed) {
      const message = `Upload thất bại. Do file của bạn có đuôi không hợp lệ. Chỉ cho phép ${allowedExtArr.toString()}`;

      return next(new CustomError(message, 422));
    }

    next();
  };
};

module.exports = fileExtLimiter;
