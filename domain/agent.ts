import { z } from "zod";

export const visibilityValues = ["public", "private", "restricted"] as const;
export type Visibility = (typeof visibilityValues)[number];

export const createAgentSchema = z.object({
  displayName: z.string().min(2).max(80),
  handle: z
    .string()
    .min(2)
    .max(30)
    .transform((value) => value.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "")),
  headline: z.string().min(2).max(120),
  publicBio: z.string().min(10).max(280),
  contactEmail: z.string().email().optional().or(z.literal("")),
  privateNote: z.string().max(500).optional().or(z.literal(""))
});

export const updatePrivacySchema = z.object({
  agentId: z.string().min(1),
  profileVisibility: z.enum(visibilityValues),
  activityVisibility: z.enum(visibilityValues),
  contactVisibility: z.enum(visibilityValues)
});

export interface AgentRecord {
  id: string;
  slug: string;
  handle: string;
  displayName: string;
  headline: string;
  publicBio: string;
  contactEmail: string | null;
  privateNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySettingsRecord {
  id: string;
  agentId: string;
  profileVisibility: Visibility;
  activityVisibility: Visibility;
  contactVisibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityEventRecord {
  id: string;
  agentId: string;
  type: "AGENT_CREATED" | "PRIVACY_DEFAULTS_CHANGED";
  payload: Record<string, unknown>;
  createdAt: Date;
}

export interface AgentAggregate {
  agent: AgentRecord;
  privacy: PrivacySettingsRecord;
  events: ActivityEventRecord[];
}

export interface PublicAgentCommitment {
  agentId: string;
  slug: string;
  handle: string;
  displayName: string;
  privacy: PrivacySettingsRecord;
}

export interface ProfileViewModel {
  summary: {
    displayName: string;
    handle: string;
    headline: string;
    publicBio: string;
    status: string;
  };
  ownerRecord: Array<{ label: string; value: string; scope: string }>;
  privacy: Array<{ label: string; value: string }>;
  events: Array<{ label: string; value: string }>;
  chain: Array<{ label: string; value: string }>;
}

function maskValue(value: string | null, visibility: Visibility) {
  if (!value) {
    return "Not provided";
  }

  if (visibility === "public") {
    return value;
  }

  if (visibility === "restricted") {
    return "Owner-only";
  }

  return "Hidden";
}

export function buildPublicAgentCommitment(aggregate: AgentAggregate): PublicAgentCommitment {
  return {
    agentId: aggregate.agent.id,
    slug: aggregate.agent.slug,
    handle: aggregate.agent.handle,
    displayName: aggregate.agent.displayName,
    privacy: aggregate.privacy
  };
}

export function buildProfileViewModel(aggregate: AgentAggregate): ProfileViewModel {
  return {
    summary: {
      displayName: aggregate.agent.displayName,
      handle: `@${aggregate.agent.handle}`,
      headline: aggregate.agent.headline,
      publicBio: aggregate.agent.publicBio,
      status: `Created ${aggregate.agent.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })}`
    },
    ownerRecord: [
      { label: "Contact email", value: maskValue(aggregate.agent.contactEmail, aggregate.privacy.contactVisibility), scope: aggregate.privacy.contactVisibility },
      { label: "Private note", value: maskValue(aggregate.agent.privateNote, "restricted"), scope: "restricted" }
    ],
    privacy: [
      { label: "Profile visibility", value: aggregate.privacy.profileVisibility },
      { label: "Activity visibility", value: aggregate.privacy.activityVisibility },
      { label: "Contact visibility", value: aggregate.privacy.contactVisibility }
    ],
    events: aggregate.events.map((event) => ({
      label: event.type === "AGENT_CREATED" ? "Agent created" : "Privacy defaults changed",
      value: new Date(event.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
      })
    })),
    chain: [
      { label: "Commitment payload", value: "Server-side only" },
      { label: "Private fields", value: "Excluded from chain adapter" }
    ]
  };
}
