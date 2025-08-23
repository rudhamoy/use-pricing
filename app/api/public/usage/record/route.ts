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

    const { userId, unitType, amount } = await req.json();

    if (!userId || !unitType || !amount) {
      return NextResponse.json(
        { success: false, error: "userId, unitType, and amount are required" },
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

    const usageRecord = await prisma.usageRecord.create({
      data: {
        userId,
        unitType,
        amount,
        resetPeriod: "monthly", // This should be dynamic based on the plan
      },
    });

    return NextResponse.json({ success: true, data: usageRecord });
  } catch (error) {
    console.error("Error recording usage:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record usage" },
      { status: 500 }
    );
  }
}