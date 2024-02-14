const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  order: Object,
  information: Object,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
