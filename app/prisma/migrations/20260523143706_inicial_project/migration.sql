-- CreateEnum
CREATE TYPE "TripStatus" AS ENUM ('draft', 'active', 'sold_out', 'finished', 'inactive');

-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('pending', 'payment_pending', 'confirmed', 'canceled');

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "dateLabel" TEXT NOT NULL,
    "type" TEXT,
    "difficulty" TEXT,
    "duration" TEXT,
    "price" DECIMAL(10,2),
    "capacity" INTEGER,
    "summary" TEXT,
    "paymentLink" TEXT,
    "whatsappLink" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "cpf" TEXT,
    "birthDate" TIMESTAMP(3),
    "boardingPointId" TEXT,
    "notes" TEXT,
    "status" "ReservationStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripBoardingPoint" (
    "id" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TripBoardingPoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_slug_key" ON "Trip"("slug");

-- CreateIndex
CREATE INDEX "Reservation_tripId_idx" ON "Reservation"("tripId");

-- CreateIndex
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");

-- CreateIndex
CREATE INDEX "TripBoardingPoint_tripId_idx" ON "TripBoardingPoint"("tripId");

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_boardingPointId_fkey" FOREIGN KEY ("boardingPointId") REFERENCES "TripBoardingPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripBoardingPoint" ADD CONSTRAINT "TripBoardingPoint_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE CASCADE ON UPDATE CASCADE;
