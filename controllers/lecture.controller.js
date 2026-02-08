import LectureService from "../services/lecture.service.js";

const LectureController = {

    lectureRegistration: async (req, res) => {

        try {
            if (req.body.mode && req.body.mode !== 'online' && req.body.mode !== 'physical') {
                return res.status(400).json({
                    response_code: 400,
                    status: false,
                    message: "Invalid mode value. Allowed values are 'online' or 'physical'."
                });
            }
            const result = await LectureService.lectureRegistration({
                full_name: req.body.full_name,
                phone: req.body.phone,
                address: req.body.address,
                mode: req.body.mode,
                dob: req.body.dob,
                reg_number: req.body.reg_number,
                nic: req.body.nic,
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

    getAllLecture: async (req, res) => {
        try {
            console.log("In get all lecture controller");
            const result = await LectureService.getAllLecture();

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

    getLectureById: async (req, res) => {
        try {

            const id = req.params.id;
            const result = await LectureService.getLectureById(id);
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
    updateLectureById: async (req, res) => {
        const { id } = req.params;
        const { full_name, phone, address, mode, dob, reg_number, nic, role_id } = req.body;
        if (req.body.mode && req.body.mode !== 'online' && req.body.mode !== 'physical') {
            return res.status(400).json({
                response_code: 400,
                status: false,
                message: "Invalid mode value. Allowed values are 'online' or 'physical'."
            });
        }
        try {
            const result = await LectureService.updateLectureById(
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
    deleteLectureById: async (req, res) => {

        try {
            const id = req.params.id;
            const result = await LectureService.deleteLectureById(id);
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
            const result = await LectureService.updateAccountStatusById(
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
export default LectureController;