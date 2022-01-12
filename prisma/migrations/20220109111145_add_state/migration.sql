/*
  Warnings:

  - You are about to drop the column `default` on the `UserAddress` table. All the data in the column will be lost.
  - Added the required column `state` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddress" DROP COLUMN "default",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "state" TEXT NOT NULL;
