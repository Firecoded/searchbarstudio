// Shown instantly while a portal page's data loads, so navigation paints a
// skeleton in the content area (the sidebar stays put) instead of freezing on
// the previous page.
export default function PortalLoading() {
  return (
    <div className="animate-pulse" aria-hidden>
      <div className="h-8 w-44 rounded-lg bg-sand" />
      <div className="mt-9 space-y-4">
        <div className="h-28 rounded-2xl border border-border bg-paper" />
        <div className="h-28 rounded-2xl border border-border bg-paper" />
        <div className="h-28 rounded-2xl border border-border bg-paper" />
      </div>
    </div>
  );
}
