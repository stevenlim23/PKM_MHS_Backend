const express = require("express");
const router = express.Router();

// Controller
const expenseController = require("../controllers/expense.controller");

// Helper
const { requestValidator } = require("../middleware/requestValidator");
const { authJwt, verifyStore } = require("../middleware");

// get all Inventory
router.get("/", [authJwt.verifyToken], expenseController.getExpenseList);

// Create New Expense
router.post(
  "/",
  [
    requestValidator.expenseSchema,
    requestValidator.validateRequest,
    authJwt.verifyToken,
  ],
  expenseController.createNewExpense
);

module.exports = router;
