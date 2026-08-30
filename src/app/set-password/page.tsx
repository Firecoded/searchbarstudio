import { Suspense } from "react";
import { SetPasswordForm } from "./set-password-form";

export default function SetPasswordPage() {
  return (
    <main className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <Suspense>
        <SetPasswordForm />
      </Suspense>
    </main>
  );
}
