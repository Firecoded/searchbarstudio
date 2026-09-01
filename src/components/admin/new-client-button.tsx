"use client";

import { useState } from "react";
import { InviteForm } from "./invite-form";
import { InvoiceForm } from "./invoice-form";

export function NewClientButton() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"invite" | "invoice">("invite");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-accent px-5 py-2.5 text-[14px] font-semibold text-accent-ink transition-colors hover:bg-accent-hover"
      >
        + New client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          <button
            className="absolute inset-0 cursor-default bg-espresso/30"
            aria-label="Close"
            onClick={() => setOpen(false)}
          />
          <div className="relative ml-auto flex h-full w-full max-w-[540px] flex-col overflow-y-auto bg-ground p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-[24px] font-medium">New client</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-muted hover:text-ink"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="mt-5 inline-flex rounded-xl border border-border bg-paper p-1">
              {(["invite", "invoice"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-lg px-4 py-1.5 text-[14px] font-semibold transition-colors ${
                    mode === m ? "bg-accent text-accent-ink" : "text-muted"
                  }`}
                >
                  {m === "invite" ? "Invite" : "Send an invoice"}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-muted">
              {mode === "invite"
                ? "They set a password and reach their dashboard. No payment yet."
                : "They pay first, then set a password. Good for a deposit or build up front."}
            </p>

            <div className="mt-4">
              {mode === "invite" ? <InviteForm /> : <InvoiceForm />}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
