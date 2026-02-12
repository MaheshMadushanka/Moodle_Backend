import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sequelize from "../config/db.config.js";
import sendEmail from "../config/sendEmail.js";
import LectureRepo from "../repositories/lecture.repo.js";
import RoleRepo from "../repositories/role.repo.js";
import UserRepo from "../repositories/user.repo.js";
dotenv.config();
/**
 * Generate a strong password with uppercase, lowercase, numbers, and symbols.
 */
function generateStrongPassword(length = 12) {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+[]{}|;:,.<>?";
    const allChars = upper + lower + numbers + symbols;

    let password = "";
    password += upper[Math.floor(Math.random() * upper.length)];
    password += lower[Math.floor(Math.random() * lower.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill remaining length
    for (let i = password.length; i < length; i++) {
        password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle characters to avoid predictable order
    return password
        .split("")
        .sort(() => Math.random() - 0.5)
        .join("");
}

const LectureService = {

    lectureRegistration: async (payload = {}) => {
        try {
            const {
                full_name,
                phone,
                address,
                mode,
                dob,
                reg_number,
                nic,
                email,
                role_id
            } = payload;

            const password = generateStrongPassword(12);
            const encrypted_pw = await bcrypt.hash(password, 10);

            const existingUser = await UserRepo.getUserByEmail(email);
            if (existingUser) {
                return {
                    status: false,
                    message: "User with this email already exists.",
                };
            }
            const role = await RoleRepo.findById(role_id);
            if (!role) {
                return {
                    status: false,
                    message: "Invalid role ID provided.",
                };
            }

            const exLecture = await LectureRepo.getLectureByReg_Number(reg_number);
            if (exLecture?.[0]) {
                return {
                    status: false,
                    message: "Lecture with this registration ID already exists.",
                };
            }
            // Create user account
            const user = await UserRepo.registerUser(
                email,
                encrypted_pw
            );


            // Create employee profile
            const result = await LectureRepo.registerLecture({
                full_name,
                phone,
                address,
                mode,
                dob,
                reg_number,
                nic,
                role_id: role.id,
                user_id: user.id,
            });
            const credentialMessage = `
Dear ${full_name},<br><br>

Your lecture account has been successfully created. Below are your login credentials:<br><br>

<b>Email:</b> ${email}<br>
<b>Password:</b> ${password}<br><br>

For security reasons, please log in and change your password immediately after your first login.<br><br>

Best regards,<br>
VTC Team
`;
            await sendEmail(email, credentialMessage, "Lecture Account Credentials");
            return {
                status: true,
                message: "Lecture registered successfully!",
                data: result,
            };

        } catch (error) {
            console.error("Error in lectureRegistration:", error);
            throw error;
        }
    },

    getAllLecture: async () => {
        const result = await LectureRepo.getAllLecture();
        if (result.length == 0) {
            return { status: false, message: "No lectures in database!" };
        }

        return {
            status: true,
            message: "Lectures data fetched successfully!",
            data: result,
        };
    },

    getLectureById: async (id) => {
        const lecture = await LectureRepo.getLectureById(id);

        if (!lecture?.[0]) {
            return { status: false, message: "Lecture not found!" };
        }

        return {
            status: true,
            message: "Lecture retrieved successfully!",
            data: lecture,
        };
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
        role_id
    ) => {
        const lecture = await LectureRepo.getLectureById(id);

        if (!lecture?.[0]) {
            return { status: false, message: "Lecture not found!" };
        }

        const role = await RoleRepo.findById(role_id);
        if (!role) {
            return {
                status: false,
                message: "Invalid role ID provided.",
            };
        }

        const result = await LectureRepo.updateLectureById(
            id,
            full_name,
            phone,
            address,
            mode,
            dob,
            reg_number,
            nic,
            role_id
        );

        return {
            status: true,
            message: "Lecture updated successfully!",
            data: result,
        };
    },
    updateAccountStatusById: async (id, status) => {
        const lecture = await LectureRepo.getLectureById(id);
        if (!lecture?.[0]) {
            return { status: false, message: "Lecture not found!" };
        }

        const result = await LectureRepo.updateAccountStatusById(id, status);
        return {
            status: true,
            message: "Lecture account status updated successfully!",
            data: result,
        };
    },
    deleteLectureById: async (id) => {
        const transaction = await sequelize.transaction();

        try {
            const lecture = await LectureRepo.getLectureById(id, transaction);

            if (!lecture?.[0]) {
                await transaction.rollback();
                return { status: false, message: "Lecture not found!" };
            }

            const userId = lecture?.[0]?.user_id;
            if (!userId) {
                await transaction.rollback();
                return { status: false, message: "Lecture user link not found!" };
            }

            // Delete lecture FIRST
            await LectureRepo.deleteLectureById(id, transaction);

            // Then delete linked user
            await UserRepo.deleteUserById(userId, transaction);

            await transaction.commit();

            return { status: true, message: "Lecture deleted successfully!" };

        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting lecture:", error);
            throw error;
        }
    }
}
export default LectureService;