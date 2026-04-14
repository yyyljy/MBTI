import type { PublicAgentCommitment } from "@/domain/agent";

export interface ChainAdapter {
  publishAgentCommitment(commitment: PublicAgentCommitment): Promise<{ txHash: string }>;
}

export const chainAdapter: ChainAdapter = {
  async publishAgentCommitment(commitment) {
    void commitment;
    return { txHash: "chain-stub" };
  }
};
