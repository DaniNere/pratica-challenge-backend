import { prisma } from "../../config/prismaClient.js";
import {
  createTechnician,
  listTechnicians,
  getTechnicianById,
  updateTechnician,
  softDeleteTechnician,
} from "../../modules/technician/technician.service.js";

describe("Technician Service (production functions)", () => {
  const baseData = {
    fullName: "Service Test Tech",
    phone: "11999999999",
    email: "service-test-1@test-tech.com",
    zipCode: "01001000",
    state: "SP",
    city: "São Paulo",
  };

  afterAll(async () => {
    await prisma.technician.deleteMany({
      where: {
        email: { contains: "service-test" },
      },
    });

    await prisma.$disconnect();
  });

  it("should create a technician", async () => {
    const technician = await createTechnician(baseData);

    expect(technician).toHaveProperty("id");
    expect(technician.email).toBe(baseData.email);
    expect(technician.isDeleted).toBe(false);
  });

  it("should list only non-deleted technicians", async () => {
    // cria outro técnico
    await createTechnician({
      ...baseData,
      email: "service-test-2@test-tech.com",
    });

    const technicians = await listTechnicians();

    expect(Array.isArray(technicians)).toBe(true);
    // todos com isDeleted = false
    expect(technicians.every((t) => !t.isDeleted)).toBe(true);
  });

  it("should get technician by id", async () => {
    const created = await createTechnician({
      ...baseData,
      email: "service-test-3@test-tech.com",
    });

    const found = await getTechnicianById(created.id);

    expect(found).not.toBeNull();
    expect(found!.id).toBe(created.id);
  });

  it("should return null when getting a soft-deleted technician", async () => {
    const created = await createTechnician({
      ...baseData,
      email: "service-test-4@test-tech.com",
    });

    await softDeleteTechnician(created.id);

    const found = await getTechnicianById(created.id);

    expect(found).toBeNull();
  });

  it("should update an existing technician", async () => {
    const created = await createTechnician({
      ...baseData,
      email: "service-test-5@test-tech.com",
    });

    const updated = await updateTechnician(created.id, {
      phone: "11888888888",
    });

    expect(updated).not.toBeNull();
    expect(updated!.phone).toBe("11888888888");
  });

  it("should return null when updating a non-existing technician", async () => {
    const updated = await updateTechnician(999999, {
      phone: "11888888888",
    });

    expect(updated).toBeNull();
  });

  it("should soft delete an existing technician", async () => {
    const created = await createTechnician({
      ...baseData,
      email: "service-test-6@test-tech.com",
    });

    const result = await softDeleteTechnician(created.id);

    expect(result).toBe(true);

    const deletedRecord = await prisma.technician.findUnique({
      where: { id: created.id },
    });

    expect(deletedRecord!.isDeleted).toBe(true);
  });

  it("should return false when soft deleting non-existing technician", async () => {
    const result = await softDeleteTechnician(999999);
    expect(result).toBe(false);
  });
});