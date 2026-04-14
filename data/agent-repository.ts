import { ActivityEventType, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/data/prisma";
import type { AgentAggregate, AgentRecord, PrivacySettingsRecord, Visibility } from "@/domain/agent";

type DbClient = PrismaClient | Prisma.TransactionClient;

async function loadAggregate(client: DbClient, agentId: string): Promise<AgentAggregate | null> {
  const [agent, privacy, events] = await Promise.all([
    client.agent.findUnique({ where: { id: agentId } }),
    client.privacySettings.findUnique({ where: { agentId } }),
    client.activityEvent.findMany({ where: { agentId }, orderBy: { createdAt: "asc" } })
  ]);

  if (!agent || !privacy) {
    return null;
  }

  return {
    agent: agent as AgentRecord,
    privacy: privacy as PrivacySettingsRecord,
    events: events.map((event) => ({
      id: event.id,
      agentId: event.agentId,
      type: event.type,
      payload: event.payload as Record<string, unknown>,
      createdAt: event.createdAt
    }))
  };
}

export async function createAgent(input: {
  displayName: string;
  handle: string;
  headline: string;
  publicBio: string;
  contactEmail?: string;
  privateNote?: string;
}): Promise<AgentAggregate> {
  const slug = `${input.handle}-${Date.now().toString(36)}`;

  return prisma.$transaction(async (tx) => {
    const agent = await tx.agent.create({
      data: {
        slug,
        handle: input.handle,
        displayName: input.displayName,
        headline: input.headline,
        publicBio: input.publicBio,
        contactEmail: input.contactEmail?.trim() || null,
        privateNote: input.privateNote?.trim() || null
      }
    });

    await tx.privacySettings.create({
      data: {
        agentId: agent.id,
        profileVisibility: "public",
        activityVisibility: "private",
        contactVisibility: "restricted"
      }
    });

    await tx.activityEvent.create({
      data: {
        agentId: agent.id,
        type: ActivityEventType.AGENT_CREATED,
        payload: {
          agentId: agent.id,
          handle: agent.handle,
          displayName: agent.displayName
        } satisfies Prisma.JsonObject
      }
    });

    const aggregate = await loadAggregate(tx, agent.id);
    if (!aggregate) {
      throw new Error("Failed to reload created agent.");
    }

    return aggregate;
  });
}

export async function findAgentById(agentId: string) {
  return loadAggregate(prisma, agentId);
}

export async function findLatestAgent() {
  const latest = await prisma.agent.findFirst({
    orderBy: { createdAt: "desc" }
  });

  if (!latest) {
    return null;
  }

  return loadAggregate(prisma, latest.id);
}

export async function updatePrivacyDefaults(input: {
  agentId: string;
  profileVisibility: Visibility;
  activityVisibility: Visibility;
  contactVisibility: Visibility;
}) {
  return prisma.$transaction(async (tx) => {
    const privacy = await tx.privacySettings.update({
      where: { agentId: input.agentId },
      data: {
        profileVisibility: input.profileVisibility,
        activityVisibility: input.activityVisibility,
        contactVisibility: input.contactVisibility
      }
    });

    await tx.activityEvent.create({
      data: {
        agentId: input.agentId,
        type: ActivityEventType.PRIVACY_DEFAULTS_CHANGED,
        payload: {
          agentId: input.agentId,
          profileVisibility: input.profileVisibility,
          activityVisibility: input.activityVisibility,
          contactVisibility: input.contactVisibility
        } satisfies Prisma.JsonObject
      }
    });

    const aggregate = await loadAggregate(tx, privacy.agentId);
    if (!aggregate) {
      throw new Error("Failed to reload privacy update.");
    }

    return aggregate;
  });
}

export const agentRepository = {
  createAgent,
  findAgentById,
  findLatestAgent,
  updatePrivacyDefaults
};
