import { describe, expect, it } from "vitest";
import { buildProfileViewModel, buildPublicAgentCommitment } from "@/domain/agent";

describe("buildProfileViewModel", () => {
  it("masks owner-only fields while preserving public identity", () => {
    const view = buildProfileViewModel({
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
        profileVisibility: "public",
        activityVisibility: "private",
        contactVisibility: "restricted",
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
        updatedAt: new Date("2026-04-15T00:00:00.000Z")
      },
      events: [
        {
          id: "event_1",
          agentId: "agent_1",
          type: "AGENT_CREATED",
          payload: { agentId: "agent_1" },
          createdAt: new Date("2026-04-15T00:00:00.000Z")
        }
      ]
    });

    expect(view.summary.handle).toBe("@aster");
    expect(view.ownerRecord[0]?.value).toContain("Owner-only");
    expect(view.chain[0]?.value).toBe("Server-side only");
  });
});

describe("buildPublicAgentCommitment", () => {
  it("omits private fields from the adapter payload", () => {
    const commitment = buildPublicAgentCommitment({
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
        profileVisibility: "public",
        activityVisibility: "private",
        contactVisibility: "restricted",
        createdAt: new Date("2026-04-15T00:00:00.000Z"),
        updatedAt: new Date("2026-04-15T00:00:00.000Z")
      },
      events: []
    });

    expect(commitment).toEqual({
      agentId: "agent_1",
      slug: "aster-01",
      handle: "aster",
      displayName: "Aster Vale",
      privacy: expect.any(Object)
    });
    expect("contactEmail" in commitment).toBe(false);
    expect("privateNote" in commitment).toBe(false);
  });
});
