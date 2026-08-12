-- CreateEnum
CREATE TYPE "CommunityPostType" AS ENUM ('OFFER', 'REQUEST');

-- CreateTable
CREATE TABLE "CommunityPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "type" "CommunityPostType" NOT NULL,
    "category" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "userId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommunityPost_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
