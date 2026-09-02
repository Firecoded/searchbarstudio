import { Resend } from "resend";

// Sends as the studio's own address. Requires the domain to be verified in
// Resend; set EMAIL_FROM to override (e.g. onboarding@resend.dev for local
// testing before the domain is verified). Client replies land in this inbox.
const FROM =
  process.env.EMAIL_FROM ?? "Searchbar Studio <jacob@searchbarstudio.com>";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { replyTo, ...rest } = opts;

  let { error } = await resend.emails.send({ from: FROM, ...opts });
  // A reply-to a lead typed can be malformed enough for Resend to reject the
  // whole send. Don't lose the message over it: retry once without reply-to
  // (the sender's address is included in the email body regardless).
  if (error && replyTo) {
    ({ error } = await resend.emails.send({ from: FROM, ...rest }));
  }
  // Resend returns errors in the response rather than throwing, so surface them
  // to callers instead of silently reporting success.
  if (error) throw new Error(error.message);
}
