const Model = require("../models");
const Inventory = Model.Inventory;

const fieldAttributes = [
  "inventoryId",
  "storeId",
  "name",
  "quantity",
  "sellingPrice",
  "is_deleted",
];

// Helper
const { errorHandler } = require("../middleware");

// get all Inventory list
exports.getInventoryList = errorHandler.wrapAsync(async (req, res) => {
  const inventoryListData = await Inventory.findAll({
    where: {
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!inventoryListData.length)
    throw new errorHandler.ExpressError(404, "Inventory Tidak Ditemukan");

  res.send(inventoryListData);
});

// get Inventory by ID
exports.getInventoryListById = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const inventoryByIdData = await Inventory.findOne({
    where: {
      inventoryId: id,
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!inventoryByIdData)
    throw new errorHandler.ExpressError(404, "Inventory Tidak Ditemukan");

  res.send(inventoryByIdData);
});

// Create New Inventory
exports.createNewInventory = errorHandler.wrapAsync(async (req, res) => {
  const newInventoryData = req.body;

  // Validate request
  if (!Object.keys(newInventoryData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    Inventory.create(newInventoryData);

    res.send("Inventory Berhasil Dibuat");
  }
});

// Update Inventory Header
exports.updateInventory = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedInventoryData = req.body;

  // Validate request
  if (!Object.keys(updatedInventoryData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    Inventory.update(updatedInventoryData, {
      where: { inventoryId: id },
    }).then((data) => {
      if (data == 1) {
        res.send("Inventory Berhasil Diupdate");
      } else {
        res.status(400).send("Inventory Gagal Diupdate");
      }
    });
  }
});

// Delete Inventory
exports.deleteInventory = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  Inventory.update(
    { is_deleted: 1 },
    { where: { inventoryId: id, is_deleted: 0 } }
  ).then((data) => {
    if (data == 1) {
      res.send("Inventory Berhasil Dihapus");
    } else {
      res.status(400).send("Inventory Gagal Dihapus");
    }
  });
});
