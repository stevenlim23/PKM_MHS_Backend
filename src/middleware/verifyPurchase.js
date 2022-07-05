// const { where } = require("sequelize/types");
const Model = require("../models");
const Purchase = Model.Purchase;

checkPurchaseId = (req, res, next) => {
  Purchase.findOne({
    where: {
      purchaseId: req.body.purchaseId ? req.body.purchaseId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Purchase ID Tidak Ditemukan !");
    }

    next();
  });
};

checkPurchasePayment = (req, res, next) => {
  Purchase.findOne({
    where: {
      purchaseId: req.body.purchaseId ? req.body.purchaseId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Purchase ID Tidak Ditemukan !");
    } else {
      if (data["dueNominal"] === 0) {
        Purchase.update(
          { status: "3" },
          { where: { purchaseId: req.body.purchaseId } }
        );

        return res.status(400).send("Payment Sudah Selesai !");
      } else if (Number(req.body.nominal) === data["dueNominal"]) {
        Purchase.update(
          { status: "3" },
          { where: { purchaseId: req.body.purchaseId } }
        );
        next();
      } else if (Number(req.body.nominal) > data["dueNominal"]) {
        return res.status(400).send("Payment melebihi nominal pembayaran !");
      } else {
        Purchase.update(
          { status: "2" },
          { where: { purchaseId: req.body.purchaseId } }
        );
        next();
      }
    }
  });
};

const verifyPurchase = {
  // Check Inventory ID
  checkPurchaseId: checkPurchaseId,
  checkPurchasePayment: checkPurchasePayment,
};

module.exports = verifyPurchase;
