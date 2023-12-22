const express = require("express");

const routes = express.Router();

routes.use("/api/v1", require("./api/v1/"));

module.exports = routes;
