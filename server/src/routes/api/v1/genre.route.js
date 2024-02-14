const express = require("express");
const genreController = require("../../../controllers/genre.controller");

const router = express.Router();

// POST (CREATE)
router.route("/").post(genreController.createOneGenre);

// GET (READ)
router.route("/").get(genreController.getAllGenres);
router.route("/:id").get(genreController.getOneGenre);

// PATCH (UPDATE)
router.route("/:id").patch(genreController.updateOneGenre);

// DELETE (DELETE)
router.route("/:id").patch(genreController.deleteOneGenre);

module.exports = router;
