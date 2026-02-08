import express from "express";
import AdminController from "../controllers/admin.controller.js";

const router = express.Router();
router.post("/registerSuperAdmin", AdminController.superAdminRegistration);
router.post("/registerAdmin", AdminController.adminRegistration);
router.get("/getAdminById/:id", AdminController.getAdminById);
router.get("/getAllAdmin", AdminController.getAllAdmin);
router.put("/updateAdminById/:id", AdminController.updateAdminById);
router.delete("/deleteAdminById/:id", AdminController.deleteAdminById);
router.put("/updateAccountStatusById/:id", AdminController.updateAccountStatusById);

export default router;
