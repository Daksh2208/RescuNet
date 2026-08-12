-- CreateEnum
CREATE TYPE "ReunificationType" AS ENUM ('HUMAN', 'PET');

-- CreateEnum
CREATE TYPE "ReunificationStatus" AS ENUM ('MISSING', 'FOUND');

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "isAiProcessed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ReunificationPost" (
    "id" TEXT NOT NULL,
    "type" "ReunificationType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "age" TEXT,
    "lastSeen" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "imageUrl" TEXT,
    "status" "ReunificationStatus" NOT NULL DEFAULT 'MISSING',
    "reportedById" TEXT NOT NULL,
    "foundById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReunificationPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReunificationPost" ADD CONSTRAINT "ReunificationPost_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReunificationPost" ADD CONSTRAINT "ReunificationPost_foundById_fkey" FOREIGN KEY ("foundById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
