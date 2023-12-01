const Author = require("../models/author.model");
const handler = require("./handler.controller");

exports.getAllAuthors = handler.getAll(Author);
exports.getOneAuthor = handler.getOne(Author, { path: "books" });
exports.createOneAuthor = handler.createOne(Author);
exports.updateOneAuthor = handler.updateOne(Author);
exports.deleteOneAuthor = handler.deleteOne(Author);
