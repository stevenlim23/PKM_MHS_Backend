// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Supplier = sequelize.define(
    "tbl_supplier",
    {
      supplierId: {
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
      telephone: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
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

  return Supplier;
};
