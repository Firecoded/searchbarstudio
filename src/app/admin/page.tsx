import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, account } from "@/db/schema";
import { SignOut } from "@/components/sign-out";
import { InviteForm } from "@/components/admin/invite-form";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  // The proxy only checks for a session cookie; role gating lives here so a
  // client account can't reach the admin view.
  if (!session) redirect("/login?next=/admin");
  if (session.user.role !== "admin") redirect("/");

  const people = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    })
    .from(user)
    .orderBy(asc(user.createdAt));

  // A client with no credential account was invited but hasn't set a password.
  const credentials = await db
    .select({ userId: account.userId })
    .from(account)
    .where(eq(account.providerId, "credential"));
  const activated = new Set(credentials.map((c) => c.userId));

  const clients = people.filter((p) => p.role === "client");
  const team = people.filter((p) => p.role === "admin");

  return (
    <main className="mx-auto max-w-[900px] px-6 py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[30px] font-medium">Admin</h1>
          <p className="mt-1 text-[15px] text-muted">
            Signed in as {session.user.email}
          </p>
        </div>
        <SignOut />
      </div>

      <div className="mt-9 grid grid-cols-2 gap-4 sm:max-w-[380px]">
        <Stat label="Clients" value={clients.length} />
        <Stat label="Team" value={team.length} />
      </div>

      <div className="mt-8">
        <InviteForm />
      </div>

      <section className="mt-11">
        <h2 className="font-serif text-[20px] font-medium">People</h2>

        {people.length === 0 ? (
          <p className="mt-4 text-[15px] text-muted">No accounts yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-paper">
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-border text-[13px] font-semibold text-muted">
                  <th className="px-5 py-3.5">Name</th>
                  <th className="px-5 py-3.5">Email</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Joined</th>
                </tr>
              </thead>
              <tbody>
                {people.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border-soft last:border-0"
                  >
                    <td className="px-5 py-3.5 font-medium">{p.name}</td>
                    <td className="px-5 py-3.5 text-muted">{p.email}</td>
                    <td className="px-5 py-3.5">
                      <RoleBadge
                        role={p.role}
                        pending={p.role === "client" && !activated.has(p.id)}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-muted">
                      {dateFmt.format(p.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-paper px-5 py-4">
      <div className="font-serif text-[28px] font-medium">{value}</div>
      <div className="mt-0.5 text-[13px] font-semibold text-muted">{label}</div>
    </div>
  );
}

function RoleBadge({
  role,
  pending,
}: {
  role: string | null;
  pending?: boolean;
}) {
  const isAdmin = role === "admin";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-block rounded-full px-2.5 py-1 text-[12px] font-semibold ${
          isAdmin ? "bg-accent-soft text-accent" : "bg-sand text-muted"
        }`}
      >
        {role ?? "client"}
      </span>
      {pending && (
        <span className="text-[12px] font-medium text-faint">Invited</span>
      )}
    </span>
  );
}
