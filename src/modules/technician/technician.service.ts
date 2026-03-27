import { Prisma } from "@prisma/client";
import { prisma } from "../../config/prismaClient.js";
import { CreateTechnicianDTO } from "./dto/create.technician-dto.js";
import { UpdateTechnicianDTO } from "./dto/update.technician-dto.js";

export async function createTechnician(data: CreateTechnicianDTO) {
  try {
    const technician = await prisma.technician.create({ data });
    return technician;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("E-mail já está em uso por outro técnico");
    }
    throw error;
  }
}

export async function listTechnicians() {
  return prisma.technician.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTechnicianById(id: number) {
  const technician = await prisma.technician.findFirst({
    where: { id, isDeleted: false },
  });

  return technician;
}

export async function updateTechnician(id: number, data: UpdateTechnicianDTO) {
  try {
    const technician = await prisma.technician.update({
      where: { id },
      data,
    });
    return technician;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return null;
    }
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new Error("E-mail já está em uso por outro técnico");
    }
    throw error;
  }
}

export async function softDeleteTechnician(id: number) {
  try {
    await prisma.technician.update({
      where: { id },
      data: { isDeleted: true },
    });
    return true;
  } catch (error: any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return false;
    }
    throw error;
  }
}