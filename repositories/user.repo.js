import Admin from "../models/admin.model.js";
import Lecture from "../models/lecture.model.js";
import Role from "../models/role.model.js";
import Student from "../models/student.model.js";
import User from "../models/user.model.js";

const UserRepo = {
    registerUser: async (
        email,
        password,
        transaction,
    ) => {
        const result = await User.create({
            email: email,
            password: password,
        }, transaction ? { transaction } : undefined);
        return result;
    },

    getUserByEmail: async (email) => {
        const result = await User.findOne({
            where: {
                email: email,
            },
        });
        return result;
    },

    getAllUser: async () => {
        const result = await User.findAll();
        return result;
    },

    getUserById: async (id) => {
        const result = await User.findAll({
            where: {
                id: id,
            },
             include: [
                    { model: Admin, required: false, include: [{ model: Role, required: false }] },
                    { model: Lecture, required: false, include: [{ model: Role, required: false }] },
                    { model: Student, required: false, include: [{ model: Role, required: false }] },
                ],
        });
        return result;
    },

    deleteUserById: async (id, transaction) => {
        const result = await User.destroy({
            where: {
                id: id,
            },
            ...(transaction ? { transaction } : {}),
        });
        return result;
    },

    updatePassword: async (id, hashedPassword) => {
        await User.update({ password: hashedPassword }, { where: { id } });
        return true;
    },
    storeOTP: async (id, otp, expireTime) => {
        const [affectedRows] = await User.update(
            {
                otp,
                otpExpiryTime: expireTime,
            },
            { where: { id: id } }
        );
        return affectedRows;
    },

    getStroedOTPByEmail: async (email) => {
        const exUser = await User.findOne({
            where: { email: email },
            attributes: ["otp", "otpExpiryTime"],
        });
        return exUser
            ? { otp: exUser.otp, expiryTime: exUser.otpExpiryTime }
            : null;
    },

    clearStoredOTP: async (email) => {
        await User.update(
            {
                otp: null,
                otpExpiryTime: null,
            },
            {
                where: { email: email },
            }
        );
    },

    changeUserPasswordByEmail: async (email, encrypted_pw) => {
        const result = await User.update(
            {
                password: encrypted_pw,
            },
            {
                where: {
                    email: email,
                },
            }
        );
        return result;
    },
    changePasswordByUserId: async (user_id, newPassword) => {
        const result = await User.update(
            {
                password: newPassword,
            },
            {
                where: {
                    id: user_id,
                },
            }
        );
        return result;
    },

};
export default UserRepo;