/*
  Warnings:

  - A unique constraint covering the columns `[planId,featureId]` on the table `PlanFeature` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PlanFeature_planId_featureId_key" ON "public"."PlanFeature"("planId", "featureId");
