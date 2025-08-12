-- CreateEnum
CREATE TYPE "public"."AttendanceStatus" AS ENUM ('PRESENT', 'ABSENT', 'LEFT');

-- AlterTable
ALTER TABLE "public"."Location" ADD COLUMN     "shiftEnd" TIME(0) NOT NULL DEFAULT '2005-01-25 17:00:00 +00:00',
ADD COLUMN     "shiftStart" TIME(0) NOT NULL DEFAULT '2005-01-25 09:00:00 +00:00';

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "status" "public"."AttendanceStatus" NOT NULL DEFAULT 'ABSENT',
    "date" TIMESTAMP(3) NOT NULL,
    "clockInAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clockInLat" DOUBLE PRECISION NOT NULL,
    "clockInLng" DOUBLE PRECISION NOT NULL,
    "clockOutAt" TIMESTAMP(3),
    "clockOutLat" DOUBLE PRECISION,
    "clockOutLng" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Attendance_userId_clockInAt_idx" ON "public"."Attendance"("userId", "clockInAt");

-- CreateIndex
CREATE INDEX "Attendance_locationId_clockInAt_idx" ON "public"."Attendance"("locationId", "clockInAt");

-- CreateIndex
CREATE INDEX "Attendance_status_createdAt_idx" ON "public"."Attendance"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_userId_organizationId_date_key" ON "public"."Attendance"("userId", "organizationId", "date");

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
