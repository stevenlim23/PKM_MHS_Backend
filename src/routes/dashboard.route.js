const express = require("express");
const router = express.Router();

// Controller
const dashboardController = require("../controllers/dashboard.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const { authJwt, verifyStore } = require("../middleware");

// Get Dashboard Data
router.get("/", [authJwt.verifyToken], dashboardController.getDashboardData);

// Get Dashboard Table Data
router.get("/table", [authJwt.verifyToken], dashboardController.getTableData);

// Get Dashboard Inventory Data
router.get(
  "/inventory",
  [authJwt.verifyToken],
  dashboardController.getInventoryData
);

module.exports = router;
