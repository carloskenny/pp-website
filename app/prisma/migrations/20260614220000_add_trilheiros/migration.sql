DO $$
BEGIN
  CREATE TYPE "TrilheiroStatus" AS ENUM ('INCOMPLETE', 'ACTIVE', 'BLOCKED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "TrilheiroRegistrationStep" AS ENUM ('minimal', 'contact', 'identity', 'complete');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Trilheiro" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT,
  "documentNumber" TEXT,
  "birthDate" TIMESTAMP(3),
  "avatarUrl" TEXT,
  "status" "TrilheiroStatus" NOT NULL DEFAULT 'INCOMPLETE',
  "registrationStep" "TrilheiroRegistrationStep" NOT NULL DEFAULT 'minimal',
  "preferences" JSONB,
  "lastAccessAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "Trilheiro_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Trilheiro_email_key" ON "Trilheiro"("email");

ALTER TABLE "Reservation"
ADD COLUMN IF NOT EXISTS "trilheiroId" TEXT;

DO $$
BEGIN
  ALTER TABLE "Reservation"
    ADD CONSTRAINT "Reservation_trilheiroId_fkey"
    FOREIGN KEY ("trilheiroId") REFERENCES "Trilheiro"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS "Reservation_trilheiroId_idx" ON "Reservation"("trilheiroId");
