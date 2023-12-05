const mongoose = require("mongoose");
//const logger = require("../utils/logger.util");

const connectString = `${process.env.CONNECT_STRING}`;

module.exports = () =>
  mongoose
    .connect(connectString)
    .then(function () {
      // logger.info("Kết nối mongodb thành công.");
      console.log("Kết nối mongodb thành công.");
    })
    .catch(function (err) {
      // logger.error(`${err}`);
      console.log(err);
    });
