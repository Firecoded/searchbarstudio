"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import {
  project,
  projectUpdate,
  PROJECT_STAGES,
  type ProjectStage,
} from "@/db/schema";
import { sendEmail } from "@/lib/email";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";
const CONTACT_TO = process.env.CONTACT_TO ?? "searchbarstudio@gmail.com";

export type ProjectActionState = { ok: boolean; error?: string };

async function getAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === "admin" ? session : null;
}

function str(formData: FormData, key: string) {
  return ((formData.get(key) as string) ?? "").trim();
}

function isStage(value: string): value is ProjectStage {
  return (PROJECT_STAGES as readonly string[]).includes(value);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Admin: create the project when kicking off, seeded with the proposal the
// client will confirm. One project per client for now.
export async function createProject(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const userId = str(formData, "userId");
  const title = str(formData, "title");
  if (!userId) return { ok: false, error: "Missing client." };
  if (!title) return { ok: false, error: "Please add a project title." };

  const existing = await db.query.project.findFirst({
    where: eq(project.userId, userId),
  });
  if (existing) return { ok: false, error: "This client already has a project." };

  await db.insert(project).values({
    id: randomUUID(),
    userId,
    title,
    stage: "kickoff",
    proposalIntro: str(formData, "proposalIntro") || null,
    scope: str(formData, "scope") || null,
    estimate: str(formData, "estimate") || null,
    brief: str(formData, "brief") || null,
  });

  revalidatePath(`/clients/${userId}`);
  return { ok: true };
}

// Admin: edit the project's fields (title, proposal copy, brief, links).
export async function updateProjectFields(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const id = str(formData, "projectId");
  if (!id) return { ok: false, error: "Missing project." };
  const existing = await db.query.project.findFirst({
    where: eq(project.id, id),
  });
  if (!existing) return { ok: false, error: "Project not found." };

  const title = str(formData, "title");
  if (!title) return { ok: false, error: "Please add a project title." };

  await db
    .update(project)
    .set({
      title,
      proposalIntro: str(formData, "proposalIntro") || null,
      scope: str(formData, "scope") || null,
      estimate: str(formData, "estimate") || null,
      brief: str(formData, "brief") || null,
      needsFromClient: str(formData, "needsFromClient") || null,
      mocksUrl: str(formData, "mocksUrl") || null,
      previewUrl: str(formData, "previewUrl") || null,
      liveUrl: str(formData, "liveUrl") || null,
    })
    .where(eq(project.id, id));

  revalidatePath(`/clients/${existing.userId}`);
  revalidatePath("/project");
  return { ok: true };
}

// Admin: clear the "what I need from you" ask once the client has sent it,
// without opening the full details form.
export async function clearProjectNeeds(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const id = str(formData, "projectId");
  const existing = await db.query.project.findFirst({
    where: eq(project.id, id),
  });
  if (!existing) return { ok: false, error: "Project not found." };

  await db
    .update(project)
    .set({ needsFromClient: null })
    .where(eq(project.id, id));

  revalidatePath(`/clients/${existing.userId}`);
  revalidatePath("/project");
  return { ok: true };
}

// Admin: post a timeline entry. One call, three outcomes: a note (body only),
// a status change (stage only), or a combined entry (both). A stage change
// also advances the project's current stage.
export async function postUpdate(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const projectId = str(formData, "projectId");
  const body = str(formData, "body");
  const toStageRaw = str(formData, "toStage");

  const existing = await db.query.project.findFirst({
    where: eq(project.id, projectId),
  });
  if (!existing) return { ok: false, error: "Project not found." };

  const fromStage = existing.stage;
  const stageChanged =
    toStageRaw !== "" && isStage(toStageRaw) && toStageRaw !== fromStage;

  if (!body && !stageChanged) {
    return { ok: false, error: "Add a note or change the stage." };
  }

  await db.insert(projectUpdate).values({
    id: randomUUID(),
    projectId,
    body: body || null,
    fromStage: stageChanged ? fromStage : null,
    toStage: stageChanged ? toStageRaw : null,
  });

  if (stageChanged) {
    await db
      .update(project)
      .set({ stage: toStageRaw })
      .where(eq(project.id, projectId));
  }

  revalidatePath(`/clients/${existing.userId}`);
  revalidatePath("/project");
  revalidatePath("/dashboard");
  return { ok: true };
}

// Admin: fix a typo in an entry's note (stage chips are left as posted).
export async function editUpdate(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const id = str(formData, "updateId");
  const entry = await db.query.projectUpdate.findFirst({
    where: eq(projectUpdate.id, id),
  });
  if (!entry) return { ok: false, error: "Update not found." };

  await db
    .update(projectUpdate)
    .set({ body: str(formData, "body") || null })
    .where(eq(projectUpdate.id, id));

  const parent = await db.query.project.findFirst({
    where: eq(project.id, entry.projectId),
  });
  if (parent) revalidatePath(`/clients/${parent.userId}`);
  revalidatePath("/project");
  return { ok: true };
}

// Admin: remove an entry entirely (a mistake). Does not roll the stage back.
export async function deleteUpdate(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  if (!(await getAdmin())) return { ok: false, error: "Not authorized." };

  const id = str(formData, "updateId");
  const entry = await db.query.projectUpdate.findFirst({
    where: eq(projectUpdate.id, id),
  });
  if (!entry) return { ok: false, error: "Update not found." };

  await db.delete(projectUpdate).where(eq(projectUpdate.id, id));

  const parent = await db.query.project.findFirst({
    where: eq(project.id, entry.projectId),
  });
  if (parent) revalidatePath(`/clients/${parent.userId}`);
  revalidatePath("/project");
  return { ok: true };
}

// Client: confirm the proposal. Records acceptance (with a frozen snapshot of
// the agreed scope + estimate), logs a timeline entry, and emails the admin.
// Scoped to the signed-in client's own project; never gates the project.
export async function acceptProposal(
  _prev: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { ok: false, error: "Please sign in again." };

  // In production, don't let an admin accept on a client's behalf while
  // impersonating (viewing-as shouldn't become acting). Left enabled in dev so
  // the flow stays testable.
  if (session.session.impersonatedBy && process.env.NODE_ENV === "production") {
    return {
      ok: false,
      error: "You're viewing as this client, so accepting is disabled.",
    };
  }

  const projectId = str(formData, "projectId");
  if (formData.get("agree") == null) {
    return { ok: false, error: "Please accept the build terms to continue." };
  }

  const proj = await db.query.project.findFirst({
    where: eq(project.id, projectId),
  });
  if (!proj || proj.userId !== session.user.id) {
    return { ok: false, error: "Project not found." };
  }
  if (proj.acceptedAt) return { ok: true }; // already accepted, no-op

  const acceptedAt = new Date();
  const snapshot = JSON.stringify({
    scope: proj.scope ?? "",
    estimate: proj.estimate ?? "",
    acceptedBy: { name: session.user.name, email: session.user.email },
    acceptedAt: acceptedAt.toISOString(),
  });

  await db
    .update(project)
    .set({ acceptedAt, acceptedSnapshot: snapshot })
    .where(eq(project.id, projectId));

  await db.insert(projectUpdate).values({
    id: randomUUID(),
    projectId,
    body: "Project accepted.",
  });

  // Notify the admin (production only, to skip dev noise). Plain internal email.
  if (process.env.NODE_ENV === "production") {
    try {
      await sendEmail({
        to: CONTACT_TO,
        subject: `${session.user.name} accepted their project proposal`,
        html: [
          `<p style="margin:0 0 10px"><strong>${escapeHtml(session.user.name)}</strong> (${escapeHtml(session.user.email)}) accepted the proposal for <strong>${escapeHtml(proj.title)}</strong>.</p>`,
          proj.estimate
            ? `<p style="margin:0 0 10px"><strong>Estimate:</strong> ${escapeHtml(proj.estimate)}</p>`
            : "",
          `<p style="margin:16px 0 0"><a href="${APP_URL}/clients/${proj.userId}">Open the client in the portal</a></p>`,
        ]
          .filter(Boolean)
          .join(""),
      });
    } catch {
      // Don't fail the client's acceptance if the notification email bounces.
    }
  }

  revalidatePath("/project");
  revalidatePath("/dashboard");
  return { ok: true };
}
