import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { agentRepository } from "@/data/agent-repository";
import { chainAdapter } from "@/infra/chain-adapter";
import { createAgentWorkflow, updatePrivacyWorkflow } from "@/services/agent-service";

export async function createAgentAction(formData: FormData) {
  "use server";

  const result = await createAgentWorkflow(agentRepository, chainAdapter, {
    displayName: String(formData.get("displayName") ?? ""),
    handle: String(formData.get("handle") ?? ""),
    headline: String(formData.get("headline") ?? ""),
    publicBio: String(formData.get("publicBio") ?? ""),
    contactEmail: String(formData.get("contactEmail") ?? ""),
    privateNote: String(formData.get("privateNote") ?? "")
  });

  revalidatePath("/");
  redirect(`/?agentId=${result.aggregate.agent.id}`);
}

export async function updatePrivacyAction(formData: FormData) {
  "use server";

  const agentId = String(formData.get("agentId") ?? "");
  const result = await updatePrivacyWorkflow(agentRepository, {
    agentId,
    profileVisibility: String(formData.get("profileVisibility") ?? "public") as "public" | "private" | "restricted",
    activityVisibility: String(formData.get("activityVisibility") ?? "private") as "public" | "private" | "restricted",
    contactVisibility: String(formData.get("contactVisibility") ?? "restricted") as "public" | "private" | "restricted"
  });

  revalidatePath("/");
  redirect(`/?agentId=${result.agent.id}`);
}
