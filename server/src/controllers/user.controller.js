const User = require("../models/user.model");
const handler = require("./handler.controller");

exports.getAllUsers = handler.getAll(User);
exports.getOneUser = handler.getOne(User);
exports.createOneUser = handler.createOne(User);
exports.updateOneUser = handler.updateOne(User);
exports.deleteOneUser = handler.deleteOne(User);
