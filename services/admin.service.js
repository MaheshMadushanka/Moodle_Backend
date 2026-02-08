import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sequelize from "../config/db.config.js";
import sendEmail from "../config/sendEmail.js";
import AdminRepo from "../repositories/admin.repo.js";
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

const AdminService = {
    superAdminRegistration: async () => {
        const transaction = await sequelize.transaction();

        try {
            const password = process.env.SUPER_ADMIN_PASSWORD || 'superAdmin@123';
            const email = process.env.SUPER_ADMIN_EMAIL || 'superadmin@example.com';
            const encrypted_pw = await bcrypt.hash(password, 10);


            const existingUser = await UserRepo.getUserByEmail(email);
            if (existingUser) {
                await transaction.rollback();
                return {
                    status: true,
                    alreadyExists: true,
                    message: "Super Admin user already exists.",
                };
            }

            // Create role if not exists (idempotent)
            const position = 'Super Admin';
            const role = await RoleRepo.findOrCreateByPosition(position, transaction);

            // Create user account
            const user = await UserRepo.registerUser(
                email,
                encrypted_pw,
                transaction,
            );

            // Create admin profile
            const result = await AdminRepo.super_admin_register(
                role.id,
                user.id,
                transaction,
            );

            await transaction.commit();

            return {
                status: true,
                message: "Super Admin registered successfully!",
                data: result,
            };

        } catch (error) {
            await transaction.rollback();
            console.error("Error in superAdminRegistration:", error);
            throw error;
        }
    },
    adminRegistration: async (
        full_name,
        phone,
        address,
        dob,
        nic,
        email,
        role_id,) => {
        try {
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
            // Create user account
            const user = await UserRepo.registerUser(
                email,
                encrypted_pw
            );


            // Create admin profile
            const result = await AdminRepo.registerUser({
                full_name,
                phone,
                address,
                dob,
                nic,
                role_id: role.id,
                user_id: user.id,
            });
            const credentialMessage = `
Dear ${full_name},<br><br>

Your admin account has been successfully created. Below are your login credentials:<br><br>

<b>Email:</b> ${email}<br>
<b>Password:</b> ${password}<br><br>

For security reasons, please log in and change your password immediately after your first login.<br><br>

Best regards,<br>
DSW Team
`;


            await sendEmail(email, credentialMessage, "Admin Account Credentials");
            return {
                status: true,
                message: "Admin registered successfully!",
                data: result,
            };

        } catch (error) {
            console.error("Error in adminRegistration:", error);
            throw error;
        }
    },

    getAllAdmin: async () => {
        const result = await AdminRepo.getAllAdmin();
        if (result.length == 0) {
            return { status: false, message: "No admins in database!" };
        }
        return {
            status: true,
            message: "Admins data fetched successfully!",
            data: result,
        };
    },

    getAdminById: async (id) => {
        const admin = await AdminRepo.getAdminById(id);

        if (!admin?.[0]) {
            return { status: false, message: "Admin not found!" };
        }

        return {
            status: true,
            message: "Admin retrieved successfully!",
            data: admin,
        };
    },


    deleteAdminById: async (id) => {
        const transaction = await sequelize.transaction();

        try {
            const admin = await AdminRepo.getAdminById(id, transaction);

            if (!admin?.[0]) {
                await transaction.rollback();
                return { status: false, message: "Admin not found!" };
            }

            const userId = admin?.[0]?.user_id;
            if (!userId) {
                await transaction.rollback();
                return { status: false, message: "Admin user link not found!" };
            }

            // Delete admin FIRST
            await AdminRepo.deleteAdminById(id, transaction);

            // Then delete linked user
            await UserRepo.deleteUserById(userId, transaction);

            await transaction.commit();

            return { status: true, message: "Admin deleted successfully!" };

        } catch (error) {
            await transaction.rollback();
            console.error("Error deleting admin:", error);
            throw error;
        }
    },
    updateAdminById: async (
        id,
        full_name,
        phone,
        address,
        dob,
        nic,
        role_id,
    ) => {
        const admin = await AdminRepo.getAdminById(id);

        if (!admin?.[0]) {
            return { status: false, message: "Admin not found!" };
        }

        const role = await RoleRepo.findById(role_id);
        if (!role) {
            return {
                status: false,
                message: "Invalid role ID provided.",
            };
        }
        const result = await AdminRepo.updateAdminById(
            id,
            {
                full_name,
                phone,
                address,
                dob,
                nic,
                role_id,
            }
        );
        return {
            status: true,
            message: "Admin updated successfully!",
            data: result,
        };
    },
    updateAccountStatusById: async (id, status) => {
        const admin = await AdminRepo.getAdminById(id);
        if (!admin?.[0]) {
            return { status: false, message: "Admin not found!" };
        }

        const result = await AdminRepo.updateAccountStatusById(
            id,
            status
        );
        return {
            status: true,
            message: "Admin account status updated successfully!",
            data: result,
        };
    },
};

export default AdminService;