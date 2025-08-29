"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addFeatureToPlan(planId: string, formData: FormData) {
  const featureIds = (formData.get("featureIds") as string).split(",");

  await prisma.planFeature.deleteMany({
    where: { planId },
  });

  await prisma.planFeature.createMany({
    data: featureIds.map((featureId) => ({
      planId,
      featureId,
    })),
  });

  revalidatePath(`/dashboard/apps/.*/plans/${planId}`);
}

export async function removeFeatureFromPlan(planId: string, featureId: string) {
  await prisma.planFeature.delete({
    where: {
      planId_featureId: {
        planId,
        featureId,
      },
    },
  });

  revalidatePath(`/dashboard/apps/.*/plans/${planId}`);
}

export async function updateFeatureConfig(
  planFeatureId: string,
  formData: FormData
) {
  const config = formData.get("config") as string;

  await prisma.planFeature.update({
    where: { id: planFeatureId },
    data: {
      config: JSON.parse(config),
    },
  });

  revalidatePath(`/dashboard/apps/.*/plans/.*`);
}