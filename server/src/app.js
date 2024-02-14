require("dotenv").config();
const express = require("express");

const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");

const CustomError = require("./utils/CustomError.util");
const globalErrorHandler = require("./middlewares/globalErrorHandler.middleware.js");
const mongodb_connect = require("./db/mongodb.js");
const corsOptions = require("./configs/corsOptions.config.js");

// Khởi tạo Application
const app = express();
// app.enable("trust proxy");

// Lắng nghe sự kiện uncaughtException. Nghĩa là các lỗi xảy ra như là đọc biến không tồn tại chẳng hạn
process.on("uncaughtException", (err) => {
  console.log("Có lỗi Uncaught Exception: Bắt đầu tắt úng dụng...");
  process.exit(1);
});

// Khởi tạo Middleware (Thứ tự rất quan trọng)
// Helmet
app.use(helmet());

// CORS
app.use(cors(corsOptions));

// Dev Logs
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Static files
app.use(express.static(path.join(__dirname, "../public")));

// Body parser, đọc dữ liệu từ body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Làm sạch dữ liệu mongo
app.use(mongoSanitize());

// Nén response
app.use(compression());

// Kết nối Database
mongodb_connect();

// Routes
app.get("/", (req, res) => {
  // Trả về file 'index.html' từ thư mục 'public'
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

app.use(require("./routes/"));

app.all("*", (req, res, next) => {
  next(new CustomError(`Không tìm thấy ${req.originalUrl} trên máy chủ!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
