// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const salesDetail = sequelize.define(
    "tbl_sales_detail",
    {
      salesDetailId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      salesId: {
        type: DataTypes.STRING,
      },
      inventoryId: {
        type: DataTypes.STRING,
      },
      quantityBuy: {
        type: DataTypes.INTEGER,
      },
      pricePerUnit: {
        type: DataTypes.INTEGER,
      },
      discount: {
        type: DataTypes.INTEGER,
      },
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return salesDetail;
};
