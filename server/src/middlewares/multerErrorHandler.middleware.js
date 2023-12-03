const multer = require("multer");
const CustomError = require("../utils/CustomError.util");

const storage = new multer.memoryStorage();
const limits = {
  fileSize: 2 * 1024 * 1024, // Giới hạn dung lượng tệp tin (1 MB)
};
const fileFilter = (req, file, cb) => {
  // Kiểm tra loại tệp tin cho phép (chỉ chấp nhận PNG, JPEG, JPG)
  if (
    file.mimetype.startsWith("image/png") ||
    file.mimetype.startsWith("image/jpeg") ||
    file.mimetype.startsWith("image/jpg")
  ) {
    cb(null, true); // Chấp nhận tệp tin
  } else {
    cb(new Error("Chỉ cho phép tệp tin đuôi: png, jpg, jpeg"), false); // Từ chối tệp tin
  }
};

const upload = multer({
  storage,
  limits,
  fileFilter,
}).single("avatar");

function multerErrorHandler(req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
      return next(
        new CustomError(`File bạn upload vượt quá dung lượng cho phép`, 400)
      );
    } else if (err) {
      return next(new CustomError(`Có lỗi xảy ra khi upload ảnh`, 400));
    }

    // Everything went fine.
    next();
  });
}

module.exports = multerErrorHandler;
