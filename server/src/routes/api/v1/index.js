const express = require("express");

const routes = express.Router();

routes.use("/auth", require("./auth.route"));

routes.use("/authors", require("./author.route"));
routes.use("/books", require("./book.route"));
routes.use("/genres", require("./genre.route"));
routes.use("/users", require("./user.route"));
routes.use("/orders", require("./order.route"));

module.exports = routes;
