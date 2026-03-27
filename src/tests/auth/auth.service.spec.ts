import bcrypt from "bcrypt";
import { prisma } from "../../config/prismaClient.js";
import { validateAdminCredentials } from "../../modules/auth/auth.service.js";

describe("AuthService - validateAdminCredentials", () => {
  const adminEmail = "test-admin@pratica.com";
  const adminPassword = "test1234";

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

  it("returns a token for valid credentials", async () => {
    const result = await validateAdminCredentials(adminEmail, adminPassword);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty("token");
    expect(typeof result!.token).toBe("string");
  });

  it("returns null for non-existing email", async () => {
    const result = await validateAdminCredentials(
      "nonexistent@pratica.com",
      adminPassword,
    );

    expect(result).toBeNull();
  });

  it("returns null for invalid password", async () => {
    const result = await validateAdminCredentials(adminEmail, "wrong-pass");

    expect(result).toBeNull();
  });
});