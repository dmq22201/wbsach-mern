const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const User = require("../models/user.model");

const checkVerifyEmail = asyncFnHandler(async function (req, res, next) {
  const { username } = req.body;

  const foundUserInDB = await User.findOne({ username });

  if (!foundUserInDB) {
    return next(new CustomError("Tài khoản không tồn tại"));
  }

  if (!foundUserInDB.isVerified) {
    return next(new CustomError("Tài khoản chưa xác thực email"));
  }

  next();
});

module.exports = checkVerifyEmail;
