// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prismaClient.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function validateAdminCredentials(email: string, password: string) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    return null;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) {
    return null;
  }

  const token = jwt.sign(
    {
      sub: admin.id,
      role: "admin",
      email: admin.email,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { token };
}