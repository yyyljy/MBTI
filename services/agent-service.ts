import {
  buildPublicAgentCommitment,
  createAgentSchema,
  updatePrivacySchema,
  type AgentAggregate,
  type PrivacySettingsRecord,
  type PublicAgentCommitment
} from "@/domain/agent";
import type { ChainAdapter } from "@/infra/chain-adapter";
import type { z } from "zod";

export interface AgentRepository {
  createAgent(input: z.infer<typeof createAgentSchema>): Promise<AgentAggregate>;
  findAgentById(agentId: string): Promise<AgentAggregate | null>;
  findLatestAgent(): Promise<AgentAggregate | null>;
  updatePrivacyDefaults(input: z.infer<typeof updatePrivacySchema>): Promise<AgentAggregate>;
}

export interface CreateAgentCommand {
  displayName: string;
  handle: string;
  headline: string;
  publicBio: string;
  contactEmail?: string;
  privateNote?: string;
}

export interface UpdatePrivacyCommand {
  agentId: string;
  profileVisibility: PrivacySettingsRecord["profileVisibility"];
  activityVisibility: PrivacySettingsRecord["activityVisibility"];
  contactVisibility: PrivacySettingsRecord["contactVisibility"];
}

export async function createAgentWorkflow(
  repository: AgentRepository,
  chain: ChainAdapter,
  rawInput: CreateAgentCommand
): Promise<{ aggregate: AgentAggregate; commitment: PublicAgentCommitment; txHash: string }> {
  const input = createAgentSchema.parse(rawInput);
  const aggregate = await repository.createAgent(input);
  const commitment = buildPublicAgentCommitment(aggregate);
  const result = await chain.publishAgentCommitment(commitment);

  return {
    aggregate,
    commitment,
    txHash: result.txHash
  };
}

export async function updatePrivacyWorkflow(repository: AgentRepository, rawInput: UpdatePrivacyCommand) {
  const input = updatePrivacySchema.parse(rawInput);
  return repository.updatePrivacyDefaults(input);
}

export async function resolveSelectedAgent(repository: AgentRepository, agentId?: string) {
  if (agentId) {
    return repository.findAgentById(agentId);
  }

  return repository.findLatestAgent();
}
