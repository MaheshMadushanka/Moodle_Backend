import AdminService from "../services/admin.service.js";

const AdminController = {

    superAdminRegistration: async (req, res) => {

        try {
            const result = await AdminService.superAdminRegistration();
            if (result.status) {
                const statusCode = result.alreadyExists ? 200 : 201;
                return res.status(statusCode).json({
                    response_code: statusCode,
                    status: result.status,
                    message: result.message,
                });
            }

            return res.status(400).json({ response_code: 400, error: result.message });
        }
        catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message,
            });
        }
    },

    adminRegistration: async (req, res) => {

        try {
            const result = await AdminService.adminRegistration(
                req.body.full_name,
                req.body.phone,
                req.body.address,
                req.body.dob,
                req.body.nic,
                req.body.email,
                req.body.role_id
            );
            if (result.status) {
                return res.status(201).json({ response_code: 201, status: result.status, message: result.message, result: result.data });
            }

            return res.status(400).json({ response_code: 400, error: result.message });
        }
        catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

    getAllAdmin: async (req, res) => {
        try {
            console.log("In get all admin controller");
            const result = await AdminService.getAllAdmin();

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
                message: error.message
            });
        }
    },

    getAdminById: async (req, res) => {
        try {

            const id = req.params.id;
            const result = await AdminService.getAdminById(id);
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
                message: error.message
            });
        }
    },
    updateAdminById: async (req, res) => {
        const { id } = req.params;
        const { full_name, phone, address, dob, nic, role_id } = req.body;

        try {
            const result = await AdminService.updateAdminById(
                id,
                full_name,
                phone,
                address,
                dob,
                nic,
                role_id
            );

            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 400,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },
    deleteAdminById: async (req, res) => {

        try {
            const id = req.params.id;
            const result = await AdminService.deleteAdminById(id);
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 404,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },
    updateAccountStatusById: async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;

        try {
            if (status !== 'active' && status !== 'inactive') {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: "Invalid status value. Allowed values are 'active' or 'inactive'."
                });
            }
            const result = await AdminService.updateAccountStatusById(
                id,
                status
            );
            if (result.status) {
                res.status(200).json({
                    response_code: 200,
                    status: result.status,
                    message: result.message,
                });
            } else {
                res.status(400).json({
                    response_code: 400,
                    status: result.status,
                    message: result.message,
                });
            }
        } catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },
}
export default AdminController;