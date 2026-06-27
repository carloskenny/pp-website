ALTER TYPE "TripStatus" ADD VALUE IF NOT EXISTS 'canceled';

ALTER TABLE "Trip"
ADD COLUMN "eventDate" TIMESTAMP(3),
ADD COLUMN "departureTime" TEXT,
ADD COLUMN "description" TEXT,
ADD COLUMN "itinerary" JSONB,
ADD COLUMN "includedItems" JSONB,
ADD COLUMN "mainImageUrl" TEXT;
