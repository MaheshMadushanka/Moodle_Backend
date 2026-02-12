import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sendEmail from "../config/sendEmail.js";
import userRepo from "../repositories/user.repo.js";


dotenv.config();

const UserService = {

    changePasswordByUserId: async (user_id, newPassword) => {
        try {
            const user = await userRepo.getUserById(user_id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            const result = await userRepo.changePasswordByUserId(
                user_id,
                hashedNewPassword
            );
            return {
                status: true,
                message: "Password updated successfully",
                data: result,
            };
        } catch (error) {
            throw error;
        }
    },

    userLogin: async (email, password) => {
        try {
            const user = await userRepo.getUserByEmail(email);

            if (user) {
                 const useDetails = await userRepo.getUserById(user.id);
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    // Generate JWT token
                    let token = jwt.sign(
                        {
                            UserId: user.id,
                        },
                        "isdhendojoshifuyoshimarioluigipeachbowser",
                        { expiresIn: '24h' } // 24 hours
                    );

                    return {
                        status: true,
                        message: "Logged In Successfully!",
                        user: {
                            userDetails: useDetails?.[0] || null,
                        },
                        token: token,
                    };
                } else {
                    return { status: false, message: "Invalid Password." };
                }
            } else {
                return { status: false, message: "Invalid email." };
            }
        } catch (error) {
            throw error;
        }
    },

    generateAndSendOTP: async (email) => {
        try {
            const exUser = await userRepo.getUserByEmail(email);
            if (!exUser) {
                return {
                    status: false,
                    message: "User data not found!",
                };
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();

            const otpHashed = await bcrypt.hash(otp, 10);
            const expiration = new Date(Date.now() + 300000); // OTP expires in 5 minutes
            const result = await userRepo.storeOTP(
                exUser.id,
                otpHashed,
                expiration
            );
            if (!result) {
                return {
                    status: false,
                    message: "Failed to save OTP in database!",
                };
            }

            const credentialMessage = `
            Your OTP for password reset is: ${otp}. It is valid for 5 minutes.
            `;


            await sendEmail(email, credentialMessage, "Password Reset OTP");
            return {
                status: true,
                message: "OTP sent to email!",
            };

        } catch (error) {
            throw error;
        }
    },

    validateOTPForFPW: async (email, enteredOTP, newPassword) => {
        try {
            const exUser = await userRepo.getUserByEmail(email);
            if (!exUser) {
                return {
                    status: false,
                    message: "User data not found!",
                };
            }
            if (exUser) {
                const storedOTP = await userRepo.getStroedOTPByEmail(exUser.email);

                if (!storedOTP?.otp || !storedOTP?.expiryTime) {
                    return {
                        status: false,
                        message: "OTP not found!",
                    };
                }

                const expiryTime = new Date(storedOTP.expiryTime);
                if (Number.isNaN(expiryTime.getTime())) {
                    return {
                        status: false,
                        message: "OTP not found!",
                    };
                }

                if (Date.now() >= expiryTime.getTime()) {
                    return {
                        status: false,
                        message: "Invalid OTP or expired.",
                    };
                }
                const otpMatch = await bcrypt.compare(enteredOTP, storedOTP.otp);

                if (!otpMatch) {
                    return {
                        status: false,
                        message: "Incorrect OTP!",
                    };
                }
                if (Date.now() < expiryTime.getTime()) {
                    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
                    const result = await userRepo.changeUserPasswordByEmail(
                        exUser.email,
                        hashedNewPassword
                    );
                    await userRepo.clearStoredOTP(exUser.email);
                    return {
                        status: true,
                        message: "Password updated successfully",
                    };
                } else {
                    return {
                        status: false,
                        message: "Invalid OTP or expired.",
                    };
                }
            } else {
                return { status: false, message: "Invalid credentials." };
            }
        } catch (error) {
            throw error;
        }
    },

    getAllUser: async () => {
        try {
            const result = await userRepo.getAllUser();
            if (result.length == 0) {
                return { status: false, message: "No users in database!" };
            } else {
                return {
                    status: true,
                    message: "Users data fetched successfully!",
                    data: result,
                };
            }
        } catch (error) {
            throw error;
        }
    },

    getUserById: async (id) => {
        try {
            const user = await userRepo.getUserById(id);

            if (!user[0]) {
                return { status: false, message: "User not found!" };
            }

            return {
                status: true,
                message: "User retrieved successfully!",
                data: user,
            };
        } catch (error) {
            throw error;
        }
    },

    getUserByEmail: async (email) => {
        try {
            // Check for existing email
            const extUser = await userRepo.getUserByEmail(email);
            if (extUser[0]) {
                return {
                    status: true,
                    message: "Already Email is used!",
                };
            } else {
                return {
                    status: false,
                };
            }
        } catch (error) {
            throw error;
        }
    },

};

export default UserService;