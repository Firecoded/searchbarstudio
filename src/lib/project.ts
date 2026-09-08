import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { project, projectUpdate } from "@/db/schema";

// The client's project (one per client for now; newest if that ever changes).
// Used by both the client's own page and the admin view of a client.
export async function getProjectByUserId(userId: string) {
  return db.query.project.findFirst({
    where: eq(project.userId, userId),
    orderBy: [desc(project.createdAt)],
  });
}

// Full timeline, newest first. A project won't accumulate enough entries to
// need pagination; the UI shows the recent few with an inline "show all".
export async function getProjectUpdates(projectId: string) {
  return db.query.projectUpdate.findMany({
    where: eq(projectUpdate.projectId, projectId),
    orderBy: [desc(projectUpdate.createdAt)],
  });
}

export type Project = Awaited<ReturnType<typeof getProjectByUserId>>;
export type ProjectUpdateRow = Awaited<
  ReturnType<typeof getProjectUpdates>
>[number];
