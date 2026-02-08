import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import Role from './role.model.js';
import User from './user.model.js';

export const Admin = sequelize.define(
    "admin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        nic: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: 'id'
            },
        },
        account_status: {
            type: DataTypes.ENUM("active", "inactive"),
            allowNull: false,
            defaultValue: "active",
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: User,
                key: "id",
            },
        }

    },
    {
        tableName: "admin",
    }
);

export default Admin;
// Associations with cascade
Admin.belongsTo(Role, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Role.hasMany(Admin, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });

Admin.belongsTo(User, { foreignKey: 'user_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Admin, { foreignKey: 'user_id', onDelete: "CASCADE", onUpdate: "CASCADE" });