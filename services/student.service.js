import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sequelize from "../config/db.config.js";
import sendEmail from "../config/sendEmail.js";
import StudentRepo from "../repositories/student.repo.js";
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

const StudentService = {

    studentRegistration: async (payload = {}) => {
        try {
            const {
                full_name,
                phone,
                address,
                mode,
                dob,
                reg_number,
                batch_number,
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

            const exStudent = await StudentRepo.getStudentByReg_Number(reg_number);
            if (exStudent?.[0]) {
                return {
                    status: false,
                    message: "Student with this registration ID already exists.",
                };
            }
            // Create user account
            const user = await UserRepo.registerUser(
                email,
                encrypted_pw
            );


            // Create employee profile
            const result = await StudentRepo.registerStudent({
                full_name,
                phone,
                address,
                mode,
                dob,
                reg_number,
                batch_number,
                role_id: role.id,
                user_id: user.id,
            });
            const credentialMessage = `
Dear ${full_name},<br><br>

Your employee account has been successfully created. Below are your login credentials:<br><br>

<b>Email:</b> ${email}<br>
<b>Password:</b> ${password}<br><br>

For security reasons, please log in and change your password immediately after your first login.<br><br>

Best regards,<br>
VTC Team
`;
            await sendEmail(email, credentialMessage, "Student Account Credentials");
            return {
                status: true,
                message: "Student registered successfully!",
                data: result,
            };

        } catch (error) {
            console.error("Error in studentRegistration:", error);
            throw error;
        }
    },

    getAllStudent: async () => {
        const result = await StudentRepo.getAllStudent();
        if (result.length == 0) {
            return { status: false, message: "No students in database!" };
        }

        return {
            status: true,
            message: "Students data fetched successfully!",
            data: result,
        };
    },

    getStudentById: async (id) => {
        const student = await StudentRepo.getStudentById(id);

        if (!student?.[0]) {
            return { status: false, message: "Student not found!" };
        }

        return {
            status: true,
            message: "Student retrieved successfully!",
            data: student,
        };
    },

    deleteStudentById: async (id) => {
        const transaction = await sequelize.transaction();

        try {
            const student = await StudentRepo.getStudentById(id, transaction);

            if (!student?.[0]) {
                await transaction.rollback();
                return { status: false, message: "Student not found!" };
            }

            const userId = student[0].user_id;

            // Delete student FIRST
            await StudentRepo.deleteStudentById(id, transaction);

            // Then delete linked user
            await UserRepo.deleteUserById(userId, transaction);

            await transaction.commit();

            return { status: true, message: "Student deleted successfully!" };

        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting student:", error);
            throw error;
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
        role_id
    ) => {
        const student = await StudentRepo.getStudentById(id);

        if (!student?.[0]) {
            return { status: false, message: "Student not found!" };
        }

        const role = await RoleRepo.findById(role_id);
        if (!role) {
            return {
                status: false,
                message: "Invalid role ID provided.",
            };
        }

        const result = await StudentRepo.updateStudentById(
            id,
            full_name,
            phone,
            address,
            mode,
            dob,
            reg_number,
            batch_number,
            role_id
        );

        return {
            status: true,
            message: "Student updated successfully!",
            data: result,
        };
    },
    updateAccountStatusById: async (id, status) => {
        const student = await StudentRepo.getStudentById(id);
        if (!student?.[0]) {
            return { status: false, message: "Student not found!" };
        }

        const result = await StudentRepo.updateAccountStatusById(id, status);
        return {
            status: true,
            message: "Student account status updated successfully!",
            data: result,
        };
    },
    deleteStudentById: async (id) => {
        const transaction = await sequelize.transaction();

        try {
            const student = await StudentRepo.getStudentById(id, transaction);

            if (!student?.[0]) {
                await transaction.rollback();
                return { status: false, message: "Student not found!" };
            }

            const userId = student?.[0]?.user_id;
            if (!userId) {
                await transaction.rollback();
                return { status: false, message: "Student user link not found!" };
            }

            // Delete student FIRST
            await StudentRepo.deleteStudentById(id, transaction);

            // Then delete linked user
            await UserRepo.deleteUserById(userId, transaction);

            await transaction.commit();

            return { status: true, message: "Student deleted successfully!" };

        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting student:", error);
            throw error;
        }
    }
}
export default StudentService;