"use client";

import { useState } from "react";

type Item = { key: string; label: string; subject: string; html: string };

export function EmailGallery({ emails }: { emails: Item[] }) {
  const [active, setActive] = useState(emails[0]?.key);
  const current = emails.find((e) => e.key === active) ?? emails[0];

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {emails.map((e) => (
          <button
            key={e.key}
            onClick={() => setActive(e.key)}
            className={`rounded-xl px-4 py-2 text-[14px] font-semibold transition-colors ${
              e.key === active
                ? "bg-accent text-accent-ink"
                : "border border-border bg-paper text-muted hover:bg-ground"
            }`}
          >
            {e.label}
          </button>
        ))}
      </div>

      {current && (
        <>
          <p className="mt-5 text-[14px] text-muted">
            <span className="font-semibold text-ink">Subject:</span>{" "}
            {current.subject}
          </p>
          <iframe
            title="Email preview"
            srcDoc={current.html}
            className="mt-3 w-full rounded-2xl border border-border"
            style={{ height: "72vh", background: "#faf6f0" }}
          />
        </>
      )}
    </div>
  );
}
