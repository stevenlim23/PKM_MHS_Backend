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

checkSalesPayment = (req, res, next) => {
  Sales.findOne({
    where: {
      salesId: req.body.salesId ? req.body.salesId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Sales ID Tidak Ditemukan !");
    } else {
      if (data["dueNominal"] === 0) {
        Sales.update({ status: "3" }, { where: { salesId: req.body.salesId } });

        return res.status(400).send("Payment Sudah Selesai !");
      } else if (Number(req.body.nominal) === data["dueNominal"]) {
        Sales.update({ status: "3" }, { where: { salesId: req.body.salesId } });

        next();
      } else if (Number(req.body.nominal) > data["dueNominal"]) {
        return res.status(400).send("Payment melebihi nominal pembayaran !");
      } else {
        Sales.update({ status: "2" }, { where: { salesId: req.body.salesId } });

        next();
      }
    }
  });
};

const verifySales = {
  // Check Inventory ID
  verifySalesId: verifySalesId,
  checkSalesPayment: checkSalesPayment,
};

module.exports = verifySales;
