-- CreateEnum
CREATE TYPE "ColorMode" AS ENUM ('RGB', 'CMYK', 'Grayscale');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "owner_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "thumbnail_url" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "width" INTEGER NOT NULL DEFAULT 1920,
    "height" INTEGER NOT NULL DEFAULT 1080,
    "dpi" INTEGER NOT NULL DEFAULT 72,
    "color_mode" "ColorMode" NOT NULL,
    "background_color" VARCHAR(7),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_edited_at" TIMESTAMP(3),
    "is_archived" BOOLEAN NOT NULL DEFAULT false,
    "view_count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_owner_id" ON "Project"("owner_id");

-- CreateIndex
CREATE INDEX "idx_is_public" ON "Project"("is_public");

-- CreateIndex
CREATE INDEX "idx_title_desc" ON "Project"("title", "description");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "User_email_idx" RENAME TO "idx_email";

-- RenameIndex
ALTER INDEX "User_username_idx" RENAME TO "idx_username";
