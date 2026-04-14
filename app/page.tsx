import { createAgentAction, updatePrivacyAction } from "@/app/actions";
import { buildProfileViewModel } from "@/domain/agent";
import { agentRepository } from "@/data/agent-repository";
import { resolveSelectedAgent } from "@/services/agent-service";

const visibilityChoices = ["public", "private", "restricted"] as const;

export default async function HomePage({
  searchParams
}: {
  searchParams?: Promise<{
    agentId?: string;
  }>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const selectedAgent = await resolveSelectedAgent(agentRepository, resolvedSearchParams.agentId);
  const profile = selectedAgent ? buildProfileViewModel(selectedAgent) : null;

  return (
    <main className="noise min-h-screen px-4 py-6 text-ink-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-3 border-b border-ink-950/10 pb-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-ink-800/70">MBTI / local slice</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Agent identity, privacy, and provenance.</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-800/75">
              Create an agent, inspect the public profile, and change privacy defaults without exposing private fields to the client or chain adapter.
            </p>
          </div>
          <div className="rounded-full border border-ink-950/10 bg-white/50 px-4 py-2 text-xs font-medium text-ink-800 shadow-soft backdrop-blur">
            {profile ? `Selected ${profile.summary.handle}` : "No agent selected"}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_1.3fr_0.9fr]">
          <article className="animate-rise rounded-[28px] border border-ink-950/10 bg-white/70 p-6 shadow-soft backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-800/60">Create agent</p>
                <h2 className="mt-2 text-xl font-semibold">Capture the first record</h2>
              </div>
              <span className="rounded-full bg-ink-950 px-3 py-1 text-xs font-medium text-paper-50">P0 slice</span>
            </div>

            <form action={createAgentAction} className="mt-6 space-y-4">
              <Field label="Display name" name="displayName" placeholder="Aster Vale" />
              <Field label="Handle" name="handle" placeholder="aster" />
              <Field label="Headline" name="headline" placeholder="Identity steward for a live memory stream" />
              <Field label="Public bio" name="publicBio" placeholder="Tracks my public work, private notes, and consent state." textarea />
              <Field label="Contact email" name="contactEmail" placeholder="aster@example.com" />
              <Field label="Private note" name="privateNote" placeholder="Owner-only note stored server-side." textarea />

              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center rounded-full bg-accent-600 px-5 text-sm font-semibold text-white transition hover:bg-accent-500"
              >
                Create agent
              </button>
            </form>
          </article>

          <article className="animate-rise rounded-[28px] border border-ink-950/10 bg-ink-950 p-6 text-paper-50 shadow-soft" style={{ animationDelay: "80ms" }}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-paper-50/60">Public profile</p>
                <h2 className="mt-2 text-xl font-semibold">View profile</h2>
              </div>
              <div className="rounded-full border border-paper-50/15 px-3 py-1 text-xs text-paper-50/70">{profile ? "Live data" : "Waiting for first agent"}</div>
            </div>

            {profile ? (
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <p className="text-4xl font-semibold tracking-tight">{profile.summary.displayName}</p>
                  <p className="font-mono text-sm text-paper-50/70">{profile.summary.handle}</p>
                  <p className="max-w-xl text-sm leading-6 text-paper-50/82">{profile.summary.headline}</p>
                </div>

                <div className="border-t border-paper-50/10 pt-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-paper-50/55">Public bio</p>
                  <p className="mt-2 text-sm leading-6 text-paper-50/82">{profile.summary.publicBio}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {profile.privacy.map((item) => (
                    <KeyValue key={item.label} label={item.label} value={item.value} subdued />
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[24px] border border-dashed border-paper-50/15 px-5 py-6 text-sm leading-6 text-paper-50/72">
                No agent exists yet. Use the create form to persist the first record, then the profile and privacy panels will populate from Postgres.
              </div>
            )}
          </article>

          <aside className="animate-rise rounded-[28px] border border-ink-950/10 bg-white/70 p-6 shadow-soft backdrop-blur" style={{ animationDelay: "140ms" }}>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-800/60">Privacy defaults</p>
              <h2 className="mt-2 text-xl font-semibold">Change visibility</h2>
            </div>

            {profile ? (
              <>
                <form action={updatePrivacyAction} className="mt-6 space-y-4">
                  <input type="hidden" name="agentId" value={selectedAgent?.agent.id ?? ""} />
                  <SelectField label="Profile visibility" name="profileVisibility" defaultValue={profile.privacy[0]?.value as (typeof visibilityChoices)[number]} />
                  <SelectField label="Activity visibility" name="activityVisibility" defaultValue={profile.privacy[1]?.value as (typeof visibilityChoices)[number]} />
                  <SelectField label="Contact visibility" name="contactVisibility" defaultValue={profile.privacy[2]?.value as (typeof visibilityChoices)[number]} />
                  <button
                    type="submit"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-ink-950/12 bg-ink-950 px-5 text-sm font-semibold text-paper-50 transition hover:translate-y-[-1px]"
                  >
                    Save defaults
                  </button>
                </form>

                <div className="mt-6 space-y-4 border-t border-ink-950/10 pt-5">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-800/60">Owner record</p>
                    <div className="mt-3 space-y-3">
                      {profile.ownerRecord.map((item) => (
                        <KeyValue key={item.label} label={item.label} value={item.value + " · " + item.scope} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-800/60">Append-only events</p>
                    <div className="mt-3 space-y-3">
                      {profile.events.map((item) => (
                        <KeyValue key={item.label + item.value} label={item.label} value={item.value} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.24em] text-ink-800/60">Chain boundary</p>
                    <div className="mt-3 space-y-3">
                      {profile.chain.map((item) => (
                        <KeyValue key={item.label} label={item.label} value={item.value} />
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-6 text-sm leading-6 text-ink-800/70">Privacy controls are disabled until an agent exists.</p>
            )}
          </aside>
        </section>

        <section className="grid gap-4 rounded-[28px] border border-ink-950/10 bg-white/50 p-5 shadow-soft backdrop-blur md:grid-cols-3">
          {[
            ["1", "Create agent", "Persists the first row and an initial activity event."],
            ["2", "View profile", "Renders public profile data from Postgres with masked owner-only fields."],
            ["3", "Change privacy", "Appends a new event and updates the current snapshot."]
          ].map(([step, title, copy]) => (
            <div key={step} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-950 text-sm font-semibold text-paper-50">{step}</div>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="mt-1 text-sm leading-6 text-ink-800/70">{copy}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  textarea = false
}: {
  label: string;
  name: string;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={4}
          required
          className="w-full rounded-2xl border border-ink-950/10 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition placeholder:text-ink-800/35 focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
        />
      ) : (
        <input
          name={name}
          placeholder={placeholder}
          required
          className="h-11 w-full rounded-2xl border border-ink-950/10 bg-white px-4 text-sm text-ink-950 outline-none transition placeholder:text-ink-800/35 focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue: (typeof visibilityChoices)[number];
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-ink-800">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-2xl border border-ink-950/10 bg-white px-4 text-sm text-ink-950 outline-none transition focus:border-accent-500 focus:ring-4 focus:ring-accent-500/10"
      >
        {visibilityChoices.map((choice) => (
          <option key={choice} value={choice}>
            {choice}
          </option>
        ))}
      </select>
    </label>
  );
}

function KeyValue({
  label,
  value,
  subdued = false
}: {
  label: string;
  value: string;
  subdued?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-ink-950/10 bg-white/80 px-4 py-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-800/60">{label}</p>
      <p className={`mt-1 text-sm leading-6 ${subdued ? "text-paper-50/82" : "text-ink-800"}`}>{value}</p>
    </div>
  );
}
