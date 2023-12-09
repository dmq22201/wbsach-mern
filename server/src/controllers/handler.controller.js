const APIFeature = require("../utils/apiFeature.util");
const asyncFnHandler = require("../utils/asynFnHandler.util");
const CustomError = require("../utils/CustomError.util");

// POST (CREATE)
exports.createOne = (Model) =>
  asyncFnHandler(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: doc,
    });
  });

// GET (READ)
exports.getOne = (Model, popOptions) =>
  asyncFnHandler(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new CustomError("Không tìm thấy document thuộc id đó", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

exports.getAll = (Model, popOptions) =>
  asyncFnHandler(async (req, res, next) => {
    // Model.find ở đây ta truyền vào chỉ tạo ra instance của Query constructor
    // Trích: https://thecodebarbarian.com/how-find-works-in-mongoose.html
    const features = new APIFeature(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagination()
      .populate(popOptions);

    // Ta await để execute một chuỗi nối methods của Mongoose Query
    const docs = await features.queryObjFromMongoose;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: docs,
    });
  });

// PATCH (UPDATE)
exports.updateOne = (Model) =>
  asyncFnHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new CustomError("Không tìm thấy document thuộc id đó", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

// DELETE (DELETE)
exports.deleteOne = (Model) =>
  asyncFnHandler(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new CustomError("Không tìm thấy document thuộc id đó", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
