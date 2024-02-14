const express = require("express");
const bookController = require("../../../controllers/book.controller");

const router = express.Router();

// POST (CREATE)
router.route("/").post(bookController.createOneBook);

// GET (READ)
router.route("/").get(bookController.getAllBooks);
router.route("/:slug?/:id?").get(bookController.getOneBook);

// PATCH (UPDATE)
router.route("/:id").patch(bookController.updateOneBook);

// DELETE (DELETE)
router.route("/:id").patch(bookController.deleteOneBook);

module.exports = router;
