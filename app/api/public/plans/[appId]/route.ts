import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { appId: string } }
) {
  try {
    const apiKey = req.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "API key is required" },
        { status: 401 }
      );
    }

    const app = await prisma.clientApp.findUnique({
      where: { id: params.appId, apiKey },
      include: {
        plans: {
          include: {
            features: {
              include: {
                feature: true,
              },
            },
          },
        },
      },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "Invalid API key or App ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: app.plans });
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch plans" },
      { status: 500 }
    );
  }
}