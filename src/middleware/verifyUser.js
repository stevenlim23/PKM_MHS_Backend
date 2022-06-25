const Model = require("../models");
const User = Model.User;

checkUserId = (req, res, next) => {
  User.findOne({
    where: {
      userId: req.body.userId ? req.body.userId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("User ID Tidak Ditemukan !");
    }
    next();
  });
};

const verifySupplier = {
  // Check Account ID
  checkUserId: checkUserId,
};

module.exports = verifySupplier;
