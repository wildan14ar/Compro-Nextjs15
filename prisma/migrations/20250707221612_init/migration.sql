/*
  Warnings:

  - You are about to drop the column `status` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "status",
ADD COLUMN     "isPublished" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "Status";
