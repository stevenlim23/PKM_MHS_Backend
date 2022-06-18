const Model = require("../models");
const PaymentMethod = Model.PaymentMethod;

checkPaymentMethodId = (req, res, next) => {
  PaymentMethod.findOne({
    where: {
      methodId: req.body.methodId ? req.body.methodId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Payment Method ID Tidak Ditemukan !");
    }
    next();
  });
};

const verifyPaymentMethod = {
  // Check Payment Method ID
  checkPaymentMethodId: checkPaymentMethodId,
};

module.exports = verifyPaymentMethod;
