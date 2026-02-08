import Student from "../models/student.model.js";

const StudentRepo = {
    registerStudent: async (studentData, transaction) => {
        try {
            const result = await Student.create(
                studentData,
                transaction ? { transaction } : undefined,
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAllStudent: async () => {
        try {
            const result = await Student.findAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    getStudentById: async (id, transaction) => {
        try {
            const result = await Student.findAll({
                where: {
                    id: id,
                },
                ...(transaction ? { transaction } : {}),
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    getStudentByReg_Number: async (reg_number, transaction) => {
        try {
            const result = await Student.findAll({
                where: {
                    reg_number: reg_number,
                },
                ...(transaction ? { transaction } : {}),
            });
            return result;
        } catch (error) {
            throw error;
        }
    },

    deleteStudentById: async (id, transaction) => {
        try {
            const result = await Student.destroy({
                where: {
                    id: id,
                },
                ...(transaction ? { transaction } : {}),
            });
            return result;
        } catch (err) {
            throw err;
        }
    },

    updateStudentById: async (
        id,
        full_name,
        phone,
        address,
        mode,
        dob,
        reg_number,
        batch_number,
        role_id,
        transaction,
    ) => {
        try {
            const result = await Student.update(
                {
                    full_name: full_name,
                    phone: phone,
                    address: address,
                    mode: mode,
                    dob: dob,
                    reg_number: reg_number,
                    batch_number: batch_number,
                    role_id: role_id,
                },
                {
                    where: {
                        id: id,
                    },
                    ...(transaction ? { transaction } : {}),
                }
            );
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

    updateAccountStatusById: async (id, status, transaction) => {
        try {
            const result = await Student.update(
                {
                    account_status: status,
                },
                {
                    where: {
                        id: id,
                    },
                    ...(transaction ? { transaction } : {}),
                }
            );
            return result;
        } catch (err) {
            console.log(err);
            throw err;
        }
    },
};
export default StudentRepo;