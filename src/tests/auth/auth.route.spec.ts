import request from "supertest";
import bcrypt from "bcrypt";
import { createApp } from "../../app.js";
import { prisma } from "../../config/prismaClient.js";

const app = createApp();

describe("Auth Routes - POST /api/auth/login", () => {
  const adminEmail = "route-admin@pratica.com";
  const adminPassword = "route1234";

  beforeAll(async () => {
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    await prisma.admin.upsert({
      where: { email: adminEmail },
      update: { password: passwordHash },
      create: { email: adminEmail, password: passwordHash },
    });
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({
      where: { email: adminEmail },
    });

    await prisma.$disconnect();
  });

  it("should return 200 and token with valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password: adminPassword });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
  });

  it("should return 401 with invalid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail, password: "wrong" });

    expect(res.status).toBe(401);
  });

  it("should return 400 when email or password is missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: adminEmail });

    expect(res.status).toBe(400);
  });
});