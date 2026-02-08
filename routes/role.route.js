import express from "express";
import RoleController from "../controllers/role.controller.js";

const router = express.Router();
router.post("/create", RoleController.create);
router.delete("/deleteById/:id", RoleController.deleteById);
router.put("/updateById/:id", RoleController.updateById);
router.get("/getAll", RoleController.getAll);
router.get("/getById/:id", RoleController.findById);

export default router;

