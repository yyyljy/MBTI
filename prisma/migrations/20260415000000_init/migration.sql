CREATE TYPE "Visibility" AS ENUM ('public', 'private', 'restricted');
CREATE TYPE "ActivityEventType" AS ENUM ('AGENT_CREATED', 'PRIVACY_DEFAULTS_CHANGED');

CREATE TABLE "Agent" (
  "id" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "handle" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "headline" TEXT NOT NULL,
  "publicBio" TEXT NOT NULL,
  "contactEmail" TEXT,
  "privateNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PrivacySettings" (
  "id" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "profileVisibility" "Visibility" NOT NULL DEFAULT 'public',
  "activityVisibility" "Visibility" NOT NULL DEFAULT 'private',
  "contactVisibility" "Visibility" NOT NULL DEFAULT 'restricted',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PrivacySettings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ActivityEvent" (
  "id" TEXT NOT NULL,
  "agentId" TEXT NOT NULL,
  "type" "ActivityEventType" NOT NULL,
  "payload" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ActivityEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Agent_slug_key" ON "Agent"("slug");
CREATE UNIQUE INDEX "Agent_handle_key" ON "Agent"("handle");
CREATE UNIQUE INDEX "PrivacySettings_agentId_key" ON "PrivacySettings"("agentId");
CREATE INDEX "Agent_createdAt_idx" ON "Agent"("createdAt");
CREATE INDEX "PrivacySettings_agentId_idx" ON "PrivacySettings"("agentId");
CREATE INDEX "ActivityEvent_agentId_createdAt_idx" ON "ActivityEvent"("agentId", "createdAt");

ALTER TABLE "PrivacySettings"
ADD CONSTRAINT "PrivacySettings_agentId_fkey"
FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ActivityEvent"
ADD CONSTRAINT "ActivityEvent_agentId_fkey"
FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
