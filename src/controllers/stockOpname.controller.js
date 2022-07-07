const Model = require("../models");
const StockOpname = Model.StockOpname;
const StockOpnameDetail = Model.StockOpnameDetail;

const Store = Model.Store;
const Inventory = Model.Inventory;
const User = Model.User;

StockOpname.hasMany(StockOpnameDetail, {
  foreignKey: "stockOpnameId",
  as: "itemDetail",
});
StockOpnameDetail.belongsTo(StockOpname, {
  foreignKey: "stockOpnameId",
  as: "itemDetail",
});

Store.hasOne(StockOpname, { foreignKey: "storeId", as: "store" });
StockOpname.belongsTo(Store, { foreignKey: "storeId", as: "store" });

User.hasOne(StockOpname, { foreignKey: "userId", as: "user" });
StockOpname.belongsTo(User, { foreignKey: "userId", as: "user" });

Inventory.hasOne(StockOpnameDetail, {
  foreignKey: "inventoryId",
  as: "inventory",
});
StockOpnameDetail.belongsTo(Inventory, {
  foreignKey: "inventoryId",
  as: "inventory",
});

const listAttributes = ["stockOpnameId", "date", "description"];

// Helper
const { errorHandler } = require("../middleware");

// get all Stock Opname list
exports.getStockOpnameList = errorHandler.wrapAsync(async (req, res) => {
  const stockOpnameList = await StockOpname.findAll({
    attributes: listAttributes,
    include: [
      {
        model: User,
        attributes: ["userId", "firstName", "lastName"],
        as: "user",
      },
      {
        model: Store,
        attributes: ["storeId", "name"],
        as: "store",
      },
    ],
    where: {
      storeId: req.storeId,
    },
  });

  if (!stockOpnameList.length)
    throw new errorHandler.ExpressError(404, "Stock Opname Tidak Ditemukan");

  res.send(stockOpnameList);
});

// get Sales Detail
exports.getStockOpnameDetail = errorHandler.wrapAsync(async (req, res) => {
  const { id } = req.params;

  const stockOpnameDetailData = await StockOpname.findOne({
    attributes: listAttributes,
    include: [
      {
        model: User,
        attributes: ["userId", "firstName", "lastName"],
        as: "user",
      },
      {
        as: "itemDetail",
        model: StockOpnameDetail,
        attributes: ["qtyStart", "qtyEnd", "difference", "description"],
        include: [
          {
            model: Inventory,
            attributes: ["inventoryId", "name"],
            as: "inventory",
          },
        ],
      },
    ],
    where: {
      stockOpnameId: id,
    },
  });

  if (!stockOpnameDetailData)
    throw new errorHandler.ExpressError(
      404,
      "Stock Opname Detail Tidak Ditemukan"
    );

  res.send(stockOpnameDetailData);
});

// Create New Stock Opname
exports.createNewStockOpname = errorHandler.wrapAsync(async (req, res) => {
  var lastStockOpnameId = null;

  const newStockOpnameData = {
    ...req.body,
    userId: req.userId,
    storeId: req.storeId,
  };
  const newStockOpnameDetailData = req.body.itemDetail;

  if (!Object.keys(newStockOpnameData).length) {
    throw new errorHandler.ExpressError(400, "Bad Request");
  } else {
    await StockOpname.create(newStockOpnameData).then((result) => {
      lastStockOpnameId = result.stockOpnameId;
    });

    for (let i = 0; i < newStockOpnameDetailData.length; i++) {
      const newDetailData = {
        ...newStockOpnameDetailData[i],
        stockOpnameId: lastStockOpnameId,
        userId: req.userId,
        qtyStart: newStockOpnameDetailData[i]["qtyStart"],
        qtyEnd: newStockOpnameDetailData[i]["qtyEnd"],
      };

      const newInventoryData = {
        quantity: newStockOpnameDetailData[i]["qtyEnd"],
      };

      StockOpnameDetail.create(newDetailData);

      Inventory.update(newInventoryData, {
        where: { inventoryId: newStockOpnameDetailData[i]["inventoryId"] },
      });
    }

    res.send("Stock Opname Berhasil Dibuat !");
  }
});
