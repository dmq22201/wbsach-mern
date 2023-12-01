const Book = require("../models/book.model");
const handler = require("./handler.controller");

exports.getAllBooks = handler.getAll(Book);
exports.getOneBook = handler.getOne(Book, { path: "genres authors" });
exports.createOneBook = handler.createOne(Book);
exports.updateOneBook = handler.updateOne(Book);
exports.deleteOneBook = handler.deleteOne(Book);
