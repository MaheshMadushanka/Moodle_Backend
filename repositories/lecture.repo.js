import Lecture from "../models/lecture.model.js";

const LectureRepo = {
    registerLecture: async (lectureData, transaction) => {
        try {
            const result = await Lecture.create(
                lectureData,
                transaction ? { transaction } : undefined,
            );
            return result;
        } catch (error) {
            throw error;
        }
    },

    getAllLecture: async () => {
        try {
            const result = await Lecture.findAll();
            return result;
        } catch (error) {
            throw error;
        }
    },

    getLectureById: async (id, transaction) => {
        try {
            const result = await Lecture.findAll({
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

    getLectureByReg_Number: async (reg_number, transaction) => {
        try {
            const result = await Lecture.findAll({
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

    deleteLectureById: async (id, transaction) => {
        try {
            const result = await Lecture.destroy({
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

    updateLectureById: async (
        id,
        full_name,
        phone,
        address,
        mode,
        dob,
        reg_number,
        nic,
        role_id,
        transaction,
    ) => {
        try {
            const result = await Lecture.update(
                {
                    full_name: full_name,
                    phone: phone,
                    address: address,
                    mode: mode,
                    dob: dob,
                    reg_number: reg_number,
                    nic: nic,
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
            const result = await Lecture.update(
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
export default LectureRepo;