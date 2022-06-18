// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const purchaseDetail = sequelize.define(
    "tbl_purchase_detail",
    {
      purchaseDetailId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      purchaseId: {
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

  return purchaseDetail;
};
