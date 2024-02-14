const User = require("../models/user.model");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const api = require("./api.controller");

exports.getAllUsers = asyncFnHandler(async (req, res, next) => {
  let query;
  query = api(User.find(), req.query);

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

exports.getOneUser = asyncFnHandler(async (req, res, next) => {
  let query = User.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy tác giả", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createOneUser = asyncFnHandler(async (req, res, next) => {
  const doc = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOneUser = asyncFnHandler(async (req, res, next) => {
  const doc = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new CustomError("Không tìm thấy tác giả", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deleteOneUser = asyncFnHandler(async (req, res, next) => {
  const id = req.params.id;
  let query = User.findByIdAndDelete(id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy tác giả.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
