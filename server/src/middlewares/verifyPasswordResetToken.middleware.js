const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const crypto = require("crypto");
const User = require("../models/user.model");

const verifyPasswordResetToken = asyncFnHandler(async function (
  req,
  res,
  next
) {
  // 1) Lấy password reset token chưa mã hóa thông qua req.params
  const passwordResetToken = req.params.passwordResetToken;

  // 2) mã hóa password reset token ta vừa lấy
  const hashPasswordResetToken = crypto
    .createHash("sha256")
    .update(passwordResetToken)
    .digest("hex");

  // 3) Ta sử dụng password reset token vừa mã hóa đó để tìm user có liên kết
  const foundUserInDB = await User.findOne({
    passwordResetToken: hashPasswordResetToken,
    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  // 4) Nếu không có user nào liên kết thì ta báo lỗi
  if (!foundUserInDB) {
    return next(
      new CustomError(
        "Vượt quá thời gian cho phép thay đổi mật khẩu (5 phút) hoặc đường dẫn đã được sử dụng. Vui lòng thử lại sau",
        401
      )
    );
  }

  if (req.method === "POST") {
    req.currentUser = foundUserInDB;
    next();
  }

  if (req.method === "GET") {
    res.status(200).json({
      status: "success",
      message: "Hợp lệ",
    });
  }
});

module.exports = verifyPasswordResetToken;
