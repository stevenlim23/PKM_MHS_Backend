const express = require("express");
const router = express.Router();

// Controller
const reportController = require("../controllers/report.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const { authJwt } = require("../middleware");

// Get Dashboard Data
router.post(
  "/profit-loss",
  [
    requestValidator.profitLossSchema,
    requestValidator.validateRequest,
    authJwt.verifyToken,
  ],
  reportController.getProfitLossData
);

// Get Dashboard Table Data
// router.get("/table", [authJwt.verifyToken], dashboardController.getTableData);

// Get Dashboard Inventory Data
// router.get(
//   "/inventory",
//   [authJwt.verifyToken],
//   dashboardController.getInventoryData
// );

module.exports = router;
