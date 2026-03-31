import request from "supertest";
import bcrypt from "bcrypt";
import { createApp } from "../../app.js";
import { prisma } from "../../config/prismaClient.js";

const app = createApp();

describe("Technician Routes - protected CRUD", () => {
  const adminEmail = "tech-admin@pratica.com";
  const adminPassword = "tech1234";
  let token: string;

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: { password: passwordHash },
      create: { email: adminEmail, password: passwordHash },
    });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password: adminPassword });

    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.technician.deleteMany({
      where: { email: { contains: "@test-tech.com" } },
    });

    await prisma.admin.deleteMany({
      where: { email: adminEmail },
    });

    await prisma.$disconnect();
  });

  it("should deny access without token", async () => {
    const res = await request(app).get("/api/technicians");
    expect(res.status).toBe(401);
  });

  it("should create a technician", async () => {
    const res = await request(app)
      .post("/api/technicians")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Test Tech",
        phone: "11999999999",
        email: "test1@test-tech.com",
        zipCode: "01001000",
        state: "SP",
        city: "São Paulo",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("test1@test-tech.com");
  });

  it("should list technicians (excluding soft-deleted ones)", async () => {
    const res = await request(app)
      .get("/api/technicians")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should update a technician", async () => {
    const created = await request(app)
      .post("/api/technicians")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Tech To Update",
        phone: "11911111111",
        email: "update@test-tech.com",
        zipCode: "01002000",
        state: "SP",
        city: "São Paulo",
      });

    const id = created.body.id;

    const res = await request(app)
      .put(`/api/technicians/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        phone: "11922222222",
      });

    expect(res.status).toBe(200);
    expect(res.body.phone).toBe("11922222222");
  });

  it("should soft delete a technician", async () => {
    const created = await request(app)
      .post("/api/technicians")
      .set("Authorization", `Bearer ${token}`)
      .send({
        fullName: "Tech To Delete",
        phone: "11933333333",
        email: "delete@test-tech.com",
        zipCode: "01003000",
        state: "SP",
        city: "São Paulo",
      });

    const id = created.body.id;

    const delRes = await request(app)
      .delete(`/api/technicians/${id}`)
      .set("Authorization", `Bearer ${token}`);

    expect(delRes.status).toBe(204);

    const listRes = await request(app)
      .get("/api/technicians")
      .set("Authorization", `Bearer ${token}`);

    const ids = listRes.body.map((t: any) => t.id);
    expect(ids).not.toContain(id);
  });
});