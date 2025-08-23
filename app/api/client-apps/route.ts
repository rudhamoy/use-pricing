import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Name is required" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { email: user.emailAddresses[0].emailAddress },
    });

    if (!client) {
      return NextResponse.json(
        { success: false, error: "Client not found" },
        { status: 404 }
      );
    }

    const apiKey = `pk_${randomBytes(16).toString("hex")}`;

    const clientApp = await prisma.clientApp.create({
      data: {
        name,
        clientId: client.id,
        apiKey,
      },
    });

    return NextResponse.json({ success: true, data: clientApp }, { status: 201 });
  } catch (error) {
    console.error("Error creating client app:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create client app" },
      { status: 500 }
    );
  }
}