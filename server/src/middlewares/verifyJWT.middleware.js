const jwt = require("jsonwebtoken");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const User = require("../models/user.model");

/*
    * LUỒNG THỰC THI:
      1. Lấy và kiểm tra access token ở headers trong req object
      2. SỬ dụng JWT verify access token đó
      3. Tạo 1 property cho req object. Và object này sẽ được sử dụng trong các route handler khác
*/

const verifyJWT = asyncFnHandler(async function (req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return next(new CustomError("Xác thực thất bại", 401));
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async function (err, decoded) {
      if (err) {
        return next(new CustomError("Forbidden", 403));
      }

      const foundUserInDB = await User.findById(decoded.userId);

      if (!foundUserInDB) {
        return next(new CustomError("Xác thực thất bại", 401));
      }

      req.currentUser = foundUserInDB;
      next();
    }
  );
});

module.exports = verifyJWT;
