import {
  PROJECT_STAGE_META,
  stageDescription,
  stageIndex,
  stageLabel,
} from "@/lib/project-stages";
import { AcceptProposal } from "@/components/portal/accept-proposal";
import { ProjectTimeline } from "@/components/portal/project-timeline";
import type { Project, ProjectUpdateRow } from "@/lib/project";

type Row = NonNullable<Project>;

const approvedFmt = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

// The client-facing project view: proposal mode until they accept, then the
// live status view.
export function ProjectView({
  project,
  updates,
}: {
  project: Row;
  updates: ProjectUpdateRow[];
}) {
  return project.acceptedAt ? (
    <LiveView project={project} updates={updates} />
  ) : (
    <ProposalView project={project} />
  );
}

function ProposalView({ project }: { project: Row }) {
  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-serif text-[22px] font-medium">{project.title}</h2>
          <span className="rounded-full bg-sand px-2.5 py-1 text-[12px] font-semibold text-muted">
            Proposal
          </span>
        </div>

        {project.proposalIntro && (
          <p className="mt-4 whitespace-pre-wrap text-[16px] leading-[1.6] text-ink">
            {project.proposalIntro}
          </p>
        )}

        {project.scope && (
          <div className="mt-6">
            <h3 className="font-serif text-[18px] font-medium">The build</h3>
            <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[1.6] text-muted">
              {project.scope}
            </p>
          </div>
        )}

        {project.estimate && (
          <div className="mt-6">
            <h3 className="font-serif text-[18px] font-medium">Estimate</h3>
            <p className="mt-2 text-[15px] text-ink">{project.estimate}</p>
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-serif text-[18px] font-medium">
            What happens next
          </h3>
          <p className="mt-2 text-[15px] leading-[1.6] text-muted">
            Confirm below and I&rsquo;ll get started. I&rsquo;ll send the
            invoice separately, and you can follow every step right here.
          </p>
        </div>
      </section>

      <AcceptProposal projectId={project.id} />
    </div>
  );
}

function LiveView({ project, updates }: { project: Row; updates: ProjectUpdateRow[] }) {
  // The build the client approved, frozen at acceptance so it doesn't drift.
  let agreed: { scope?: string; estimate?: string } | null = null;
  if (project.acceptedSnapshot) {
    try {
      agreed = JSON.parse(project.acceptedSnapshot);
    } catch {
      agreed = null;
    }
  }

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <h2 className="font-serif text-[22px] font-medium">{project.title}</h2>
          <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
            {stageLabel(project.stage)}
          </span>
        </div>

        <div className="mt-6">
          <Stepper current={project.stage} />
        </div>

        <p className="mt-4 text-[14px] leading-[1.55] text-muted">
          {stageDescription(project.stage)}
        </p>

        <LinksRow project={project} />
      </section>

      {project.needsFromClient && (
        <section className="rounded-2xl border border-accent/25 bg-accent-soft/60 p-6 sm:p-8">
          <h3 className="font-serif text-[18px] font-medium">
            What I need from you
          </h3>
          <p className="mt-2 whitespace-pre-wrap text-[15px] leading-[1.6] text-ink">
            {project.needsFromClient}
          </p>
        </section>
      )}

      {(agreed?.scope || agreed?.estimate) && (
        <details className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
          <summary className="cursor-pointer font-serif text-[18px] font-medium">
            Build details
          </summary>
          {agreed.scope && (
            <div className="mt-3">
              <div className="text-[13px] font-semibold text-muted">Scope</div>
              <p className="mt-1 whitespace-pre-wrap text-[15px] leading-[1.6] text-muted">
                {agreed.scope}
              </p>
            </div>
          )}
          {agreed.estimate && (
            <div className="mt-4">
              <div className="text-[13px] font-semibold text-muted">
                Estimate
              </div>
              <p className="mt-1 text-[15px] text-ink">{agreed.estimate}</p>
            </div>
          )}
          <p className="mt-4 text-[13px] text-faint">
            This is the build you approved
            {project.acceptedAt
              ? ` on ${approvedFmt.format(project.acceptedAt)}`
              : ""}
            .
          </p>
        </details>
      )}

      {project.brief && (
        <details
          open
          className="rounded-2xl border border-border bg-paper p-6 sm:p-8"
        >
          <summary className="cursor-pointer font-serif text-[18px] font-medium">
            Project brief
          </summary>
          <p className="mt-3 whitespace-pre-wrap text-[15px] leading-[1.6] text-muted">
            {project.brief}
          </p>
        </details>
      )}

      <section className="rounded-2xl border border-border bg-paper p-6 sm:p-8">
        <h3 className="font-serif text-[18px] font-medium">Updates</h3>
        <ProjectTimeline updates={updates} />
      </section>
    </div>
  );
}

function Stepper({ current }: { current: string }) {
  const currentIdx = stageIndex(current);
  return (
    <ol className="flex flex-wrap gap-x-5 gap-y-3">
      {PROJECT_STAGE_META.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s.value} className="flex items-center gap-2">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                active
                  ? "bg-accent ring-4 ring-accent-soft"
                  : done
                    ? "bg-accent"
                    : "bg-[#e2d6c5]"
              }`}
            />
            <span
              className={`text-[14px] ${
                active
                  ? "font-semibold text-ink"
                  : done
                    ? "text-ink"
                    : "text-faint"
              }`}
            >
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function LinksRow({ project }: { project: Row }) {
  const links = [
    { label: "View mocks", href: project.mocksUrl },
    { label: "View preview", href: project.previewUrl },
    { label: "Visit site", href: project.liveUrl },
  ];
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((l) =>
        l.href ? (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl border border-border bg-ground px-4 py-2 text-[14px] font-semibold text-ink transition-colors hover:border-accent"
          >
            {l.label}
          </a>
        ) : (
          <span
            key={l.label}
            className="rounded-xl border border-dashed border-border-soft px-4 py-2 text-[14px] font-semibold text-faint"
          >
            {l.label}
            <span className="ml-1.5 text-[12px] font-medium">· when ready</span>
          </span>
        ),
      )}
    </div>
  );
}
