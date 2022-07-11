const Model = require("../models");

const Saldo = Model.Saldo;
const Expense = Model.Expense;

const Sales = Model.Sales;
const Purchase = Model.Purchase;

// Helper
const { errorHandler } = require("../middleware");
const { Op, col, fn } = require("sequelize");

// get Profit Loss Report Data
exports.getProfitLossData = errorHandler.wrapAsync(async (req, res) => {
  // Previous Balance Data
  let previousBalanceDate = new Date(
    new Date(req.body.startDate).setDate(
      new Date(req.body.startDate).getDate() - 1
    )
  );

  const previousBalanceData = await Saldo.findOne({
    raw: true,
    attributes: ["value"],
    where: {
      storeId: req.storeId,
      date: previousBalanceDate,
    },
  });

  // Profit Loss Data
  const profitLossData = await Saldo.findOne({
    raw: true,
    attributes: [[fn("max", col("date")), "latestDate"], "value"],
    where: {
      storeId: req.storeId,
      date: {
        [Op.gte]: req.body.startDate,
        [Op.lte]: req.body.endDate,
      },
    },
  });

  // Income Data
  const incomeTotalData = await Sales.findAll({
    raw: true,
    attributes: [[fn("SUM", col("totalPayment")), "totalIncome"]],
    where: {
      storeId: req.storeId,
      transDate: {
        [Op.gte]: req.body.startDate,
        [Op.lte]: req.body.endDate,
      },
    },
  });

  // const incomeDetailData = await Sales.findAll({
  //   raw: true,
  //   attributes: ["transDate", ["totalPayment", "total"]],
  //   where: {
  //     storeId: req.storeId,
  //     transDate: {
  //       [Op.gte]: req.body.startDate,
  //       [Op.lte]: req.body.endDate,
  //     },
  //   },
  //   group: ["transDate"],
  // });

  let incomeFinalData = {};
  Object.assign(incomeFinalData, {
    total: incomeTotalData[0]["totalIncome"]
      ? Number(incomeTotalData[0]["totalIncome"])
      : 0,
    list: [
      {
        name: "Penjualan Inventori",
        total: incomeTotalData[0]["totalIncome"]
          ? Number(incomeTotalData[0]["totalIncome"])
          : 0,
      },
    ],
  });

  // Expense Data
  const purchaseTotalData = await Purchase.findAll({
    raw: true,
    attributes: [[fn("SUM", col("totalPayment")), "totalPurchase"]],
    where: {
      storeId: req.storeId,
      transDate: {
        [Op.gte]: req.body.startDate,
        [Op.lte]: req.body.endDate,
      },
    },
  });

  const expenseTotalData = await Expense.findAll({
    raw: true,
    attributes: [[fn("SUM", col("total")), "totalExpense"]],
    where: {
      storeId: req.storeId,
      date: {
        [Op.gte]: req.body.startDate,
        [Op.lte]: req.body.endDate,
      },
    },
  });

  const expenseData = await Expense.findAll({
    raw: true,
    attributes: ["name", "total"],
    where: {
      storeId: req.storeId,
      date: {
        [Op.gte]: req.body.startDate,
        [Op.lte]: req.body.endDate,
      },
    },
  });

  let PurchaseFinalNomimal = purchaseTotalData[0]["totalPurchase"]
    ? purchaseTotalData[0]["totalPurchase"]
    : 0;

  let ExpenseFinalNomimal = expenseTotalData[0]["totalExpense"]
    ? expenseTotalData[0]["totalExpense"]
    : 0;

  let expenseFinalData = {};
  Object.assign(expenseFinalData, {
    total: Number(PurchaseFinalNomimal) + Number(ExpenseFinalNomimal),
    list: [
      {
        name: "Pembelian Inventori",
        nominal: Number(PurchaseFinalNomimal),
      },
      {
        name: "Pengeluaran Lainnya",
        nominal: Number(ExpenseFinalNomimal),
      },
    ],
  });

  // Assemble Profit Lost Final Data
  let profitLossFinalData = {};
  Object.assign(profitLossFinalData, {
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    storeId: req.storeId,
    previousBalance: Number(previousBalanceData["value"]),
    profitLoss: Number(profitLossData["value"]),
    income: incomeFinalData,
    expense: expenseFinalData,
  });

  if (!profitLossFinalData)
    throw new errorHandler.ExpressError(
      404,
      "Profit Loss Data Tidak Ditemukan"
    );

  res.send(profitLossFinalData);
});
