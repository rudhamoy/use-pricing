"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createFeature(appId: string, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  await prisma.feature.create({
    data: {
      name,
      description,
      clientAppId: appId,
    },
  });

  revalidatePath(`/dashboard/apps/${appId}`);
}