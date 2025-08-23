"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPlan(appId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const baseFee = parseFloat(formData.get("baseFee") as string);
  const billingCycle = formData.get("billingCycle") as string;

  await prisma.plan.create({
    data: {
      name,
      description,
      baseFee,
      billingCycle,
      clientAppId: appId,
      allowance: {},
    },
  });

  revalidatePath(`/dashboard/apps/${appId}/plans`);
}