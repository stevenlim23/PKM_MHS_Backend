const Model = require("../models");
const Store = Model.Store;

const fieldAttributes = [
  "storeId",
  "name",
  "address",
  "telephone",
  "email",
  "logo",
  "region",
  "currency",
  "type",
  "setup",
];

// Helper
const { errorHandler } = require("../middleware");

// get all Account list
exports.getStoreList = errorHandler.wrapAsync(async (req, res) => {
  const storeList = await Store.findAll({
    where: {
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!storeList.length)
    throw new errorHandler.ExpressError(404, "Toko Tidak Ditemukan");

  res.send(storeList);
});

// // get Store Detail by ID
exports.getStoreById = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const storeById = await Store.findOne({
    where: {
      storeId: id,
      is_deleted: 0,
    },
    attributes: fieldAttributes,
  });

  if (!storeById)
    throw new errorHandler.ExpressError(404, "Toko Tidak Ditemukan");

  res.send(storeById);
});

// Create Store
// exports.createStore = errorHandler.wrapAsync(async (req, res) => {
//   const newStoreData = req.body;

//   // Validate request
//   if (!Object.keys(newStoreData).length) {
//     throw new errorHandler.ExpressError(400, "Bad Request");
//   } else {
//     Store.create(newStoreData);

//     res.send("Store Created Successfully");
//   }
// });

// Update Store
exports.updateStore = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;
  const updatedStoreData = { ...req.body, ...{ setup: 1 } };

  // Validate request
  if (!Object.keys(updatedStoreData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    Store.update(updatedStoreData, {
      where: { storeId: id },
    }).then((data) => {
      if (data == 1) {
        res.send("Toko Berhasil Diupdate");
      } else {
        res.status(400).send("Toko Gagal Dihapus");
      }
    });
  }
});

// Delete Store
// exports.deleteStore = errorHandler.wrapAsync(async (req, res) => {
//   const { id } = req.params;

//   Store.update(
//     { is_deleted: 1 },
//     { where: { storeId: id, is_deleted: 0 } }
//   ).then((data) => {
//     if (data == 1) {
//       res.json({
//         status: 200,
//         data: "Store Deleted Successfully",
//       });
//     } else {
//       res.status(400).send({
//         status: 400,
//         message: "No Store Found !",
//       });
//     }
//   });
// });
