import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { appId: string } }
) {
  try {
    const app = await prisma.clientApp.findUnique({
      where: { id: params.appId },
      include: { features: true },
    });

    if (!app) {
      return NextResponse.json(
        { success: false, error: "App not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: app.features });
  } catch (error) {
    console.error("Error fetching features:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch features" },
      { status: 500 }
    );
  }
}