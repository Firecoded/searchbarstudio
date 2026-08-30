import { Suspense } from "react";
import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
