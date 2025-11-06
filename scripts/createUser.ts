import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@example.com",
      password: passwordHash,
    },
  });

  console.log("User created:", user);
}

main().catch(console.error).finally(() => prisma.$disconnect());
