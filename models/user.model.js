import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
    "user",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        otp: {
            type: DataTypes.STRING,
            allowNull: true
        },
        otpExpiryTime: {
            type: DataTypes.DATE,
            allowNull: true
        },
    },
    {
        tableName: "user",
    }
);

export default User;
