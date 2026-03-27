import "dotenv/config";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "de@praticabr.com";
  const plainPassword = "12345678";

  const existing = await prisma.admin.findUnique({ where: { email } });

  if (existing) {
    console.log("Admin já existe, não será recriado.");
    return;
  }

  const passwordHash = await bcrypt.hash(plainPassword, 10);

  await prisma.admin.create({
    data: {
      email,
      password: passwordHash,
    },
  });

  console.log("Admin criado com sucesso:", email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });