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
const conn = require("./db/conn.js");
const bookRouter = require("./routes/book.route");
const userRouter = require("./routes/user.route");
const genreRouter = require("./routes/genre.route");
const authorRouter = require("./routes/author.route");

// Khởi tạo Application
const app = express();

// Khởi tạo Middleware (Thứ tự rất quan trọng)

// CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Dev Logs
if (process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
}

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Helmet
app.use(helmet());

// Body parser, đọc dữ liệu từ body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Làm sạch dữ liệu mongo
app.use(mongoSanitize());

// Nén response
app.use(compression());

// Kết nối Database
conn();

// Routes
app.get("/", (req, res) => {
  // Trả về file 'index.html' từ thư mục 'public'
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/genres", genreRouter);
app.use("/api/v1/authors", authorRouter);

app.all("*", (req, res, next) => {
  next(new CustomError(`Không tìm thấy ${req.originalUrl} trên máy chủ!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
