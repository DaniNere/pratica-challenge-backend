// src/modules/auth/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export interface AuthRequest extends Request {
  user?: {
    sub: string;
    role?: string;
    iat: number;
    exp: number;
  };
}

export function authGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.substring(7); 

  try {
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      role?: string;
      iat: number;
      exp: number;
    };

    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Acesso não autorizado" });
    }

    (req as AuthRequest).user = payload;

    return next();
  } catch (error) {
    console.error("Erro ao validar token:", error);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}