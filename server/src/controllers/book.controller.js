const Book = require("../models/book.model");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const api = require("./api.controller");

exports.getAllBooks = asyncFnHandler(async (req, res, next) => {
  let query;

  if (req.query) {
    query = api(Book.find(), req.query);
  }

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

exports.getOneBook = asyncFnHandler(async (req, res, next) => {
  let query;

  if (req.params.id) {
    query = Book.findById(req.params.id);
  }

  if (req.params.slug) {
    query = Book.findOne({ slug: req.params.slug });
  }

  query = query.populate({ path: "genres authors" });

  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy sách", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createOneBook = asyncFnHandler(async (req, res, next) => {
  const doc = await Book.create(req.body);

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOneBook = asyncFnHandler(async (req, res, next) => {
  const doc = await Book.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new CustomError("Không tìm thấy sách", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deleteOneBook = asyncFnHandler(async (req, res, next) => {
  const id = req.params.id;
  let query = Book.findByIdAndDelete(id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy thấy sách.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
