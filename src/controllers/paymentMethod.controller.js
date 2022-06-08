const Model = require("../models");
const PaymentMethod = Model.PaymentMethod;

const fieldAttributes = ["methodId", "name", "is_deleted"];

// Helper
const { errorHandler } = require("../middleware");

// get all PaymentMethod list
exports.getPaymentMethodList = errorHandler.wrapAsync(async (req, res) => {
  const paymentMethodListData = await PaymentMethod.findAll({
    where: {
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!paymentMethodListData.length)
    throw new errorHandler.ExpressError(404, "Payment Method Tidak Ditemukan");

  res.send(paymentMethodListData);
});
