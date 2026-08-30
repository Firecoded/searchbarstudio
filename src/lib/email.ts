import { Resend } from "resend";

// onboarding@resend.dev works before the real domain is verified.
const FROM =
  process.env.EMAIL_FROM ?? "SearchbarStudio <onboarding@resend.dev>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({ from: FROM, ...opts });
}
