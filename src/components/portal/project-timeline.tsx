"use client";

import { useState } from "react";
import { stageLabel } from "@/lib/project-stages";
import type { ProjectUpdateRow } from "@/lib/project";

const stamp = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

// The client's read-only feed. Status changes are first-class (from -> to
// chips), combined entries show the chips plus the note, plain notes are a
// quiet dot + text. Shows the recent few with an inline "show all".
export function ProjectTimeline({ updates }: { updates: ProjectUpdateRow[] }) {
  const [showAll, setShowAll] = useState(false);

  if (updates.length === 0) {
    return (
      <p className="mt-3 text-[15px] text-muted">
        No updates yet, check back soon.
      </p>
    );
  }

  const shown = showAll ? updates : updates.slice(0, 5);

  return (
    <>
      <ul className="mt-4 space-y-5">
        {shown.map((u) => {
          const isStatus = !!(u.fromStage && u.toStage);
          return (
            <li key={u.id} className="flex gap-3">
              <span
                className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                  isStatus ? "bg-accent" : "bg-faint"
                }`}
              />
              <div className="min-w-0">
                {isStatus && (
                  <div className="mb-1 flex flex-wrap items-center gap-1.5 text-[13px] font-semibold">
                    <span className="rounded bg-sand px-1.5 py-0.5 text-muted">
                      {stageLabel(u.fromStage!)}
                    </span>
                    <span aria-hidden className="text-accent">
                      →
                    </span>
                    <span className="rounded bg-accent-soft px-1.5 py-0.5 text-accent">
                      {stageLabel(u.toStage!)}
                    </span>
                  </div>
                )}
                {u.body && (
                  <p className="text-[15px] leading-[1.55] text-ink">{u.body}</p>
                )}
                <p className="mt-0.5 text-[13px] text-faint">
                  {stamp.format(u.createdAt)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      {!showAll && updates.length > 5 && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-[14px] font-semibold text-accent hover:text-accent-hover"
        >
          Show all {updates.length} updates
        </button>
      )}
    </>
  );
}
