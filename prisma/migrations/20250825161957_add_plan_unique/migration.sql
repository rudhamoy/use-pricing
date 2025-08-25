/*
  Warnings:

  - A unique constraint covering the columns `[name,clientAppId]` on the table `Plan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Plan_name_clientAppId_key" ON "public"."Plan"("name", "clientAppId");
