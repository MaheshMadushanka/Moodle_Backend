import express from "express";
import UserController from "../controllers/user.controller.js";

const router = express.Router();

router.post("/userLogin", UserController.userLogin);
router.post("/sendOTP", UserController.sendOTP);
router.put("/validateOTPForFPW", UserController.validateOTPForFPW);
router.get("/getUserById/:id", UserController.getUserById);
router.get("/getAllUser", UserController.getAllUser);
router.put("/changePasswordByUserId", UserController.changePasswordByUserId);

export default router;