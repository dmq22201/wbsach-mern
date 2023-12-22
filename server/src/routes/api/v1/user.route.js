const express = require("express");
const userController = require("../../../controllers/user.controller");

const router = express.Router();

// POST (CREATE)
router.route("/").post(userController.createOneUser);

// GET (READ)
router.route("/").get(userController.getAllUsers);
router.route("/:id").get(userController.getOneUser);

// PATCH (UPDATE)
router.route("/:id").patch(userController.updateOneUser);

// DELETE (DELETE)
router.route("/:id").patch(userController.deleteOneUser);

module.exports = router;
