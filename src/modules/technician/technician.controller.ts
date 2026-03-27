import { Request, Response } from "express";
import {
  createTechnician,
  listTechnicians,
  getTechnicianById,
  updateTechnician,
  softDeleteTechnician,
} from "./technician.service.js";
import { CreateTechnicianDTO } from "./dto/create.technician-dto.js";
import { UpdateTechnicianDTO } from "./dto/update.technician-dto.js";

export async function createTechnicianHandler(req: Request, res: Response) {
  try {
    const { fullName, phone, email, zipCode, state, city } =
      req.body as CreateTechnicianDTO;

    if (!fullName || !phone || !email || !zipCode || !state || !city) {
      return res.status(400).json({
        message:
          "Campos obrigatórios: fullName, phone, email, zipCode, state, city",
      });
    }

    const technician = await createTechnician({
      fullName,
      phone,
      email,
      zipCode,
      state,
      city,
    });

    return res.status(201).json(technician);
  } catch (error: any) {
    if (error.message === "E-mail já está em uso por outro técnico") {
      return res.status(409).json({ message: error.message });
    }

    console.error("Erro ao criar técnico:", error);
    return res.status(500).json({ message: "Erro ao criar técnico" });
  }
}

export async function listTechniciansHandler(req: Request, res: Response) {
  try {
    const technicians = await listTechnicians();
    return res.json(technicians);
  } catch (error) {
    console.error("Erro ao listar técnicos:", error);
    return res.status(500).json({ message: "Erro ao listar técnicos" });
  }
}

export async function getTechnicianByIdHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const technician = await getTechnicianById(id);

    if (!technician) {
      return res.status(404).json({ message: "Técnico não encontrado" });
    }

    return res.json(technician);
  } catch (error) {
    console.error("Erro ao buscar técnico:", error);
    return res
      .status(500)
      .json({ message: "Erro ao buscar técnico pelo identificador" });
  }
}

export async function updateTechnicianHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const payload = req.body as UpdateTechnicianDTO;

    const updated = await updateTechnician(id, payload);

    if (!updated) {
      return res.status(404).json({ message: "Técnico não encontrado" });
    }

    return res.json(updated);
  } catch (error: any) {
    if (error.message === "E-mail já está em uso por outro técnico") {
      return res.status(409).json({ message: error.message });
    }

    console.error("Erro ao atualizar técnico:", error);
    return res.status(500).json({ message: "Erro ao atualizar técnico" });
  }
}

export async function deleteTechnicianHandler(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await softDeleteTechnician(id);

    if (!deleted) {
      return res.status(404).json({ message: "Técnico não encontrado" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Erro ao excluir técnico:", error);
    return res.status(500).json({ message: "Erro ao excluir técnico" });
  }
}