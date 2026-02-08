import UserService from "../services/user.service.js";

const UserController = {

    changePasswordByUserId: async (req, res) => {
        const { user_id, newPassword } = req.body;
        try {
            const result = await UserService.changePasswordByUserId(user_id, newPassword);
            if (!result.status) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result.message
                });
            }
            return res.status(200).json({
                response_code: 200,
                status: true,
                message: "Password changed successfully"
            });
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    userLogin: async (req, res) => {
        const { email, password } = req.body;
        try {
            const result = await UserService.userLogin(email, password);
            if (!result.status) {
                // If status is false, return status 400 with the error message
                res.status(400).json({ response_code: 400, status: result.status, error: result.message, });
            } else {
                // If status is true, return status 200 with the success message and token
                res.status(200).json({ response_code: 200, status: result.status, message: result.message, result: result.user, token: result.token });
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    sendOTP: async (req, res) => {
        const { email } = req.body;
        try {
            const result = await UserService.generateAndSendOTP(email);

            if (!result.status) {
                // If status is false, return status 400 with the error message
                res.status(400).json({ response_code: 400, message: result.message });
            } else {
                // If status is true, return status 200 with the success message and token
                res.status(200).json({ response_code: 200, UserId: result.UserId, message: result.message });
            }
        } catch (error) {
            console.error('Error submitting request form:', error);
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    validateOTPForFPW: async (req, res) => {
        const { email, enteredOTP, newPassword } = req.body;
        try {
            const result = await UserService.validateOTPForFPW(email, enteredOTP, newPassword);
            if (!result || !result.status) {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: result && result.message ? result.message : "Invalid Credentials",
                });
            } else {
                return res.status(200).json({
                    response_code: 200,
                    status: true,
                    message: "Password changed successfully",
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    getAllUser: async (req, res) => {
        try {

            const result = await UserService.getAllUser();

            if (result.status === false) {
                res.status(400)
                    .json({ response_code: 400, status: result.status, message: result.message });
            } else {
                res.status(200).json({ response_code: 200, status: result.status, message: result.message, result: result.data });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },

    getUserById: async (req, res) => {
        try {

            const id = req.params.id;
            const result = await UserService.getUserById(id);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                    result: result.data,
                });
            } else {
                res.status(404).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: 'Internal server error',
            });
        }
    },
}
export default UserController;