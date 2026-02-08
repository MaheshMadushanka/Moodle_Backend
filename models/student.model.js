import sequelize from "../config/db.config.js";
import { DataTypes } from "sequelize";
import Role from './role.model.js';
import User from './user.model.js';

export const Student = sequelize.define(
    "student",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        imageURL: {
            type: DataTypes.STRING,
            allowNull: true
        },
        address: {
            type: DataTypes.STRING,
            allowNull: true
        },
        mode: {
            type: DataTypes.ENUM("online", "physical"),
            allowNull: true
        },
        dob: {
            type: DataTypes.DATE,
            allowNull: true
        },
        reg_number: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        batch_number: {
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
        tableName: "student",
    }
);

export default Student;
// Associations with cascade
Student.belongsTo(Role, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
Role.hasMany(Student, { foreignKey: 'role_id', onDelete: "CASCADE", onUpdate: "CASCADE" });

Student.belongsTo(User, { foreignKey: 'user_id', onDelete: "CASCADE", onUpdate: "CASCADE" });
User.hasMany(Student, { foreignKey: 'user_id', onDelete: "CASCADE", onUpdate: "CASCADE" });