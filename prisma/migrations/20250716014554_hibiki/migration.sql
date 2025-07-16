-- CreateTable
CREATE TABLE "Restaurant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "price_range" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_address_key" ON "Restaurant"("address");
