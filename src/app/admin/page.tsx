import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { SignOut } from "@/components/sign-out";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  return (
    <main className="mx-auto max-w-[900px] px-6 py-14">
      <div className="flex items-center justify-between">
        <span className="font-serif text-[26px] font-medium">Admin</span>
        <SignOut />
      </div>
      <p className="mt-3 text-[16px] text-muted">
        Signed in as {session?.user.email}.
      </p>
    </main>
  );
}
