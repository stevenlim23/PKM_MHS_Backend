// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Inventory = sequelize.define(
    "tbl_inventory",
    {
      inventoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      sellingPrice: {
        type: DataTypes.INTEGER,
      },
      isService: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
      is_deleted: {
        type: DataTypes.TINYINT,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Inventory;
};
