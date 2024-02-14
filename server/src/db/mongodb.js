const mongoose = require("mongoose");

const connectString = `${process.env.CONNECT_STRING}`;

module.exports = () =>
  mongoose
    .connect(connectString)
    .then(function () {
      console.log("Kết nối mongodb thành công.");
    })
    .catch(function (err) {
      console.log(err);
    });
