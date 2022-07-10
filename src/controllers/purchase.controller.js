const Model = require("../models");
const Purchase = Model.Purchase;
const PurchaseDetail = Model.PurchaseDetail;
const PurchasePayment = Model.PurchasePayment;
const Supplier = Model.Supplier;
const Store = Model.Store;
const Inventory = Model.Inventory;
const PaymentMethod = Model.PaymentMethod;
const Saldo = Model.Saldo;

Purchase.hasMany(PurchaseDetail, { foreignKey: "purchaseId" });
PurchaseDetail.belongsTo(Purchase, { foreignKey: "purchaseId" });

PurchasePayment.hasOne(Purchase, { foreignKey: "purchaseId" });
Purchase.belongsTo(PurchasePayment, { foreignKey: "purchaseId" });

Supplier.hasOne(Purchase, { foreignKey: "supplierId" });
Purchase.belongsTo(Supplier, { foreignKey: "supplierId" });

Store.hasOne(Purchase, { foreignKey: "storeId" });
Purchase.belongsTo(Store, { foreignKey: "storeId" });

Inventory.hasOne(PurchaseDetail, { foreignKey: "inventoryId" });
PurchaseDetail.belongsTo(Inventory, { foreignKey: "inventoryId" });

PaymentMethod.hasOne(PurchasePayment, { foreignKey: "methodId" });
PurchasePayment.belongsTo(PaymentMethod, { foreignKey: "methodId" });

const listAttributes = [
  "purchaseId",
  "refNumber",
  "transDate",
  "dueDate",
  "status",
  "dueNominal",
  "totalPayment",
];

const detailAttributes = [
  "purchaseId",
  "refNumber",
  "transDate",
  "dueDate",
  "status",
  "dueNominal",
  "totalPayment",
];

const paymentDetailAttributes = [
  "purchasePaymentId",
  "purchaseId",
  "date",
  "nominal",
  "code",
];

// Helper
const { errorHandler } = require("../middleware");
const { fn, col } = require("sequelize");

// get all Purchase list
exports.getPurchaseList = errorHandler.wrapAsync(async (req, res) => {
  const purchaseListData = await Purchase.findAll({
    attributes: listAttributes,
    include: [
      {
        model: Supplier,
        attributes: ["supplierId", "name"],
      },
    ],
    where: {
      storeId: req.storeId,
    },
  });

  if (!purchaseListData.length)
    throw new errorHandler.ExpressError(404, "Purchase Tidak Ditemukan");

  res.send(purchaseListData);
});

// get purchase Detail
exports.getPurchaseDetail = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const purchaseDetailData = await Purchase.findOne({
    attributes: detailAttributes,
    include: [
      {
        model: Supplier,
        attributes: ["supplierId", "name"],
      },
      {
        model: Store,
        attributes: ["storeId", "name"],
      },
      {
        model: PurchaseDetail,
        attributes: [
          "purchaseDetailId",
          "inventoryId",
          "purchaseId",
          "quantityBuy",
          "pricePerUnit",
          "discount",
        ],
        include: [{ model: Inventory, attributes: ["inventoryId", "name"] }],
      },
    ],
    where: {
      purchaseId: id,
    },
  });

  if (!purchaseDetailData)
    throw new errorHandler.ExpressError(404, "Purchase Tidak Ditemukan");

  res.send(purchaseDetailData);
});

// get purchase Detail
exports.getPaymentDetail = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const purchasePaymentDetail = await PurchasePayment.findAll({
    where: {
      purchaseId: id,
    },
    attributes: paymentDetailAttributes,
    include: [
      {
        model: PaymentMethod,
        attributes: ["methodId", "name"],
      },
    ],
  });

  if (!purchasePaymentDetail.length)
    throw new errorHandler.ExpressError(
      404,
      "Purchase Payment Tidak Ditemukan"
    );

  res.send(purchasePaymentDetail);
});

// Post Purchase
exports.createNewPurchase = errorHandler.wrapAsync(async (req, res) => {
  var lastPurchaseId = null;

  const newPurchaseData = { ...req.body, status: "1" };
  const newPurchaseDetailData = req.body.itemDetail;

  if (!Object.keys(newPurchaseData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await Purchase.create(newPurchaseData).then((result) => {
      lastPurchaseId = result.purchaseId;
    });

    for (let i = 0; i < newPurchaseDetailData.length; i++) {
      const newDetailData = {
        ...newPurchaseDetailData[i],
        purchaseId: lastPurchaseId,
        quantityBuy: newPurchaseDetailData[i]["quantity"],
      };

      const newInventoryData = {
        quantity: newPurchaseDetailData[i]["quantity"],
      };

      PurchaseDetail.create(newDetailData);

      Inventory.increment(newInventoryData, {
        where: { inventoryId: newPurchaseDetailData[i]["inventoryId"] },
      });
    }

    res.send("Purchase Berhasil Dibuat !");
  }
});

// Create New Purchase Payment
exports.createNewPurchasePayment = errorHandler.wrapAsync(async (req, res) => {
  const newPaymentData = req.body;
  let newSaldoData = {};
  if (!Object.keys(newPaymentData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await PurchasePayment.create(newPaymentData);

    const updatedNominalPurchase = {
      dueNominal: req.body.nominal,
    };

    await Purchase.decrement(updatedNominalPurchase, {
      where: { purchaseId: req.body.purchaseId },
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
        value: saldoData["value"] - req.body.nominal,
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
        value: latestSaldo - req.body.nominal,
      };

      await Saldo.create(newSaldoData);
    }

    res.send("Purchase Payment Berhasil Diinput !");
  }
});
