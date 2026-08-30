import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SignOut } from "@/components/sign-out";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) redirect("/login?next=/dashboard");
  // Admins have their own view; keep the client dashboard for clients.
  if (session.user.role === "admin") redirect("/admin");

  const firstName = session.user.name.split(" ")[0];

  return (
    <main className="mx-auto max-w-[760px] px-6 py-14">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[30px] font-medium">
            Welcome, {firstName}
          </h1>
          <p className="mt-1 text-[15px] text-muted">{session.user.email}</p>
        </div>
        <SignOut />
      </div>

      <section className="mt-9 rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Your project</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          This is where your project status and updates will live. I&rsquo;ll
          have it set up shortly.
        </p>
      </section>

      <section className="mt-5 rounded-2xl border border-border bg-paper p-6">
        <h2 className="font-serif text-[20px] font-medium">Need a change?</h2>
        <p className="mt-2 text-[15px] leading-[1.55] text-muted">
          Email me at{" "}
          <a
            href="mailto:hello@searchbarstudio.com"
            className="font-medium text-accent"
          >
            hello@searchbarstudio.com
          </a>{" "}
          and I&rsquo;ll take care of it.
        </p>
      </section>
    </main>
  );
}
