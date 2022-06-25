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

// get all Purchase list
exports.getSalesList = errorHandler.wrapAsync(async (req, res) => {
  const salesListData = await Sales.findAll({
    attributes: listAttributes,
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
    where: {
      salesId: id,
    },
    attributes: salesDetailAttributes,
    include: [
      {
        model: PaymentMethod,
        attributes: ["methodId", "name"],
      },
    ],
  });

  if (!salesPaymentDetail.length)
    throw new errorHandler.ExpressError(404, "Sales Payment Tidak Ditemukan");

  res.send(salesPaymentDetail);
});

exports.createNewSales = errorHandler.wrapAsync(async (req, res) => {
  var lastSalesId = null;

  const newSalesData = req.body;
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
  const newPaymentData = req.body;
  let newSaldoData = {};

  if (!Object.keys(newPaymentData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await SalesPayment.create(newPaymentData);

    newSaldoData = {
      ...newSaldoData,
      date: req.body.date,
      value: req.body.nominal,
    };

    await Saldo.create(newSaldoData);

    res.send("Sales Payment Berhasil Diinput !");
  }
});
