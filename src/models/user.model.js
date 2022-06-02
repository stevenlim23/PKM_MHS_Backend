// Sequelize
const { DataTypes } = require("sequelize");
const { v4 } = require("uuid");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    "tbl_user",
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: v4,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      roleId: {
        type: DataTypes.STRING,
      },
      firstName: {
        type: DataTypes.STRING,
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      address: {
        type: DataTypes.STRING,
      },
      contact: {
        type: DataTypes.STRING,
      },
      profile: {
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

  return User;
};
