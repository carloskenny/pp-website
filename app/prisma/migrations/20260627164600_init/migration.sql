/*
  Warnings:

  - The `difficulty` column on the `Trip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "TripExperienceType" AS ENUM ('trail', 'tour', 'camping', 'expedition');

-- CreateEnum
CREATE TYPE "TripAttractionType" AS ENUM ('mountain', 'trail', 'viewpoint', 'waterfall', 'canyon', 'river_aquatrekking', 'beach', 'rappel', 'bungee_jump', 'cave', 'sunrise', 'sunset');

-- CreateEnum
CREATE TYPE "TripDifficulty" AS ENUM ('easy', 'moderate', 'hard', 'very_hard');

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "experienceType" "TripExperienceType" NOT NULL DEFAULT 'trail',
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "TripDifficulty" NOT NULL DEFAULT 'moderate';

-- CreateTable
CREATE TABLE "TripInterest" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "type" "TripAttractionType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TripInterest_tripId_idx" ON "TripInterest"("tripId");

-- CreateIndex
CREATE UNIQUE INDEX "TripInterest_tripId_type_key" ON "TripInterest"("tripId", "type");

-- AddForeignKey
ALTER TABLE "TripInterest" ADD CONSTRAINT "TripInterest_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
