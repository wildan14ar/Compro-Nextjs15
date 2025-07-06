/*
  Warnings:

  - You are about to drop the column `EmailVerified` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "EmailVerified",
ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;
