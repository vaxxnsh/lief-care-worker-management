/*
  Warnings:

  - The values [LEFT] on the enum `AttendanceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AttendanceStatus_new" AS ENUM ('PRESENT', 'ABSENT', 'CHECKED_OUT');
ALTER TABLE "public"."Attendance" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "public"."Attendance" ALTER COLUMN "status" TYPE "public"."AttendanceStatus_new" USING ("status"::text::"public"."AttendanceStatus_new");
ALTER TYPE "public"."AttendanceStatus" RENAME TO "AttendanceStatus_old";
ALTER TYPE "public"."AttendanceStatus_new" RENAME TO "AttendanceStatus";
DROP TYPE "public"."AttendanceStatus_old";
ALTER TABLE "public"."Attendance" ALTER COLUMN "status" SET DEFAULT 'ABSENT';
COMMIT;
