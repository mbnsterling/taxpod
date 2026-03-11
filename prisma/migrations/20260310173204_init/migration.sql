-- CreateEnum
CREATE TYPE "TaxpayerType" AS ENUM ('INDIVIDUAL', 'SOLE_TRADER', 'COMPANY', 'PARTNERSHIP', 'NON_PROFIT');

-- CreateEnum
CREATE TYPE "UserTaxpayerRole" AS ENUM ('OWNER', 'ADMIN', 'ACCOUNTANT', 'VIEWER');

-- CreateEnum
CREATE TYPE "IncomeType" AS ENUM ('SALARY', 'FREELANCE', 'RENTAL', 'BUSINESS', 'INVESTMENT', 'DIGITAL_ASSET_GAIN', 'DIGITAL_ASSET_BUSINESS', 'OTHER');

-- CreateEnum
CREATE TYPE "SupplyCategory" AS ENUM ('STANDARD', 'ZERO_RATED', 'EXEMPT');

-- CreateEnum
CREATE TYPE "DigitalAssetCapacity" AS ENUM ('TRADING', 'INVESTMENT');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('PIT', 'VAT', 'CIT', 'CGT', 'DEVELOPMENT_LEVY', 'WHT');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('DRAFT', 'READY_TO_FILE', 'FILED', 'AMENDED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PeriodType" AS ENUM ('ANNUAL', 'MONTHLY', 'QUARTERLY');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CARD', 'BANK_TRANSFER', 'USSD', 'CASH', 'WALLET', 'OTHER');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "refresh_token_expires_in" INTEGER,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "passwordHash" TEXT,
    "verificationToken" TEXT,
    "verificationTokenExpires" TIMESTAMP(3),
    "resetPasswordToken" TEXT,
    "resetPasswordTokenExpires" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Taxpayer" (
    "id" TEXT NOT NULL,
    "type" "TaxpayerType" NOT NULL,
    "displayName" TEXT NOT NULL,
    "tin" TEXT,
    "countryCode" TEXT NOT NULL DEFAULT 'NG',
    "residentState" TEXT,
    "annualTurnover" DECIMAL(20,2),
    "fixedAssetsValue" DECIMAL(20,2),
    "isSmallEnterprise" BOOLEAN NOT NULL DEFAULT false,
    "isMultinational" BOOLEAN NOT NULL DEFAULT false,
    "hasVATRegistration" BOOLEAN NOT NULL DEFAULT false,
    "vatRegistrationDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taxpayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxpayerUser" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "role" "UserTaxpayerRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TaxpayerUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeEntry" (
    "id" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "taxReturnId" TEXT,
    "taxYear" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "incomeType" "IncomeType" NOT NULL,
    "description" TEXT,
    "grossAmount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "isVatable" BOOLEAN NOT NULL DEFAULT false,
    "vatCollectedAmount" DECIMAL(20,2),
    "supplyCategory" "SupplyCategory" NOT NULL DEFAULT 'STANDARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IncomeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpenseEntry" (
    "id" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "taxReturnId" TEXT,
    "taxYear" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "isBusinessExpense" BOOLEAN NOT NULL DEFAULT true,
    "shouldHaveVAT" BOOLEAN NOT NULL DEFAULT false,
    "vatPaidAmount" DECIMAL(20,2),
    "vatDocumented" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DigitalAssetPosition" (
    "id" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "capacity" "DigitalAssetCapacity" NOT NULL,
    "assetSymbol" TEXT NOT NULL,
    "acquisitionDate" TIMESTAMP(3) NOT NULL,
    "acquisitionCost" DECIMAL(20,2) NOT NULL,
    "disposalDate" TIMESTAMP(3),
    "disposalProceeds" DECIMAL(20,2),
    "realisedGainLoss" DECIMAL(20,2),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigitalAssetPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxReturn" (
    "id" TEXT NOT NULL,
    "taxpayerId" TEXT NOT NULL,
    "taxType" "TaxType" NOT NULL,
    "periodType" "PeriodType" NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "ReturnStatus" NOT NULL DEFAULT 'DRAFT',
    "filedAt" TIMESTAMP(3),
    "reference" TEXT,
    "summaryJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxPayment" (
    "id" TEXT NOT NULL,
    "taxReturnId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NGN',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "method" "PaymentMethod" NOT NULL,
    "paidAt" TIMESTAMP(3),
    "providerReference" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TaxPayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PITBandConfig" (
    "id" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "lowerBound" DECIMAL(20,2) NOT NULL,
    "upperBound" DECIMAL(20,2),
    "rate" DECIMAL(5,4) NOT NULL,
    "description" TEXT,
    "taxpayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PITBandConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VATConfig" (
    "id" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "standardRate" DECIMAL(5,4) NOT NULL,
    "registrationThreshold" DECIMAL(20,2) NOT NULL,
    "taxpayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VATConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ZeroRatedCategory" (
    "id" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ZeroRatedCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Taxpayer_tin_key" ON "Taxpayer"("tin");

-- CreateIndex
CREATE UNIQUE INDEX "TaxpayerUser_userId_taxpayerId_key" ON "TaxpayerUser"("userId", "taxpayerId");

-- CreateIndex
CREATE INDEX "IncomeEntry_taxpayerId_taxYear_idx" ON "IncomeEntry"("taxpayerId", "taxYear");

-- CreateIndex
CREATE INDEX "ExpenseEntry_taxpayerId_taxYear_idx" ON "ExpenseEntry"("taxpayerId", "taxYear");

-- CreateIndex
CREATE INDEX "DigitalAssetPosition_taxpayerId_assetSymbol_idx" ON "DigitalAssetPosition"("taxpayerId", "assetSymbol");

-- CreateIndex
CREATE UNIQUE INDEX "TaxReturn_reference_key" ON "TaxReturn"("reference");

-- CreateIndex
CREATE INDEX "TaxReturn_taxpayerId_taxType_taxYear_idx" ON "TaxReturn"("taxpayerId", "taxType", "taxYear");

-- CreateIndex
CREATE INDEX "TaxPayment_taxReturnId_idx" ON "TaxPayment"("taxReturnId");

-- CreateIndex
CREATE INDEX "PITBandConfig_taxYear_idx" ON "PITBandConfig"("taxYear");

-- CreateIndex
CREATE UNIQUE INDEX "VATConfig_taxYear_key" ON "VATConfig"("taxYear");

-- CreateIndex
CREATE INDEX "ZeroRatedCategory_taxYear_idx" ON "ZeroRatedCategory"("taxYear");

-- CreateIndex
CREATE UNIQUE INDEX "ZeroRatedCategory_taxYear_code_key" ON "ZeroRatedCategory"("taxYear", "code");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxpayerUser" ADD CONSTRAINT "TaxpayerUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxpayerUser" ADD CONSTRAINT "TaxpayerUser_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeEntry" ADD CONSTRAINT "IncomeEntry_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeEntry" ADD CONSTRAINT "IncomeEntry_taxReturnId_fkey" FOREIGN KEY ("taxReturnId") REFERENCES "TaxReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseEntry" ADD CONSTRAINT "ExpenseEntry_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpenseEntry" ADD CONSTRAINT "ExpenseEntry_taxReturnId_fkey" FOREIGN KEY ("taxReturnId") REFERENCES "TaxReturn"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DigitalAssetPosition" ADD CONSTRAINT "DigitalAssetPosition_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxReturn" ADD CONSTRAINT "TaxReturn_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxPayment" ADD CONSTRAINT "TaxPayment_taxReturnId_fkey" FOREIGN KEY ("taxReturnId") REFERENCES "TaxReturn"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PITBandConfig" ADD CONSTRAINT "PITBandConfig_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VATConfig" ADD CONSTRAINT "VATConfig_taxpayerId_fkey" FOREIGN KEY ("taxpayerId") REFERENCES "Taxpayer"("id") ON DELETE SET NULL ON UPDATE CASCADE;
