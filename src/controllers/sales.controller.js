const Model = require("../models");
const Sales = Model.Sales;
const SalesDetail = Model.SalesDetail;
const SalesPayment = Model.SalesPayment;
// const Supplier = Model.Supplier;
const Store = Model.Store;
const Inventory = Model.Inventory;
const PaymentMethod = Model.PaymentMethod;
const Saldo = Model.Saldo;

Sales.hasMany(SalesDetail, { foreignKey: "salesId" });
SalesDetail.belongsTo(Sales, { foreignKey: "salesId" });

SalesPayment.hasOne(Sales, { foreignKey: "salesId" });
Sales.belongsTo(SalesPayment, { foreignKey: "salesId" });

Store.hasOne(Sales, { foreignKey: "storeId" });
Sales.belongsTo(Store, { foreignKey: "storeId" });

Inventory.hasOne(SalesDetail, { foreignKey: "inventoryId" });
SalesDetail.belongsTo(Inventory, { foreignKey: "inventoryId" });

PaymentMethod.hasOne(SalesPayment, { foreignKey: "methodId" });
SalesPayment.belongsTo(PaymentMethod, { foreignKey: "methodId" });

const listAttributes = [
  "salesId",
  "refNumber",
  "transDate",
  "dueDate",
  "status",
  "dueNominal",
  "totalPayment",
];

const detailAttributes = [
  "salesId",
  "refNumber",
  "transDate",
  "dueDate",
  "status",
  "dueNominal",
  "totalPayment",
];

const salesDetailAttributes = [
  "salesPaymentId",
  "salesId",
  "date",
  "nominal",
  "code",
];

// Helper
const { errorHandler } = require("../middleware");
const { fn, col } = require("sequelize");

// get all Purchase list
exports.getSalesList = errorHandler.wrapAsync(async (req, res) => {
  const salesListData = await Sales.findAll({
    attributes: listAttributes,
    where: {
      storeId: req.storeId,
    },
  });

  if (!salesListData.length)
    throw new errorHandler.ExpressError(404, "Sales Tidak Ditemukan");

  res.send(salesListData);
});

// get Sales Detail
exports.getSalesDetail = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const salesDetailData = await Sales.findOne({
    attributes: detailAttributes,
    include: [
      {
        model: Store,
        attributes: ["storeId", "name"],
      },
      {
        model: SalesDetail,
        attributes: [
          "salesDetailId",
          "salesId",
          "inventoryId",
          "quantityBuy",
          "pricePerUnit",
          "discount",
        ],
        include: [{ model: Inventory, attributes: ["inventoryId", "name"] }],
      },
    ],
    where: {
      salesId: id,
    },
  });

  if (!salesDetailData)
    throw new errorHandler.ExpressError(404, "Sales Tidak Ditemukan");

  res.send(salesDetailData);
});

// get purchase Detail
exports.getPaymentDetail = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const salesPaymentDetail = await SalesPayment.findAll({
    attributes: salesDetailAttributes,
    include: [
      {
        model: PaymentMethod,
        attributes: ["methodId", "name"],
      },
    ],
    where: {
      salesId: id,
    },
  });

  if (!salesPaymentDetail.length)
    throw new errorHandler.ExpressError(404, "Sales Payment Tidak Ditemukan");

  res.send(salesPaymentDetail);
});

exports.createNewSales = errorHandler.wrapAsync(async (req, res) => {
  var lastSalesId = null;

  const newSalesData = { ...req.body, status: "1" };
  const newSalesDetailData = req.body.itemDetail;

  if (!Object.keys(newSalesData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await Sales.create(newSalesData).then((result) => {
      lastSalesId = result.salesId;
    });

    for (let i = 0; i < newSalesDetailData.length; i++) {
      const newDetailData = {
        ...newSalesDetailData[i],
        salesId: lastSalesId,
        storeId: req.storeId,
        quantityBuy: newSalesDetailData[i]["quantity"],
      };

      const newInventoryData = {
        quantity: newSalesDetailData[i]["quantity"],
      };

      SalesDetail.create(newDetailData);

      Inventory.decrement(newInventoryData, {
        where: { inventoryId: newSalesDetailData[i]["inventoryId"] },
      });
    }

    res.send("Sales Berhasil Dibuat !");
  }
});

// Create New Purchase Payment
exports.createNewSalesPayment = errorHandler.wrapAsync(async (req, res) => {
  const newPaymentData = { ...req.body, storeId: req.storeId };
  let newSaldoData = {};

  if (!Object.keys(newPaymentData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await SalesPayment.create(newPaymentData);

    const updatedNominalSales = {
      dueNominal: req.body.nominal,
    };

    await Sales.decrement(updatedNominalSales, {
      where: { salesId: req.body.salesId },
    });

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
        value: req.body.nominal,
      };

      await Saldo.create(newSaldoData);
    } else if (latestDate === todayDate) {
      newSaldoData = {
        ...newSaldoData,
        value: saldoData["value"] + req.body.nominal,
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
        value: latestSaldo + req.body.nominal,
      };

      await Saldo.create(newSaldoData);
    }

    res.send("Sales Payment Berhasil Diinput !");
  }
});
