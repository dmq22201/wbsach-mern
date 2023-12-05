const app = require("./src/app");
const logger = require("./src/utils/logger.util");

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, function () {
  logger.info(`Server đang chạy cổng: ${PORT}`);
});

// Xử lý lỗi xảy ra bên ngoài ExpressJS
// Lỗi kết nối tói mongodb vì 1 lý do nào đó mongodb sập
// Lỗi này có tên là: Unhandled Promise Rejection
// server.close() would stop the server, but not the app so if you had other code running then it'd still be executed. process.exit() stops the process completely which stops everything.
process.on("unhandledRejection", (reason, promise) => {
  server.close(() => {
    logger.error("Có lỗi Unhandled Rejection: Bắt đầu tắt úng dụng...");
    process.exit(1);
  });
});

// Xử lý gracefully shutdown. Nghĩa là khi bạn cập nhật ứng dụng và úng dụng của bạn sẽ bị shutdown ngay lập tức. Cho dù các req đang được handler. Nhung vói SIGTERM là một tin hiệu giúp ta shutdown server một cách tuần tự và an toàn dữ liệu
// process.exit(0) tắt ứng dụng mà không xảy ra lỗi nào hết
// process.exit(1) tắt ứng dụng ngay lập tức khi gặp lỗi
process.on("SIGINT", () => {
  logger.info("Nhận được tín hiệu: SIGINT. Bắt đầu tắt máy chủ.....");
  server.close(() => {
    logger.info("Tắt máy chủ thành công. Bắt đầu tắt ứng dụng....");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  logger.info("Nhận được tín hiệu: SIGTERM. Bắt đầu tắt máy chủ.....");
  server.close(() => {
    logger.info("Tắt máy chủ thành công. Bắt đầu tắt ứng dụng....");
    process.exit(0);
  });
});
