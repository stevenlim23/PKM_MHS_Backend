const Model = require("../models");
const Sales = Model.Sales;

verifySalesId = (req, res, next) => {
  Sales.findOne({
    where: {
      salesId: req.body.salesId ? req.body.salesId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Sales ID Tidak Ditemukan !");
    }

    next();
  });
};

const verifySales = {
  // Check Inventory ID
  verifySalesId: verifySalesId,
};

module.exports = verifySales;
