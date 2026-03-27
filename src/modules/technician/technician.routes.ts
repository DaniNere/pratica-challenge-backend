// src/modules/technician/technician.routes.ts
import { Router } from "express";
import { authGuard } from "../auth/auth.middleware.js";
import {
  createTechnicianHandler,
  listTechniciansHandler,
  getTechnicianByIdHandler,
  updateTechnicianHandler,
  deleteTechnicianHandler,
} from "./technician.controller.js";

const router = Router();

router.use(authGuard);

router.post("/technicians", createTechnicianHandler);
router.get("/technicians", listTechniciansHandler);
router.get("/technicians/:id", getTechnicianByIdHandler);
router.put("/technicians/:id", updateTechnicianHandler);
router.delete("/technicians/:id", deleteTechnicianHandler);

export default router;