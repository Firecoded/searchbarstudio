"use client";

import Link from "next/link";
import { usePortalDrawer } from "./portal-shell";

// Standard page header: optional breadcrumb parent, a title, and a right-aligned
// action slot. The mobile menu button lives here.
export function PageHeader({
  title,
  parent,
  action,
}: {
  title: string;
  parent?: { label: string; href: string };
  action?: React.ReactNode;
}) {
  const drawer = usePortalDrawer();

  return (
    <div className="mb-8 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <button
          onClick={() => drawer?.open()}
          className="-ml-1 mt-0.5 text-muted hover:text-ink sm:hidden"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
          </svg>
        </button>
        <div className="min-w-0">
          {parent && (
            <nav className="mb-1 flex items-center gap-1.5 text-[13px] font-medium text-muted">
              <Link href={parent.href} className="hover:text-ink">
                {parent.label}
              </Link>
              <span className="text-faint">/</span>
            </nav>
          )}
          <h1 className="truncate font-serif text-[26px] font-medium text-ink">
            {title}
          </h1>
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
