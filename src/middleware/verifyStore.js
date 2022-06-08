const Model = require("../models");
const Store = Model.Store;

checkStoreId = (req, res, next) => {
  Store.findOne({
    where: {
      storeId: req.body.storeId ? req.body.storeId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Store ID Tidak Ditemukan !");
    }
    next();
  });
};

const verifyStore = {
  // Check Account ID
  checkStoreId: checkStoreId,
};

module.exports = verifyStore;
