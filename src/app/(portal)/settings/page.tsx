import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { ChangePasswordForm } from "@/components/portal/change-password-form";
import { PageHeader } from "@/components/portal/page-header";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <>
      <PageHeader title="Settings" />
      <section className="rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Account</h2>
        <dl className="mt-4 space-y-2 text-[15px]">
          <div className="flex justify-between border-b border-border-soft pb-2">
            <dt className="text-muted">Name</dt>
            <dd className="font-medium">{session.user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Email</dt>
            <dd className="font-medium">{session.user.email}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Password</h2>
        <ChangePasswordForm />
      </section>
    </>
  );
}
