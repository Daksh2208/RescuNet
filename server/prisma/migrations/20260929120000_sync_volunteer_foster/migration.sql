-- CreateEnum
CREATE TYPE "public"."AnimalType" AS ENUM ('DOG', 'CAT', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."FosterStatus" AS ENUM ('OPEN', 'FOSTERED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('AVAILABLE', 'CLAIMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."VolunteerTaskType" AS ENUM ('SUPPLY_DELIVERY', 'DEBRIS_CLEARING', 'MEDICAL_TRANSPORT', 'ANIMAL_FOSTER', 'OTHER');

-- AlterTable
ALTER TABLE "public"."Shelter" ADD COLUMN     "needs" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateTable
CREATE TABLE "public"."FosterRequest" (
    "id" TEXT NOT NULL,
    "petName" TEXT NOT NULL,
    "animalType" "public"."AnimalType" NOT NULL DEFAULT 'DOG',
    "breed" TEXT,
    "description" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "shelterId" TEXT,
    "status" "public"."FosterStatus" NOT NULL DEFAULT 'OPEN',
    "createdById" TEXT NOT NULL,
    "fosterVolunteerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isMedicalNeeds" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "FosterRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VolunteerTask" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "public"."VolunteerTaskType" NOT NULL DEFAULT 'SUPPLY_DELIVERY',
    "priority" "public"."Severity" NOT NULL DEFAULT 'MEDIUM',
    "status" "public"."TaskStatus" NOT NULL DEFAULT 'AVAILABLE',
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "claimedById" TEXT,
    "claimedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VolunteerTask_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FosterRequest" ADD CONSTRAINT "FosterRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FosterRequest" ADD CONSTRAINT "FosterRequest_fosterVolunteerId_fkey" FOREIGN KEY ("fosterVolunteerId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FosterRequest" ADD CONSTRAINT "FosterRequest_shelterId_fkey" FOREIGN KEY ("shelterId") REFERENCES "public"."Shelter"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VolunteerTask" ADD CONSTRAINT "VolunteerTask_claimedById_fkey" FOREIGN KEY ("claimedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;