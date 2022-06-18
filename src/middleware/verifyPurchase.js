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

const verifyPurchase = {
  // Check Inventory ID
  checkPurchaseId: checkPurchaseId,
};

module.exports = verifyPurchase;
