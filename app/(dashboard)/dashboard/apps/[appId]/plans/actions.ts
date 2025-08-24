"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPlan(appId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const pricingModel = formData.get("pricingModel") as string;

  let data: any = {
    name,
    description,
    clientAppId: appId,
  };

  if (pricingModel === "subscription") {
    data.baseFee = parseFloat(formData.get("baseFee") as string);
    data.billingCycle = formData.get("billingCycle") as string;
    data.allowance = {};
  } else if (pricingModel === "pay-as-you-go") {
    data.baseFee = 0;
    data.billingCycle = "monthly";
    data.overage = {
      enabled: true,
      ratePerUnit: parseFloat(formData.get("ratePerUnit") as string),
    };
  } else if (pricingModel === "tiered") {
    // TODO: Implement logic for handling tiers
  }

  await prisma.plan.create({ data });

  revalidatePath(`/dashboard/apps/${appId}/plans`);
}