const Model = require("../models");
const Inventory = Model.Inventory;

checkInventoryId = (req, res, next) => {
  Inventory.findOne({
    where: {
      inventoryId: req.body.inventoryId ? req.body.inventoryId : null,
    },
  }).then((data) => {
    if (!data) {
      return res.status(400).send("Inventory ID Tidak Ditemukan !");
    }

    next();
  });
};

const verifyInventory = {
  // Check Inventory ID
  checkInventoryId: checkInventoryId,
};

module.exports = verifyInventory;
