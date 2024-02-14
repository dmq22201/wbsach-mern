const Author = require("../models/author.model");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const api = require("./api.controller");

exports.getAllAuthors = asyncFnHandler(async (req, res, next) => {
  let query;
  query = api(Author.find(), req.query);

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

exports.getOneAuthor = asyncFnHandler(async (req, res, next) => {
  let query = Author.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy tác giả", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createOneAuthor = asyncFnHandler(async (req, res, next) => {
  const doc = await Author.create(req.body);

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOneAuthor = asyncFnHandler(async (req, res, next) => {
  const doc = await Author.findByIdAndUpdate(req.params.id, req.body, {
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

exports.deleteOneAuthor = asyncFnHandler(async (req, res, next) => {
  const id = req.params.id;
  let query = Author.findByIdAndDelete(id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy tác giả.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
