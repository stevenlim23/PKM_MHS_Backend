// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const stockOpname = sequelize.define(
    "tbl_stock_opname",
    {
      stockOpnameId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      userId: {
        type: DataTypes.STRING,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
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
