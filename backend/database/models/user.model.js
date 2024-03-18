import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const UserModel = sequelize.define(
  "User",
  {
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default UserModel;
