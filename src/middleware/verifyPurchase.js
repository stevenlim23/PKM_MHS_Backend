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
      if (data["dueNominal"] >= data["totalPayment"]) {
        return res.status(400).send("Payment Sudah Selesai !");
      } else {
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
