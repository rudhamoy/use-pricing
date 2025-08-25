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

  let imageFeature = await prisma.feature.findFirst({
    where: { name: "Image Generation", clientAppId: clientApp.id },
  });

  if (!imageFeature) {
    imageFeature = await prisma.feature.create({
      data: {
        name: "Image Generation",
        description: "Generate AI-powered images.",
        clientAppId: clientApp.id,
      },
    });
  }

  const freePlan = await prisma.plan.upsert({
    where: { name_clientAppId: { name: "Free", clientAppId: clientApp.id } },
    update: {},
    create: {
      name: "Free",
      description: "The free plan.",
      baseFee: 0,
      billingCycle: "monthly",
      clientAppId: clientApp.id,
      allowance: {},
    },
  });

  await prisma.planFeature.upsert({
    where: {
      planId_featureId: {
        planId: freePlan.id,
        featureId: imageFeature.id,
      },
    },
    update: {},
    create: {
      planId: freePlan.id,
      featureId: imageFeature.id,
      config: {
        limit: 5,
      },
    },
  });

  const testUser = await prisma.appUser.upsert({
    where: { externalId: "user_31mpSXElvQnxSuu54aqckSzBdeb" },
    update: {},
    create: {
      externalId: "user_31mpSXElvQnxSuu54aqckSzBdeb",
      clientAppId: clientApp.id,
    },
  });

  await prisma.subscription.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      planId: freePlan.id,
      status: "active",
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });