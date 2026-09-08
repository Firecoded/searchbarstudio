"use client";

import { useActionState, useEffect, useState } from "react";
import {
  createProject,
  updateProjectFields,
  clearProjectNeeds,
  postUpdate,
  editUpdate,
  deleteUpdate,
  type ProjectActionState,
} from "@/lib/project-actions";
import { PROJECT_STAGE_META, stageLabel } from "@/lib/project-stages";
import type { Project, ProjectUpdateRow } from "@/lib/project";

type Row = NonNullable<Project>;

const field =
  "mt-2 w-full rounded-xl border-[1.5px] border-[#e2d6c5] bg-ground px-4 py-2.5 text-[15px] focus:border-accent focus:outline-none";
const labelCls = "text-[13px] font-semibold text-muted";
const primaryBtn =
  "rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60";
const ghostBtn =
  "rounded-xl border border-border bg-paper px-5 py-2.5 text-[14px] font-semibold text-ink transition-colors hover:bg-ground";
const init: ProjectActionState = { ok: false };
const COLLAPSE_KEY = "sbs:project-details-collapsed";

const stamp = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

function ErrorNote({ state }: { state: ProjectActionState }) {
  if (!state.error) return null;
  return (
    <p className="mt-3 rounded-lg bg-accent-soft px-3 py-2 text-[14px] text-accent">
      {state.error}
    </p>
  );
}

export function ProjectPanel({
  clientId,
  project,
  updates,
}: {
  clientId: string;
  project: Row | null;
  updates: ProjectUpdateRow[];
}) {
  if (!project) return <CreateProject clientId={clientId} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <span className="font-serif text-[17px] font-medium">
          {project.title}
        </span>
        <span className="rounded-full bg-accent-soft px-2.5 py-1 text-[12px] font-semibold text-accent">
          {stageLabel(project.stage)}
        </span>
        <span className="text-[13px] text-muted">
          {project.acceptedAt
            ? `Accepted ${stamp.format(project.acceptedAt)}`
            : "Awaiting client acceptance"}
        </span>
      </div>

      <DetailsEditor project={project} />
      <NeedsCallout project={project} />
      <Composer project={project} />
      <UpdatesList updates={updates} />
    </div>
  );
}

function NeedsCallout({ project }: { project: Row }) {
  const [, action, pending] = useActionState(clearProjectNeeds, init);
  if (!project.needsFromClient) return null;
  return (
    <div className="rounded-2xl border border-accent/25 bg-accent-soft/50 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-serif text-[16px] font-medium">
            What I need from you
          </h3>
          <p className="mt-1 whitespace-pre-wrap text-[14px] leading-[1.55] text-ink">
            {project.needsFromClient}
          </p>
          <p className="mt-2 text-[13px] text-muted">
            Shown to the client. Clear it once they&rsquo;ve sent it over.
          </p>
        </div>
        <form action={action}>
          <input type="hidden" name="projectId" value={project.id} />
          <button
            type="submit"
            disabled={pending}
            className={`${ghostBtn} shrink-0`}
          >
            {pending ? "Clearing…" : "Clear"}
          </button>
        </form>
      </div>
    </div>
  );
}

function CreateProject({ clientId }: { clientId: string }) {
  const [state, action, pending] = useActionState(createProject, init);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-paper p-6 text-center">
        <p className="text-[15px] text-muted">
          No project yet. Create one to author the proposal the client confirms.
        </p>
        <button onClick={() => setOpen(true)} className={`${primaryBtn} mt-4`}>
          Create project
        </button>
      </div>
    );
  }

  return (
    <form action={action} className="rounded-2xl border border-border bg-paper p-6">
      <input type="hidden" name="userId" value={clientId} />
      <h3 className="font-serif text-[18px] font-medium">New project</h3>
      <p className="mt-1 text-[14px] text-muted">
        Seeds the proposal the client sees on first login. Stage starts at
        Kickoff.
      </p>
      <div className="mt-4 space-y-4">
        <TextField
          name="title"
          label="Project title"
          placeholder="Acme website"
          required
        />
        <TextArea
          name="proposalIntro"
          label="Intro"
          hint="a short welcome shown in proposal mode"
          placeholder="Hey Jane, excited to build this with you…"
        />
        <TextArea
          name="scope"
          label="Scope / build outline"
          placeholder={"- 5-page marketing site\n- Booking form\n- Hosting + care plan"}
        />
        <TextField
          name="estimate"
          label="Estimate"
          placeholder="$2,500 build + $50/mo care"
        />
        <TextArea name="brief" label="Brief" hint="fuller pinned details" />
      </div>
      <ErrorNote state={state} />
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Creating…" : "Create project"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[14px] font-medium text-muted hover:text-ink"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Composer({ project }: { project: Row }) {
  const [state, action, pending] = useActionState(postUpdate, init);

  // Uncontrolled fields: React resets the form after the action completes, so
  // the composer clears itself on post without a setState-in-effect.
  return (
    <form action={action} className="rounded-2xl border border-border bg-paper p-6">
      <input type="hidden" name="projectId" value={project.id} />
      <h3 className="font-serif text-[18px] font-medium">Post an update</h3>
      <textarea
        name="body"
        rows={3}
        className={field}
        placeholder="What's the latest? Leave blank to just move the stage."
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <label className="text-[14px] text-muted">
          Move to{" "}
          <select
            name="toStage"
            defaultValue=""
            className="rounded-lg border-[1.5px] border-[#e2d6c5] bg-ground px-2.5 py-1.5 text-[14px] text-ink focus:border-accent focus:outline-none"
          >
            <option value="">Keep current ({stageLabel(project.stage)})</option>
            {PROJECT_STAGE_META.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? "Posting…" : "Post update"}
        </button>
      </div>
      <ErrorNote state={state} />
    </form>
  );
}

function UpdatesList({ updates }: { updates: ProjectUpdateRow[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [, editAction] = useActionState(editUpdate, init);
  const [, deleteAction] = useActionState(deleteUpdate, init);

  if (updates.length === 0) {
    return <p className="text-[14px] text-muted">No updates yet.</p>;
  }

  return (
    <div className="rounded-2xl border border-border bg-paper">
      <h3 className="border-b border-border-soft px-5 py-3.5 font-serif text-[16px] font-medium">
        Recent updates
      </h3>
      <ul className="divide-y divide-border-soft">
        {updates.map((u) => (
          <li key={u.id} className="px-5 py-4">
            {u.fromStage && u.toStage && (
              <div className="mb-1.5 flex items-center gap-1.5 text-[13px] font-semibold text-accent">
                <span className="rounded bg-sand px-1.5 py-0.5 text-muted">
                  {stageLabel(u.fromStage)}
                </span>
                <span aria-hidden>→</span>
                <span className="rounded bg-accent-soft px-1.5 py-0.5">
                  {stageLabel(u.toStage)}
                </span>
              </div>
            )}
            {editingId === u.id ? (
              <form
                action={editAction}
                onSubmit={() => setEditingId(null)}
                className="mt-1"
              >
                <input type="hidden" name="updateId" value={u.id} />
                <textarea
                  name="body"
                  rows={2}
                  defaultValue={u.body ?? ""}
                  className={field}
                />
                <div className="mt-2 flex gap-3">
                  <button type="submit" className={ghostBtn}>
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-[14px] font-medium text-muted hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                {u.body && <p className="text-[15px] text-ink">{u.body}</p>}
                <div className="mt-1 flex items-center gap-3 text-[13px] text-muted">
                  <span>{stamp.format(u.createdAt)}</span>
                  <button
                    onClick={() => setEditingId(u.id)}
                    className="font-medium hover:text-ink"
                  >
                    Edit
                  </button>
                  <form action={deleteAction}>
                    <input type="hidden" name="updateId" value={u.id} />
                    <button type="submit" className="font-medium hover:text-accent">
                      Delete
                    </button>
                  </form>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

// Always visible: read-only by default so it doubles as the project's content
// view, editable when you hit Edit. Fields use readOnly (not disabled) so their
// values still submit. Cancel remounts the form to restore saved values.
function DetailsEditor({ project }: { project: Row }) {
  const [editing, setEditing] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [state, action, pending] = useActionState(updateProjectFields, init);
  const showFields = editing || !collapsed;

  // Restore the collapsed preference after mount (avoids an SSR mismatch).
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating persisted UI state
      setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
    } catch {
      // localStorage can be unavailable (private mode); default to expanded.
    }
  }, []);

  const toggleCollapsed = () => {
    if (editing) return;
    setCollapsed((c) => {
      const next = !c;
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <form
      key={formKey}
      action={action}
      onSubmit={() => setEditing(false)}
      className="max-w-[940px] rounded-2xl border border-border bg-paper p-6"
    >
      <input type="hidden" name="projectId" value={project.id} />
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={toggleCollapsed}
          className="flex items-center gap-2 text-left"
          aria-expanded={showFields}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`h-4 w-4 text-muted transition-transform ${
              showFields ? "rotate-90" : ""
            }`}
          >
            <path d="M9 6l6 6-6 6" />
          </svg>
          <h3 className="font-serif text-[18px] font-medium">Project details</h3>
        </button>
        {editing ? (
          <div className="flex items-center gap-3">
            <button type="submit" disabled={pending} className={primaryBtn}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setFormKey((k) => k + 1);
              }}
              className="text-[14px] font-medium text-muted hover:text-ink"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={ghostBtn}
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-4 space-y-4" hidden={!showFields}>
        <TextField
          name="title"
          label="Project title"
          defaultValue={project.title}
          readOnly={!editing}
          required
        />
        <TextArea
          name="proposalIntro"
          label="Intro"
          defaultValue={project.proposalIntro ?? ""}
          readOnly={!editing}
        />
        <TextArea
          name="scope"
          label="Scope"
          defaultValue={project.scope ?? ""}
          readOnly={!editing}
        />
        <TextField
          name="estimate"
          label="Estimate"
          defaultValue={project.estimate ?? ""}
          readOnly={!editing}
        />
        <TextArea
          name="brief"
          label="Brief"
          defaultValue={project.brief ?? ""}
          readOnly={!editing}
        />
        <TextArea
          name="needsFromClient"
          label="What I need from you"
          hint="shown to the client as a callout"
          defaultValue={project.needsFromClient ?? ""}
          readOnly={!editing}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TextField
            name="mocksUrl"
            label="Mocks URL"
            defaultValue={project.mocksUrl ?? ""}
            readOnly={!editing}
          />
          <TextField
            name="previewUrl"
            label="Preview URL"
            defaultValue={project.previewUrl ?? ""}
            readOnly={!editing}
          />
          <TextField
            name="liveUrl"
            label="Live URL"
            defaultValue={project.liveUrl ?? ""}
            readOnly={!editing}
          />
        </div>
      </div>
      <ErrorNote state={state} />
      {state.ok && !editing && (
        <p className="mt-3 text-[14px] text-muted">Saved.</p>
      )}
    </form>
  );
}

const readOnlyField =
  "mt-2 w-full rounded-xl border-[1.5px] border-transparent bg-ground/60 px-4 py-2.5 text-[15px] text-muted";

function TextField({
  name,
  label,
  hint,
  placeholder,
  defaultValue,
  readOnly,
  required,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={name}>
        {label}{" "}
        <span className="font-medium text-faint">
          {required ? "(required)" : "(optional)"}
        </span>
        {hint && <span className="ml-1 font-medium text-faint">{hint}</span>}
      </label>
      <input
        id={name}
        name={name}
        className={readOnly ? readOnlyField : field}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
    </div>
  );
}

function TextArea({
  name,
  label,
  hint,
  placeholder,
  defaultValue,
  readOnly,
  required,
}: {
  name: string;
  label: string;
  hint?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  required?: boolean;
}) {
  return (
    <div>
      <label className={labelCls} htmlFor={name}>
        {label}{" "}
        <span className="font-medium text-faint">
          {required ? "(required)" : "(optional)"}
        </span>
        {hint && <span className="ml-1 font-medium text-faint">{hint}</span>}
      </label>
      <textarea
        id={name}
        name={name}
        rows={3}
        className={readOnly ? readOnlyField : field}
        placeholder={placeholder}
        defaultValue={defaultValue}
        readOnly={readOnly}
      />
    </div>
  );
}
