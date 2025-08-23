import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Create a new plan-feature association
// Will use this api when we connect the feature with our plan
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { planId, featureId, config } = body;

        // Validation
        if(!planId || !featureId) {
            return NextResponse.json(
                { success: false, error: 'planId and featureId are required' },
                { status: 400 }
            )
        }

        // Check if the plan and feature exist
        const [plan, feature ] = await Promise.all([
            prisma.plan.findUnique({ where: { id: planId }}),
            prisma.feature.findUnique({ where: { id: featureId }})
        ]);

        if(!plan) {
            return NextResponse.json(
                { success: false, error: 'Plan not found' },
                { status: 404 }
            )
        };

        if(!feature) {
            return NextResponse.json(
                { success: false, error: 'Feature not found' },
                { status: 404 }
            )
        };

        // Check if association already exists
        const existingAssociation = await prisma.planFeature.findFirst({
            where: { planId, featureId }
        });

        if(existingAssociation) {
            return NextResponse.json(
                { success: false, error: 'Plan-feature association already exists ' },
                { status: 409 }
            )
        };

        const planFeature = await prisma.planFeature.create({
            data: {
                planId,
                featureId,
                config: config || null
            },
            include: {
                plan: true,
                feature: true
            }
        });

        return NextResponse.json({ success: true, data: planFeature }, { status: 201 })

    } catch (error) {
        console.error('Error creating plan feature:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create plan feature association' },
            { status: 500 }
        );
    }
}