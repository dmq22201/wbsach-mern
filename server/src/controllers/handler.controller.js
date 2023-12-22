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
    // const features = new APIFeature(Model.find(), req.query)
    //   .filter()
    //   .sort()
    //   .limitFields()
    //   .pagination()
    //   .populate(popOptions);

    let query;
    let totalItems;
    if (req.query) {
      // Filter
      const queryObj = { ...req.query };
      const excludedFields = ["page", "sortby", "limit", "fields", "search"];
      excludedFields.forEach((field) => delete queryObj[field]);

      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );

      if (req.query.search) {
        query = Model.find({
          ...JSON.parse(queryStr),
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        });
        totalItems = await Model.find({
          ...JSON.parse(queryStr),
          name: {
            $regex: req.query.search,
            $options: "i",
          },
        });
      } else {
        query = Model.find(JSON.parse(queryStr));
        totalItems = await Model.find(JSON.parse(queryStr));
      }

      // Sortby
      if (req.query.sortby) {
        const sortby = req.query.sortby.split(",").join("");
        query = query.sort(sortby); // chaining methods
      } else {
        query = query.sort("-createdAt"); // sắp xếp giảm dần
      }

      // Pagination
      if (req.query.page && req.query.limit) {
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 100;
        const skip = (page - 1) * limit;

        query = query.skip(skip).limit(limit);
      }
    }

    const docs = await query;
    const totalPages = Math.ceil(totalItems.length / Number(req.query.limit));

    res.status(200).json({
      status: "success",
      totalPages,
      totalItems: totalItems.length,
      totalItemsOnPage: docs.length,
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
