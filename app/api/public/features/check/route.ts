import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 401 }
      );
    }

    const { userId, featureName } = await req.json();

    if (!userId || !featureName) {
      return NextResponse.json(
        { success: false, error: "userId and featureName are required" },
        { status: 400 }
      );
    }

    const app = await prisma.clientApp.findUnique({
      where: { apiKey },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Invalid API key" },
        { status: 404 }
      );
    }

    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        plan: {
          clientAppId: app.id,
          features: {
            some: {
              feature: {
                name: featureName,
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
                  name: featureName,
                },
              },
            },
          },
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({ success: true, data: { hasAccess: false } });
    }

    const planFeature = subscription.plan.features[0];
    const config = planFeature.config as any;

    if (config && config.limit) {
      const usage = await prisma.usageRecord.aggregate({
        where: {
          userId,
          unitType: featureName,
          recordedAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)), // TODO: Make this dynamic
          },
        },
        _sum: {
          amount: true,
        },
      });

      if (usage._sum.amount && usage._sum.amount >= config.limit) {
        return NextResponse.json({ success: true, data: { hasAccess: false } });
      }
    }

    return NextResponse.json({ success: true, data: { hasAccess: true } });
  } catch (error) {
    console.error("Error checking feature access:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check feature access" },
      { status: 500 }
    );
  }
}