const Genre = require("../models/genre.model");
const handler = require("./handler.controller");

exports.getAllGenres = handler.getAll(Genre, { path: "books" });
exports.getOneGenre = handler.getOne(Genre, { path: "books" });
exports.createOneGenre = handler.createOne(Genre);
exports.updateOneGenre = handler.updateOne(Genre);
exports.deleteOneGenre = handler.deleteOne(Genre);
