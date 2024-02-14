const CustomError = require("../utils/CustomError.util");

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// * KHU VỰC XỬ LÝ LỖI CỤ THỂ * //
// ! CSDL
function handleCastErrorDB(err) {
  const msg = `Lỗi chuyển đổi kiểu dữ liệu. ${err.path}: ${err.value}.`;
  return new CustomError(msg, 400);
}

function handleDuplicateErrorDB(err) {
  const getValueOfField = Object.keys(err.keyValue);
  const msg = `${getValueOfField} bạn nhập đã tồn tại.`;

  return new CustomError(msg, 409);
}

function handleValidationErrorDB(err) {
  console.log(err);
  const errors = Object.values(err.errors).map((err) => err.message);
  const msg = `Dữ liệu nhập không hợp lệ với yêu cầu của chúng tôi. ${errors.join(
    ""
  )}`;

  return new CustomError(msg, 400);
}

// ! Json Web Token
function handleJWTError(err) {
  return new CustomError("Xác thức thất bại", 401);
}

function handleJWTExpired(err) {
  return new CustomError("Xác thực thất bại", 401);
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
// * Hàm gửi json mô tả lỗi ở development
function sendErrDev(err, res) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

// * Hàm gửi json mô tả lỗi ở production
function sendErrProd(err, res) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi ở phía máy chủ",
    });
  }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * //
module.exports = function (err, req, res, next) {
  // ! Ta khai báo || ở statusCode và status khi có 1 lỗi xảy ra mà ta không nắm được
  // ! Bạn nhìn vào các Routes Handler ta đã xác định trước lỗi là gì và truyền message và statusCode
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  // ! Đối với "Development" ta muốn có thông tin về lỗi NHIỀU NHẤT CÓ THỂ
  // ! Đối với "Production" ta muốn ẩn đi thông tin về lỗi NHIỀU NHẤT CÓ THỂ và Response một dòng tin nhắn friendly với user
  if (process.env.NODE_ENV === "development") {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    // Copy object Error (Chú ý vài thuộc tính KHÔNG ĐẾM ĐƯỢC)
    let handleSpecificErr = Object.create(err);

    // Lỗi liên quan tới CSDL
    if (err.name === "CastError") handleSpecificErr = handleCastErrorDB(err);
    if (err.code === 11000) handleSpecificErr = handleDuplicateErrorDB(err);
    if (err.name === "ValidationError")
      handleSpecificErr = handleValidationErrorDB(err);

    // Lỗi liên quan tới Json Web Token
    if (err.name === "JsonWebTokenError")
      handleSpecificErr = handleJWTError(err);
    if (err.name === "TokenExpiredError")
      handleSpecificErr = handleJWTExpired(err);

    sendErrProd(handleSpecificErr, res);
  }
};
