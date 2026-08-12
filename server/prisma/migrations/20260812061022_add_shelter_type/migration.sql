-- CreateEnum
CREATE TYPE "ShelterType" AS ENUM ('HUMAN', 'ANIMAL', 'VET');

-- AlterTable
ALTER TABLE "Shelter" ADD COLUMN     "type" "ShelterType" NOT NULL DEFAULT 'HUMAN';
