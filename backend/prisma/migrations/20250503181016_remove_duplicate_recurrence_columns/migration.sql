/*
  Warnings:

  - You are about to drop the column `recurrenceCustom` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `recurrenceType` on the `Task` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Task" DROP COLUMN "recurrenceCustom",
DROP COLUMN "recurrenceType",
ADD COLUMN     "recurringCustom" JSONB,
ADD COLUMN     "recurringFrequency" TEXT;
