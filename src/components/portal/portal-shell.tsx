"use client";

import { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/marketing/logo";
import { authClient } from "@/lib/auth-client";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const iconClass = "h-[18px] w-[18px]";

function IconGrid() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function IconHome() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
    </svg>
  );
}
function IconClients() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 6.5a3 3 0 0 1 0 5.8M20.5 20a5 5 0 0 0-3.5-4.7" strokeLinecap="round" />
    </svg>
  );
}
function IconSettings() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M2 12h3M19 12h3M4.9 19.1 7 17M17 7l2.1-2.1" strokeLinecap="round" />
    </svg>
  );
}
function IconMail() {
  return (
    <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function navFor(role: string | null | undefined): NavItem[] {
  if (role === "admin") {
    return [
      { label: "Dashboard", href: "/admin", icon: <IconGrid /> },
      { label: "Clients", href: "/clients", icon: <IconClients /> },
      { label: "Emails", href: "/emails", icon: <IconMail /> },
      { label: "Settings", href: "/settings", icon: <IconSettings /> },
    ];
  }
  return [
    { label: "Home", href: "/dashboard", icon: <IconHome /> },
    { label: "Settings", href: "/settings", icon: <IconSettings /> },
  ];
}

// Lets each page's PageHeader open the mobile nav drawer.
const DrawerContext = createContext<{ open: () => void } | null>(null);
export function usePortalDrawer() {
  return useContext(DrawerContext);
}

export function PortalShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string | null };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const items = navFor(user.role);
  const home = user.role === "admin" ? "/admin" : "/dashboard";
  const initial = (user.name.trim()[0] ?? "?").toUpperCase();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  async function signOut() {
    await authClient.signOut();
    router.push("/login");
  }

  const sidebarBody = (
    <div className="flex h-full flex-col">
      <div className="flex justify-center border-b border-border-soft px-4 py-4">
        <Link href={home} onClick={() => setDrawerOpen(false)}>
          <Logo className="h-[38px]" />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
        {items.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setDrawerOpen(false)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-medium transition-colors ${
                active
                  ? "bg-accent-soft text-accent"
                  : "text-muted hover:bg-ground hover:text-ink"
              }`}
            >
              <span className={active ? "text-accent" : "text-faint"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="relative border-t border-border-soft p-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-ground"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-[15px] font-semibold text-accent-ink">
            {initial}
          </span>
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-[14px] font-semibold text-ink">
              {user.name}
            </span>
            <span className="block truncate text-[12px] text-muted">
              {user.email}
            </span>
          </span>
          <svg className="h-4 w-4 shrink-0 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {menuOpen && (
          <>
            <button
              className="fixed inset-0 z-30 cursor-default"
              aria-hidden="true"
              onClick={() => setMenuOpen(false)}
              tabIndex={-1}
            />
            <div className="absolute bottom-full left-3 right-3 z-40 mb-2 overflow-hidden rounded-xl border border-border bg-paper shadow-lg">
              <Link
                href="/settings"
                onClick={() => {
                  setMenuOpen(false);
                  setDrawerOpen(false);
                }}
                className="block px-4 py-2.5 text-[14px] text-ink transition-colors hover:bg-ground"
              >
                Settings
              </Link>
              <button
                onClick={signOut}
                className="block w-full px-4 py-2.5 text-left text-[14px] text-accent transition-colors hover:bg-ground"
              >
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <DrawerContext.Provider value={{ open: () => setDrawerOpen(true) }}>
      <div className="flex min-h-screen bg-ground">
        <aside className="hidden w-[240px] shrink-0 border-r border-border bg-paper sm:block">
          {sidebarBody}
        </aside>

        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1280px] px-6 pb-12 pt-8 sm:px-8">
            {children}
          </div>
        </main>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 sm:hidden">
            <button
              className="absolute inset-0 cursor-default bg-espresso/30"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
            />
            <div className="absolute left-0 top-0 h-full w-[260px] bg-paper">
              {sidebarBody}
            </div>
          </div>
        )}
      </div>
    </DrawerContext.Provider>
  );
}
