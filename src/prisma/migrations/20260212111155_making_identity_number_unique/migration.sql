/*
  Warnings:

  - A unique constraint covering the columns `[identity_number]` on the table `CnicExtraction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CnicExtraction_identity_number_key" ON "CnicExtraction"("identity_number");
