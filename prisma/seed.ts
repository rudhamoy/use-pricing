import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import * as dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  const masterClient = await prisma.client.upsert({
    where: { email: "master@example.com" },
    update: {},
    create: {
      name: "Master Client",
      email: "master@example.com",
      apiKey: `pk_${randomBytes(16).toString("hex")}`,
    },
  });

  let clientApp = await prisma.clientApp.findFirst({
    where: { name: "My SaaS App", clientId: masterClient.id },
  });

  if (!clientApp) {
    clientApp = await prisma.clientApp.create({
      data: {
        name: "My SaaS App",
        clientId: masterClient.id,
        apiKey: `pk_${randomBytes(16).toString("hex")}`,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });