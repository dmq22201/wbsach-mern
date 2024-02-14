const express = require("express");
const authorController = require("../../../controllers/author.controller");

const router = express.Router();

// POST (CREATE)
router.route("/").post(authorController.createOneAuthor);

// GET (READ)
router.route("/").get(authorController.getAllAuthors);
router.route("/:id").get(authorController.getOneAuthor);

// PATCH (UPDATE)
router.route("/:id").patch(authorController.updateOneAuthor);

// DELETE (DELETE)
router.route("/:id").patch(authorController.deleteOneAuthor);

module.exports = router;
