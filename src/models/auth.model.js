// Sequelize
const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
  const Auth = sequelize.define(
    "tbl_user",
    {
      userId: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      storeId: {
        type: DataTypes.STRING,
      },
      email: {
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
    },
    {
      freezeTableName: true,
      timestamps: false,
    }
  );

  return Auth;
};
