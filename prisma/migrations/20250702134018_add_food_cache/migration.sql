-- CreateTable
CREATE TABLE "FoodCache" (
    "id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "page" INTEGER NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FoodCache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodCache_query_page_key" ON "FoodCache"("query", "page");
