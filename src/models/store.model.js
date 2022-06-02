// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const Store = sequelize.define(
    "tbl_store",
    {
      storeId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      name: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      telephone: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      logo: {
        type: DataTypes.STRING,
      },
      region: {
        type: DataTypes.STRING,
      },
      currency: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.TINYINT,
      },
      setup: {
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

  return Store;
};
