const express = require("express");
const orderController = require("../../../controllers/order.controller");
const verifyJWT = require("../../../middlewares/verifyJWT.middleware");
const verifyRole = require("../../../middlewares/verifyRole.middleware");

const router = express.Router();

// POST (CREATE)
router
  .route("/")
  .post(
    verifyJWT,
    verifyRole(["user", "admin"]),
    orderController.createOneOrder
  );

// GET (READ)
router
  .route("/")
  .get(
    verifyJWT,
    verifyRole(["user", "admin"]),
    orderController.getAllOrdersByUserId
  );
router.route("/:id").get(orderController.getOneOrder);

// PATCH (UPDATE)
// router.route("/:id").patch(orderController.updateOneOrder);

// DELETE (DELETE)
router
  .route("/:id")
  .patch(
    verifyJWT,
    verifyRole(["user", "admin"]),
    orderController.deleteOneOrder
  );

module.exports = router;
