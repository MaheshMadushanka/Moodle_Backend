import express from "express";
import LectureController from "../controllers/lecture.controller.js";

const router = express.Router();

router.post("/registerLecture", LectureController.lectureRegistration);
router.get("/getLectureById/:id", LectureController.getLectureById);
router.get("/getAllLecture", LectureController.getAllLecture);
router.put("/updateLectureById/:id", LectureController.updateLectureById);
router.delete("/deleteLectureById/:id", LectureController.deleteLectureById);
router.put("/updateAccountStatusById/:id", LectureController.updateAccountStatusById);

export default router;