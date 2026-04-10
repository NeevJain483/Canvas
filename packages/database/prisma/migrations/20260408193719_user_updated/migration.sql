/*
  Warnings:

  - You are about to drop the column `created_At` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionLevel" AS ENUM ('free', 'pro', 'enterprise');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "created_At",
ADD COLUMN     "ban_reason" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_banned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login" TIMESTAMP(3),
ADD COLUMN     "profile_pic_url" TEXT,
ADD COLUMN     "subscription_id" VARCHAR(255),
ADD COLUMN     "subscription_level" "SubscriptionLevel" NOT NULL DEFAULT 'free',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password_hash" SET DATA TYPE VARCHAR(255);

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");
