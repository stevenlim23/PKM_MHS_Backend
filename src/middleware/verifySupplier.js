const Model = require("../models");
const Supplier = Model.Supplier;

checkSupplierId = (req, res, next) => {
  Supplier.findOne({
    where: {
      supplierId: req.body.supplierId ? req.body.supplierId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Supplier ID Tidak Ditemukan !");
    }
    next();
  });
};

const verifySupplier = {
  // Check Account ID
  checkSupplierId: checkSupplierId,
};

module.exports = verifySupplier;
