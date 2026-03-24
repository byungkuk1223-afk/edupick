-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'STUDENT';

-- AlterTable
ALTER TABLE "Child" ADD COLUMN "studentUserId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Child_studentUserId_key" ON "Child"("studentUserId");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_studentUserId_fkey" FOREIGN KEY ("studentUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
