import express from "express";
import StudentController from "../controllers/student.controller.js";

const router = express.Router();

router.post("/registerStudent", StudentController.studentRegistration);
router.get("/getStudentById/:id", StudentController.getStudentById);
router.get("/getAllStudent", StudentController.getAllStudent);
router.put("/updateStudentById/:id", StudentController.updateStudentById);
router.delete("/deleteStudentById/:id", StudentController.deleteStudentById);
router.put("/updateAccountStatusById/:id", StudentController.updateAccountStatusById);

export default router;