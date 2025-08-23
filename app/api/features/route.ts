import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Create a new feature
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { clientAppId, name, description } = body;

        // Validation
        if(!clientAppId || !name) {
            return NextResponse.json(
                { success: false, error: 'clientAppId and name are required' },
                { status: 400 }
            );
        }

        // Check if feature with the same name exists for this client app
        const exsitingFeature = await prisma.feature.findFirst({
            where: {
                clientAppId,
                name
            }
        });

        if(exsitingFeature) {
            return NextResponse.json(
                { success: false, error: 'Feature with this name already exists for this client app' },
                { status: 409 }
            )
        };

        const feature = await prisma.feature.create({
            data: {
                clientAppId,
                name,
                description
            },
            include: {
                planFeatures: true
            }
        });

        return NextResponse.json({ success: true, data: feature}, { status: 201})
    } catch (error) {
       console.error('Error creating feature:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create feature' },
            { status: 500 }
        ); 
    }
}