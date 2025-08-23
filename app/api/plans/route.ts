import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Create a new Plan
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      clientAppId,
      name,
      description,
      baseFee,
      billingCycle,
      allowance,
      overage,
      isActive = true,
      features = [] // optional: [{ featureId, config? }]
    } = body;

    // Basic validation
    if (!clientAppId || !name || baseFee === undefined || !billingCycle || !allowance) {
      return NextResponse.json(
        { error: "clientAppId, name, baseFee, billingCycle, and allowance are required" },
        { status: 400 }
      );
    }

    // Create plan and associate features in one transaction
    const result = await prisma.$transaction(async (tx) => {
      // Step 1: Create the plan
      const plan = await tx.plan.create({
        data: {
          clientAppId,
          name,
          description,
          baseFee,
          billingCycle,
          allowance,
          overage,
          isActive,
        },
      });

      // Step 2: If features provided, create plan-feature relations
      if (features.length > 0) {
        await tx.planFeature.createMany({
          data: features.map((f: any) => ({
            planId: plan.id,
            featureId: f.featureId,
            config: f.config ?? null,
          })),
        });
      }

      // Step 3: Return hydrated plan (with features)
      return tx.plan.findUnique({
        where: { id: plan.id },
        include: {
          features: {
            include: { feature: true }, // include feature details
          },
        },
      });
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}