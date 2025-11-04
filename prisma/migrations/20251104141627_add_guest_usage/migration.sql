-- CreateTable
CREATE TABLE "guest_usage" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "ipAddress" INET NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "userAgent" TEXT,
    "videoId" UUID NOT NULL,
    "usedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "country" TEXT,
    "city" TEXT,

    CONSTRAINT "guest_usage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "guest_usage_ipAddress_idx" ON "guest_usage"("ipAddress");

-- CreateIndex
CREATE INDEX "guest_usage_fingerprint_idx" ON "guest_usage"("fingerprint");

-- CreateIndex
CREATE INDEX "guest_usage_ipAddress_fingerprint_idx" ON "guest_usage"("ipAddress", "fingerprint");
