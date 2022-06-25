// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const stockOpname = sequelize.define(
    "tbl_stock_opname_detail",
    {
      stockOpnameDetailId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      stockOpnameId: {
        type: DataTypes.STRING,
      },
      inventoryId: {
        type: DataTypes.STRING,
      },
      qtyStart: {
        type: DataTypes.INTEGER,
      },
      qtyEnd: {
        type: DataTypes.INTEGER,
      },
      difference: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return stockOpname;
};
