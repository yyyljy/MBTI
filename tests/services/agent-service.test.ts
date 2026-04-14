import { describe, expect, it, vi } from "vitest";
import type { AgentAggregate } from "@/domain/agent";
import { createAgentWorkflow, updatePrivacyWorkflow } from "@/services/agent-service";

describe("agent workflows", () => {
  it("publishes only the public commitment when creating an agent", async () => {
    const repository = {
      async createAgent(input: {
        displayName: string;
        handle: string;
        headline: string;
        publicBio: string;
        contactEmail?: string;
        privateNote?: string;
      }) {
        expect(input.displayName).toBe("Aster Vale");
        const aggregate = {
          agent: {
            id: "agent_1",
            slug: "aster-01",
            handle: input.handle,
            displayName: input.displayName,
            headline: input.headline,
            publicBio: input.publicBio,
            contactEmail: input.contactEmail ?? null,
            privateNote: input.privateNote ?? null,
            createdAt: new Date("2026-04-15T00:00:00.000Z"),
            updatedAt: new Date("2026-04-15T00:00:00.000Z")
          },
          privacy: {
            id: "privacy_1",
            agentId: "agent_1",
            profileVisibility: "public",
            activityVisibility: "private",
            contactVisibility: "restricted",
            createdAt: new Date("2026-04-15T00:00:00.000Z"),
            updatedAt: new Date("2026-04-15T00:00:00.000Z")
          },
          events: []
        } satisfies AgentAggregate;

        return aggregate;
      },
      async findAgentById() {
        return null;
      },
      async findLatestAgent() {
        return null;
      },
      async updatePrivacyDefaults() {
        throw new Error("not used");
      }
    };

    const publishAgentCommitment = vi.fn().mockResolvedValue({ txHash: "chain-stub" });
    const result = await createAgentWorkflow(repository, { publishAgentCommitment }, {
      displayName: "Aster Vale",
      handle: "Aster",
      headline: "Identity steward",
      publicBio: "Tracks public work and private notes.",
      contactEmail: "aster@example.com",
      privateNote: "Do not leak."
    });

    expect(result.txHash).toBe("chain-stub");
    expect(publishAgentCommitment).toHaveBeenCalledTimes(1);
    expect(publishAgentCommitment.mock.calls[0]?.[0]).toMatchObject({
      agentId: "agent_1",
      slug: "aster-01",
      handle: "aster"
    });
    expect(publishAgentCommitment.mock.calls[0]?.[0]).not.toHaveProperty("contactEmail");
    expect(publishAgentCommitment.mock.calls[0]?.[0]).not.toHaveProperty("privateNote");
  });

  it("updates privacy defaults through the repository workflow", async () => {
    const updatedAggregate = {
      agent: {
        id: "agent_1",
        slug: "aster-01",
        handle: "aster",
        displayName: "Aster Vale",
        headline: "Identity steward",
        publicBio: "Tracks public work and private notes.",
        contactEmail: "aster@example.com",
        privateNote: "Do not leak.",
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
        updatedAt: new Date("2026-04-15T00:00:00.000Z")
      },
      privacy: {
        id: "privacy_1",
        agentId: "agent_1",
        profileVisibility: "private",
        activityVisibility: "restricted",
        contactVisibility: "public",
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
        updatedAt: new Date("2026-04-15T00:00:00.000Z")
      },
      events: []
    } satisfies AgentAggregate;

    const updatePrivacyDefaults = vi.fn().mockResolvedValue(updatedAggregate);

    const result = await updatePrivacyWorkflow(
      {
        async createAgent() {
          throw new Error("not used");
        },
        async findAgentById() {
          return null;
        },
        async findLatestAgent() {
          return null;
        },
        updatePrivacyDefaults
      },
      {
        agentId: "agent_1",
        profileVisibility: "private",
        activityVisibility: "restricted",
        contactVisibility: "public"
      }
    );

    expect(updatePrivacyDefaults).toHaveBeenCalledWith({
      agentId: "agent_1",
      profileVisibility: "private",
      activityVisibility: "restricted",
      contactVisibility: "public"
    });
    expect(result.privacy.contactVisibility).toBe("public");
  });
});
