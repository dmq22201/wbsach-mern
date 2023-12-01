class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? "fail" : "error";

    this.isOperational = true;

    // do class CustomError không có tính năng stack trace. Ta cần thêm vào từ class Error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = CustomError;
