"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addFeatureToPlan(planId: string, formData: FormData) {
  const featureId = formData.get("featureId") as string;

  await prisma.planFeature.create({
    data: {
      planId,
      featureId,
    },
  });

  revalidatePath(`/dashboard/apps/.*/plans/${planId}`);
}