-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('deleted', 'active', 'banned');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('deleted', 'active');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('pending', 'deleted', 'cancelled', 'received');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "number" VARCHAR(20) NOT NULL,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "UserStatus" NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0.00,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "ProductStatus" NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "product_count" INTEGER NOT NULL,
    "total_price" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "status" "PurchaseStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_number_key" ON "User"("number");

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
