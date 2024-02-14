const Genre = require("../models/genre.model");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");
const api = require("./api.controller");

exports.getAllGenres = asyncFnHandler(async (req, res, next) => {
  let query;
  query = api(Genre.find(), req.query);

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

exports.getOneGenre = asyncFnHandler(async (req, res, next) => {
  let query = Genre.findById(req.params.id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy thể loại", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.createOneGenre = asyncFnHandler(async (req, res, next) => {
  const doc = await Genre.create(req.body);

  res.status(201).json({
    status: "success",
    data: doc,
  });
});

exports.updateOneGenre = asyncFnHandler(async (req, res, next) => {
  const doc = await Genre.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(new CustomError("Không tìm thấy thể loại", 404));
  }

  res.status(200).json({
    status: "success",
    data: doc,
  });
});

exports.deleteOneGenre = asyncFnHandler(async (req, res, next) => {
  const id = req.params.id;
  let query = Genre.findByIdAndDelete(id);
  const doc = await query;

  if (!doc) {
    return next(new CustomError("Không tìm thấy thể loại.", 404));
  }

  res.status(204).json({
    status: "success",
  });
});
