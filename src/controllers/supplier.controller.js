const Model = require("../models");
const Supplier = Model.Supplier;

const fieldAttributes = [
  "supplierId",
  "storeId",
  "name",
  "telephone",
  "address",
  "email",
  "is_deleted",
];

// Helper
const { errorHandler } = require("../middleware");

// get all Supplier list
exports.getSupplierList = errorHandler.wrapAsync(async (req, res) => {
  const supplierListData = await Supplier.findAll({
    where: {
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!supplierListData.length)
    throw new errorHandler.ExpressError(404, "Supplier Tidak Ditemukan");

  res.send(supplierListData);
});

// get Supplier by ID
exports.getSupplierListById = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const supplierByIdData = await Supplier.findOne({
    where: {
      supplierId: id,
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!supplierByIdData)
    throw new errorHandler.ExpressError(404, "Supplier Tidak Ditemukan");

  res.send(supplierByIdData);
});

// Create New Supplier
exports.createNewSupplier = errorHandler.wrapAsync(async (req, res) => {
  const newSupplierData = req.body;

  // Validate request
  if (!Object.keys(newSupplierData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    Supplier.create(newSupplierData);

    res.send("Supplier Berhasil Dibuat");
  }
});

// // Update Supplier Header
exports.updateSupplier = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedSupplierData = req.body;

  // Validate request
  if (!Object.keys(updatedSupplierData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    Supplier.update(updatedSupplierData, {
      where: { supplierId: id },
    }).then((data) => {
      if (data == 1) {
        res.send("Supplier Berhasil Diupdate");
      } else {
        res.status(400).send("Supplier Gagal Diupdate");
      }
    });
  }
});

// // Delete Supplier
exports.deleteSupplier = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  Supplier.update(
    { is_deleted: 1 },
    { where: { supplierId: id, is_deleted: 0 } }
  ).then((data) => {
    if (data == 1) {
      res.send("Supplier Berhasil Dihapus");
    } else {
      res.status(400).send("Supplier Gagal Dihapus");
    }
  });
});
