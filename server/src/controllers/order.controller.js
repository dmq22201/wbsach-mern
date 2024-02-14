const Order = require("../models/order.model");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const api = require("./api.controller");

exports.getAllOrdersByUserId = asyncFnHandler(async (req, res, next) => {
  let query;

  query = api(Order.find({ user: req.currentUser._id }), req.query);

  const { totalItems, docs } = await query;
  const limitItemsPerPage = req.query.limit ?? 8;
  const totalPages = Math.ceil(totalItems.length / Number(limitItemsPerPage));

  res.status(200).json({
    status: "success",
    totalPages,
    totalItems: totalItems.length,
    limitItemsPerPage,
    data: docs,
  });
});

exports.getOneOrder = asyncFnHandler(async (req, res, next) => {
  let query;

  if (req.params.id) {
    query = Order.findById(req.params.id);
  }

  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy đơn đặt hàng", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createOneOrder = asyncFnHandler(async (req, res, next) => {
  const doc = await Order.create({
    ...req.body,
    user: req.currentUser.id,
  });

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOneOrder = asyncFnHandler(async (req, res, next) => {
  const doc = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new CustomError("Không tìm thấy đơn đặt hàng", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deleteOneOrder = asyncFnHandler(async (req, res, next) => {
  const id = req.params.id;
  let query = Order.findByIdAndDelete(id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy thấy đơn đặt hàng.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
