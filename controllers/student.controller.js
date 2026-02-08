import StudentService from "../services/student.service.js";

const StudentController = {

    studentRegistration: async (req, res) => {

        try {
            if (req.body.mode && req.body.mode !== 'online' && req.body.mode !== 'physical') {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: "Invalid mode value. Allowed values are 'online' or 'physical'."
                });
            }
            const result = await StudentService.studentRegistration({
                full_name: req.body.full_name,
                phone: req.body.phone,
                address: req.body.address,
                mode: req.body.mode,
                dob: req.body.dob,
                reg_number: req.body.reg_number,
                batch_number: req.body.batch_number,
                email: req.body.email,
                role_id: req.body.role_id
            });
            if (!result.status) {
                res.status(400).json({ response_code: 400, status: result.status, message: result.message });
            } else {
                res.status(201).json({ response_code: 201, status: result.status, message: result.message, result: result.data });
            }
        }
        catch (error) {
            return res.status(500).json({
                response_code: 500,
                status: false,
                message: error.message
            });
        }
    },

    getAllStudent: async (req, res) => {
        try {
            console.log("In get all student controller");
            const result = await StudentService.getAllStudent();

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

    getStudentById: async (req, res) => {
        try {

            const id = req.params.id;
            const result = await StudentService.getStudentById(id);
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
    updateStudentById: async (req, res) => {
        const { id } = req.params;
        const { full_name, phone, address, mode, dob, reg_number, batch_number, role_id } = req.body;
        if (req.body.mode && req.body.mode !== 'online' && req.body.mode !== 'physical') {
            return res.status(400).json({
                response_code: 400,
                status: false,
                message: "Invalid mode value. Allowed values are 'online' or 'physical'."
            });
        }
        try {
            const result = await StudentService.updateStudentById(
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
    deleteStudentById: async (req, res) => {

        try {
            const id = req.params.id;
            const result = await StudentService.deleteStudentById(id);
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
            const result = await StudentService.updateAccountStatusById(
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
export default StudentController;