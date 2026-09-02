import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { PortalShell } from "@/components/portal/portal-shell";
import { ImpersonationBanner } from "@/components/portal/impersonation-banner";

export const metadata = { robots: { index: false, follow: false } };

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const impersonating = !!session.session.impersonatedBy;

  return (
    <>
      {impersonating && (
        <ImpersonationBanner
          name={session.user.name}
          returnTo={`/clients/${session.user.id}`}
        />
      )}
      <PortalShell
        user={{
          name: session.user.name,
          email: session.user.email,
          role: session.user.role ?? null,
        }}
      >
        {children}
      </PortalShell>
    </>
  );
}
