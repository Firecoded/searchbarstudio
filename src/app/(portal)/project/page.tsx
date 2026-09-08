import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getSession } from "@/lib/session";
import { getProjectByUserId, getProjectUpdates } from "@/lib/project";
import { PageHeader } from "@/components/portal/page-header";
import { ProjectView } from "@/components/portal/project-view";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function ProjectPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.user.role === "admin") redirect("/admin");

  const project = await getProjectByUserId(session.user.id);

  return (
    <>
      <PageHeader title="Your project" />
      {project ? (
        <div className="mt-9">
          <ProjectView
            project={project}
            updates={await getProjectUpdates(project.id)}
          />
        </div>
      ) : (
        <section className="mt-9 rounded-2xl border border-border bg-paper p-6">
          <p className="text-[15px] leading-[1.55] text-muted">
            Your project will show up here once we kick off. I&rsquo;ll be in
            touch soon.
          </p>
        </section>
      )}
    </>
  );
}
