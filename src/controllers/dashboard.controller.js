const Model = require("../models");

// Model
const Sales = Model.Sales;
const SalesDetail = Model.SalesDetail;
const Purchase = Model.Purchase;
const Expense = Model.Expense;
const Supplier = Model.Supplier;
const Inventory = Model.Inventory;

// Model Relationship
Supplier.hasOne(Purchase, { foreignKey: "supplierId", as: "supplierData" });
Purchase.belongsTo(Supplier, { foreignKey: "supplierId", as: "supplierData" });

Inventory.hasOne(SalesDetail, {
  foreignKey: "inventoryId",
  as: "inventoryData",
});
SalesDetail.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventoryData",
});

// Helper
const { errorHandler } = require("../middleware");
const { Op, fn, col, where } = require("sequelize");

// const fieldAttributes = [];

// get Dashboard Data
exports.getDashboardData = errorHandler.wrapAsync(async (req, res) => {
  // Sales Data
  const salesTotalData = await Sales.findAll({
    raw: true,
    attributes: [[fn("SUM", col("totalPayment")), "totalPayment"]],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("transDate")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
  });

  const salesMonthlyData = await Sales.findAll({
    raw: true,
    attributes: [
      [fn("MONTH", col("transDate")), "transMonth"],
      [fn("SUM", col("totalPayment")), "totalPayment"],
    ],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("transDate")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
    group: ["transMonth"],
  });

  let salesFinalData = {};
  Object.assign(salesFinalData, {
    total: salesTotalData[0]["totalPayment"],
    list: salesMonthlyData,
  });

  // Purchase Data
  const purchaseTotalData = await Purchase.findAll({
    raw: true,
    attributes: [[fn("SUM", col("totalPayment")), "totalPayment"]],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("transDate")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
  });

  const purchaseMonthlyData = await Purchase.findAll({
    raw: true,
    attributes: [
      [fn("MONTH", col("transDate")), "transMonth"],
      [fn("SUM", col("totalPayment")), "totalPayment"],
    ],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("transDate")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
    group: ["transMonth"],
  });

  let purchaseFinalData = {};
  Object.assign(purchaseFinalData, {
    total: purchaseTotalData[0]["totalPayment"],
    list: purchaseMonthlyData,
  });

  // Expense Data
  const expenseTotalData = await Expense.findAll({
    raw: true,
    attributes: [[fn("SUM", col("total")), "totalPayment"]],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("date")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
  });

  const expenseMonthlyData = await Expense.findAll({
    raw: true,
    attributes: [
      [fn("MONTH", col("date")), "transMonth"],
      [fn("SUM", col("total")), "totalPayment"],
    ],
    where: {
      [Op.and]: [
        where(fn("YEAR", col("date")), new Date().getFullYear()),
        { storeId: req.storeId },
      ],
    },
    group: ["transMonth"],
  });

  let expenseFinalData = {};
  Object.assign(expenseFinalData, {
    total: expenseTotalData[0]["totalPayment"],
    list: expenseMonthlyData,
  });

  // Assemble Final Dashboard Data
  let finalData = {};
  Object.assign(finalData, {
    yearPeriod: `January - December ${new Date().getFullYear()}`,
    sales: salesFinalData,
    purchase: purchaseFinalData,
    expense: expenseFinalData,
  });

  if (!finalData)
    throw new errorHandler.ExpressError(404, "Dashboard Data Tidak Ditemukan");

  res.send(finalData);
});

// Get Dashboard Table Data
exports.getTableData = errorHandler.wrapAsync(async (req, res) => {
  // Payable Data
  const payableData = await Purchase.findAll({
    attributes: [
      "purchaseId",
      "refNumber",
      "transDate",
      "dueDate",
      "dueNominal",
      "totalPayment",
    ],
    include: [
      {
        as: "supplierData",
        model: Supplier,
        attributes: ["supplierId", "name"],
      },
    ],
    where: {
      status: { [Op.or]: [1, 2] },
      storeId: req.storeId,
    },
    order: [[col("dueDate"), "ASC"]],
  });

  // Receivable Data
  const receivableData = await Sales.findAll({
    attributes: [
      "salesId",
      "refNumber",
      "transDate",
      "dueDate",
      "dueNominal",
      "totalPayment",
    ],
    where: {
      status: { [Op.or]: [1, 2] },
      storeId: req.storeId,
    },
    order: [[col("dueDate"), "ASC"]],
  });

  // Assemble Final Dashboard Data
  let finalData = {};
  Object.assign(finalData, {
    yearPeriod: `January - December ${new Date().getFullYear()}`,
    payable: payableData,
    receivable: receivableData,
  });

  if (!finalData)
    throw new errorHandler.ExpressError(
      404,
      "Dashboard Table Data Tidak Ditemukan"
    );

  res.send(finalData);
});

// Get Inventory Data
exports.getInventoryData = errorHandler.wrapAsync(async (req, res) => {
  // Out Of Stock Inventory Data
  const outOfStockData = await Inventory.findAll({
    attributes: ["name", "quantity"],
    where: {
      storeId: req.storeId,
      isService: 0,
      is_deleted: 0,
      quantity: { [Op.lte]: 10 },
    },
  });

  // Most Popular inventory
  const mostPopularInventory = await SalesDetail.findAll({
    attributes: [[fn("SUM", col("quantityBuy")), "quantityBuy"]],
    include: [
      {
        as: "inventoryData",
        model: Inventory,
        attributes: ["name"],
      },
    ],
    limit: 10,
    order: [[col("quantityBuy"), "DESC"]],
    group: ["inventoryData.name"],
    where: { storeId: req.storeId },
  });

  // Total Inventory
  const totalInventory = await Inventory.findOne({
    raw: true,
    attributes: [[fn("COUNT", col("name")), "totalInventory"]],
    where: { storeId: req.storeId },
  });

  // Total Supplier
  const totalSupplier = await Supplier.findOne({
    raw: true,
    attributes: [[fn("COUNT", col("name")), "totalSupplier"]],
    where: { storeId: req.storeId },
  });

  // Assemble Final Dashboard Data
  let finalData = {};
  Object.assign(finalData, {
    yearPeriod: `January - December ${new Date().getFullYear()}`,
    outOfStock: outOfStockData,
    mostSoldStock: mostPopularInventory,
    totalInventory: totalInventory ? totalInventory["totalInventory"] : 0,
    totalSupplier: totalSupplier ? totalSupplier["totalSupplier"] : 0,
  });

  if (!finalData)
    throw new errorHandler.ExpressError(
      404,
      "Dashboard Inventory Data Tidak Ditemukan"
    );

  res.send(finalData);
});
