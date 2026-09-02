import { redirect } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getSession } from "@/lib/session";
import { db } from "@/db";
import { user, account, clientBilling } from "@/db/schema";
import { PageHeader } from "@/components/portal/page-header";
import { NewClientButton } from "@/components/admin/new-client-button";
import { ClientRow } from "@/components/admin/client-row";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const planLabel: Record<string, string> = {
  active: "Active",
  canceling: "Canceling",
  pending: "Invoice sent",
  canceled: "Canceled",
};

export default async function ClientsPage() {
  const session = await getSession();
  if (session?.user.role !== "admin") redirect("/dashboard");

  const clients = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.role, "client"))
    .orderBy(asc(user.createdAt));

  const credentials = await db
    .select({ userId: account.userId, createdAt: account.createdAt })
    .from(account)
    .where(eq(account.providerId, "credential"));
  // A client "joins" when they set a password (creating their credential
  // account), so use that timestamp rather than the invite/creation date.
  const joinedAt = new Map(credentials.map((c) => [c.userId, c.createdAt]));

  const billingRows = await db
    .select({
      userId: clientBilling.userId,
      status: clientBilling.status,
    })
    .from(clientBilling);
  const planByUser = new Map(billingRows.map((b) => [b.userId, b.status]));

  return (
    <>
      <PageHeader title="Clients" action={<NewClientButton />} />

      {clients.length === 0 ? (
        <p className="text-[15px] text-muted">
          No clients yet. Add one with “New client”.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border bg-paper">
          <table className="w-full min-w-[560px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-border text-[13px] font-semibold text-muted">
                <th className="whitespace-nowrap px-5 py-3.5">Name</th>
                <th className="whitespace-nowrap px-5 py-3.5">Email</th>
                <th className="whitespace-nowrap px-5 py-3.5">Plan</th>
                <th className="whitespace-nowrap px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => {
                const status = planByUser.get(c.id);
                const joined = joinedAt.get(c.id);
                return (
                  <ClientRow
                    key={c.id}
                    href={`/clients/${c.id}`}
                    name={c.name}
                    email={c.email}
                    plan={status ? (planLabel[status] ?? "None") : "None"}
                    invited={!joined}
                    joined={joined ? dateFmt.format(joined) : ""}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
