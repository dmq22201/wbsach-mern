const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const crypto = require("crypto");
const User = require("../models/user.model");

const verifyEmailToken = asyncFnHandler(async function (req, res, next) {
  // 1) Lấy Email Token từ params
  const { emailVerifyToken } = req.params;

  // 2) mã hóa email verify token ta vừa lấy
  const hashEmailVerifyToken = crypto
    .createHash("sha256")
    .update(emailVerifyToken)
    .digest("hex");

  // 3) Ta sử dụng email verify token vừa mã hóa đó để tìm user có liên kết
  const foundUserInDB = await User.findOne({
    emailVerifyToken: hashEmailVerifyToken,
    emailVerifyTokenExpires: {
      $gt: Date.now(),
    },
  });

  // 4) Nếu không có user nào liên kết thì ta báo lỗi
  if (!foundUserInDB) {
    return next(
      new CustomError(
        "Vượt quá thời gian cho phép xác minh email (1 tiếng) hoặc đường dẫn đã được sử dụng. Vui lòng thử lại sau",
        401
      )
    );
  }

  req.currentUser = foundUserInDB;
  next();
});

module.exports = verifyEmailToken;
