import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { withCors } from "@/lib/cors";

export async function POST(req: Request) {
  try {
    const apiKey = "pk_2e1f9a14dde96429925889d327161607"
    // req.headers.get("x-api-key");

    if (!apiKey) {
      return withCors(
        NextResponse.json(
          { success: false, error: "API key is required" },
          { status: 401 }
        )
      );
    }

    const { userId, unitType, amount } = await req.json();

    if (!userId || !unitType || !amount) {
      return withCors(
        NextResponse.json(
          {
            success: false,
            error: "userId, unitType, and amount are required",
          },
          { status: 400 }
        )
      );
    }

    const app = await prisma.clientApp.findUnique({
      where: { apiKey },
    });

    if (!app) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Invalid API key" },
          { status: 404 }
        )
      );
    }

    const user = await prisma.appUser.findUnique({
      where: { externalId: userId },
    });

    if (!user) {
      return withCors(
        NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        )
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        plan: {
          clientAppId: app.id,
          features: {
            some: {
              feature: {
                name: unitType,
              },
            },
          },
        },
      },
      include: {
        plan: {
          include: {
            features: {
              where: {
                feature: {
                  name: unitType,
                },
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      return withCors(
        NextResponse.json(
          { success: false, error: "Subscription not found" },
          { status: 404 }
        )
      );
    }

    const planFeature = subscription.plan.features[0];
    const config = planFeature.config as any;

    if (config && config.limit) {
      const usage = await prisma.usageRecord.aggregate({
        where: {
          userId: user.id,
          unitType,
          recordedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)), // TODO: Make this dynamic
          },
        },
        _sum: {
          amount: true,
        },
      });

      if (usage._sum.amount && usage._sum.amount >= config.limit) {
        return withCors(
          NextResponse.json(
            { success: false, error: "Usage limit exceeded" },
            { status: 429 }
          )
        );
      }
    }

    const usageRecord = await prisma.usageRecord.create({
      data: {
        userId: user.id,
        unitType,
        amount,
        resetPeriod: "monthly", // This should be dynamic based on the plan
      },
    });

    return withCors(NextResponse.json({ success: true, data: usageRecord }));
  } catch (error) {
    console.error("Error incrementing usage:", error);
    return withCors(
      NextResponse.json(
        { success: false, error: "Failed to increment usage" },
        { status: 500 }
      )
    );
  }
}