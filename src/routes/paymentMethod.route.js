const express = require("express");
const router = express.Router();

// Controller
const paymentMethodController = require("../controllers/paymentMethod.controller");

// Helper
const { authJwt } = require("../middleware");

// get all Inventory
router.get(
  "/",
  [authJwt.verifyToken],
  paymentMethodController.getPaymentMethodList
);

module.exports = router;
