-- CreateEnum
CREATE TYPE "IncidentTarget" AS ENUM ('HUMAN', 'ANIMAL', 'BOTH');

-- DropForeignKey
ALTER TABLE "Incident" DROP CONSTRAINT "Incident_reportedById_fkey";

-- AlterTable
ALTER TABLE "Incident" ADD COLUMN     "reporterName" TEXT,
ADD COLUMN     "reporterPhone" TEXT,
ADD COLUMN     "target" "IncidentTarget" NOT NULL DEFAULT 'HUMAN',
ALTER COLUMN "reportedById" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_reportedById_fkey" FOREIGN KEY ("reportedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
