// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { validateAdminCredentials } from "./auth.service.js";

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // validação básica de entrada
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "E-mail e senha são obrigatórios" });
    }

    const result = await validateAdminCredentials(email, password);

    if (!result) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    // { token: "..." }
    return res.json(result);
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({ message: "Erro ao realizar login" });
  }
}