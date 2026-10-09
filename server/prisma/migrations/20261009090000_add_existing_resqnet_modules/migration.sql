-- CreateEnum
CREATE TYPE "public"."FleetAssetStatus" AS ENUM ('AVAILABLE', 'DEPLOYED', 'MAINTENANCE', 'DECOMMISSIONED');

-- CreateEnum
CREATE TYPE "public"."FleetAssetType" AS ENUM ('VEHICLE', 'AQUATIC', 'AERIAL', 'HEAVY_TOOLS', 'MEDICAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."ReportStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "public"."ActionReport" (
    "id" TEXT NOT NULL,
    "reportCode" TEXT NOT NULL,
    "missionId" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "hazardNotes" TEXT,
    "totalRescued" INTEGER NOT NULL DEFAULT 0,
    "casualties" INTEGER NOT NULL DEFAULT 0,
    "animalsRescued" INTEGER NOT NULL DEFAULT 0,
    "assetsLost" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ReportStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "filedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActionReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FleetAsset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assetCode" TEXT NOT NULL,
    "type" "public"."FleetAssetType" NOT NULL DEFAULT 'VEHICLE',
    "status" "public"."FleetAssetStatus" NOT NULL DEFAULT 'AVAILABLE',
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "assignedToId" TEXT,
    "lastService" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FleetAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RescueCommsChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RescueCommsChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."RescueCommsMessage" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RescueCommsMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ActionReport_reportCode_key" ON "public"."ActionReport"("reportCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "FleetAsset_assetCode_key" ON "public"."FleetAsset"("assetCode" ASC);

-- AddForeignKey
ALTER TABLE "public"."ActionReport" ADD CONSTRAINT "ActionReport_filedById_fkey" FOREIGN KEY ("filedById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ActionReport" ADD CONSTRAINT "ActionReport_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FleetAsset" ADD CONSTRAINT "FleetAsset_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RescueCommsMessage" ADD CONSTRAINT "RescueCommsMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "public"."RescueCommsChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RescueCommsMessage" ADD CONSTRAINT "RescueCommsMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
