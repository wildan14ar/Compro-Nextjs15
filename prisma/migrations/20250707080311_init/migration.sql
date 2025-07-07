-- DropIndex
DROP INDEX "WebsiteProfile_name_key";

-- AlterTable
ALTER TABLE "WebsiteProfile" ADD COLUMN     "id" TEXT NOT NULL DEFAULT 'singleton',
ADD CONSTRAINT "WebsiteProfile_pkey" PRIMARY KEY ("id");
