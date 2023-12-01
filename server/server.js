const app = require("./src/app");
const server = app.listen(process.env.PORT, function () {
  console.log(`Server đang chạy cổng: ${process.env.PORT}`);
});
