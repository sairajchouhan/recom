/*
  Warnings:

  - Added the required column `mobileNumber` to the `UserAddress` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `UserAddress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserAddress" ADD COLUMN     "mobileNumber" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
