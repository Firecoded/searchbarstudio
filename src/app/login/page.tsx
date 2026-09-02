import { Suspense } from "react";
import { LoginForm } from "./login-form";

export const metadata = { robots: { index: false, follow: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  );
}
