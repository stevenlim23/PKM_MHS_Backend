const Model = require("../models");
const Expense = Model.Expense;
const Saldo = Model.Saldo;

const fieldAttributes = ["expenseId", "refNumber", "date", "name", "total"];

// Helper
const { errorHandler } = require("../middleware");

// get all expense list
exports.getExpenseList = errorHandler.wrapAsync(async (req, res) => {
  const expenseListData = await Expense.findAll({
    attributes: fieldAttributes,
  });

  if (!expenseListData.length)
    throw new errorHandler.ExpressError(404, "Expense Tidak Ditemukan");

  res.send(expenseListData);
});

// Create New Inventory
exports.createNewExpense = errorHandler.wrapAsync(async (req, res) => {
  const newExpenseData = req.body;
  let newSaldoData = {};

  // Validate request
  if (!Object.keys(newExpenseData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await Expense.create(newExpenseData);

    newSaldoData = {
      ...newSaldoData,
      date: req.body.date,
      value: -req.body.total,
    };

    await Saldo.create(newSaldoData);

    res.send("Expense Berhasil Dibuat");
  }
});
