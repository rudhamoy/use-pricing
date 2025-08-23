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
    });

    if (subscription) {
      return NextResponse.json({ success: true, data: { hasAccess: true } });
    } else {
      return NextResponse.json({ success: true, data: { hasAccess: false } });
    }
  } catch (error) {
    console.error("Error checking feature access:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check feature access" },
      { status: 500 }
    );
  }
}