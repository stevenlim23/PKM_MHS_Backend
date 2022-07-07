const express = require("express");
const router = express.Router();

// Controller
const stockOpnameController = require("../controllers/stockOpname.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const { authJwt, verifyStore, verifyUser } = require("../middleware");

// get Stock Opname List
router.get(
  "/",
  [authJwt.verifyToken],
  stockOpnameController.getStockOpnameList
);

// Get Stock Opname Detail
router.get(
  "/:id",
  [authJwt.verifyToken],
  stockOpnameController.getStockOpnameDetail
);

// Create Stock Opname
router.post(
  "/",
  [
    requestValidator.stockOpnameSchema,
    requestValidator.validateRequest,
    authJwt.verifyToken,
  ],
  stockOpnameController.createNewStockOpname
);

module.exports = router;
