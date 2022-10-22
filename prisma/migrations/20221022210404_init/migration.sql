-- CreateTable
CREATE TABLE "currency" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "decimals" INTEGER NOT NULL,
    "symbol" TEXT NOT NULL,
    "shortSymbol" TEXT,
    "iconSrc" TEXT,
    "mint" TEXT NOT NULL,
    "usdRate" DECIMAL,
    "solRate" DECIMAL,

    CONSTRAINT "currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flip" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "currencyId" UUID NOT NULL,
    "userId" TEXT NOT NULL,
    "betAmount" BIGINT NOT NULL,
    "flipsPrediction" INTEGER NOT NULL,
    "flipsResult" INTEGER NOT NULL,
    "timeCreated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "txid1" TEXT NOT NULL,
    "txid2" TEXT NOT NULL,

    CONSTRAINT "flip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "username" TEXT,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "currency_name_key" ON "currency"("name");

-- CreateIndex
CREATE UNIQUE INDEX "currency_symbol_key" ON "currency"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "currency_mint_key" ON "currency"("mint");

-- AddForeignKey
ALTER TABLE "flip" ADD CONSTRAINT "flip_currencyId_fkey" FOREIGN KEY ("currencyId") REFERENCES "currency"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "flip" ADD CONSTRAINT "flip_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
