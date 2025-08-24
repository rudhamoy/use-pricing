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

  let feature = await prisma.feature.findFirst({
    where: { name: "Advanced Analytics", clientAppId: clientApp.id },
  });

  if (!feature) {
    feature = await prisma.feature.create({
      data: {
        name: "Advanced Analytics",
        description: "Access to advanced analytics and reporting.",
        clientAppId: clientApp.id,
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