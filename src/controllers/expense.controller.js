const Model = require("../models");
const Expense = Model.Expense;
const Saldo = Model.Saldo;

const fieldAttributes = [
  "expenseId",
  "storeId",
  "refNumber",
  "date",
  "name",
  "total",
];

// Helper
const { errorHandler } = require("../middleware");
const { fn, col } = require("sequelize");

// get all expense list
exports.getExpenseList = errorHandler.wrapAsync(async (req, res) => {
  const expenseListData = await Expense.findAll({
    attributes: fieldAttributes,
    where: {
      storeId: req.storeId,
    },
  });

  if (!expenseListData.length)
    throw new errorHandler.ExpressError(404, "Expense Tidak Ditemukan");

  res.send(expenseListData);
});

// Create New Inventory
exports.createNewExpense = errorHandler.wrapAsync(async (req, res) => {
  const newExpenseData = { ...req.body, storeId: req.storeId };
  let newSaldoData = {};

  // Validate request
  if (!Object.keys(newExpenseData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    let refNumber = "";
    const lastProductCode = await Expense.findOne({
      raw: true,
      attributes: [[fn("max", col("refNumber")), "lastCode"]],
      where: {
        storeId: req.storeId,
      },
    });

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }

    if (mm < 10) {
      mm = "0" + mm;
    }

    let todayDateExpense = dd + mm + yyyy;

    if (!lastProductCode["lastCode"]) {
      refNumber = `EXP/${todayDateExpense}/0001`;
    } else {
      let lastNumber = lastProductCode["lastCode"].slice(16);

      let str = "" + (Number(lastNumber) + 1);
      let pad = "0000";
      refIncrementNum = pad.substring(0, pad.length - str.length) + str;

      refNumber = `EXP/${todayDateExpense}/${refIncrementNum}`;
    }

    await Expense.create({ ...newExpenseData, refNumber: refNumber });

    const saldoData = await Saldo.findOne({
      raw: true,
      attributes: [
        "saldoId",
        "storeId",
        [fn("max", col("date")), "latestDate"],
        "value",
      ],
      where: { storeId: req.storeId },
    });

    let latestDate = new Date(saldoData["latestDate"]).toDateString();
    let todayDate = new Date().toDateString();

    if (!saldoData["saldoId"]) {
      newSaldoData = {
        ...newSaldoData,
        storeId: req.storeId,
        date: req.body.date,
        value: req.body.total,
      };

      await Saldo.create(newSaldoData);
    } else if (latestDate === todayDate) {
      newSaldoData = {
        ...newSaldoData,
        value: Number(saldoData["value"]) - req.body.total,
      };

      await Saldo.update(newSaldoData, {
        where: { saldoId: saldoData["saldoId"] },
      });
    } else {
      let latestSaldo = saldoData["value"];
      let latestDateDB = new Date(saldoData["latestDate"]);

      let targetDay = new Date(
        new Date().setDate(new Date().getDate() - 1)
      ).toDateString();
      let nextDay = latestDate;

      while (nextDay != targetDay) {
        nextDay = new Date(
          latestDateDB.setDate(latestDateDB.getDate() + 1)
        ).toDateString();

        newSaldoData = {
          ...newSaldoData,
          storeId: req.storeId,
          date: latestDateDB.toISOString().slice(0, 10),
          value: latestSaldo,
        };

        await Saldo.create(newSaldoData);
      }

      newSaldoData = {
        ...newSaldoData,
        storeId: req.storeId,
        date: new Date().toISOString().slice(0, 10),
        value: Number(latestSaldo) - req.body.total,
      };
      await Saldo.create(newSaldoData);
    }

    res.send("Expense Berhasil Dibuat");
  }
});
