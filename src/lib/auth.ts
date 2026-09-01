import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail } from "@/lib/email";
import { renderBrandedEmail } from "@/lib/branded-email";
import { resetPasswordEmail } from "@/lib/email-content";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: {
    enabled: true,
    // Accounts are created by invite (server-side), not open registration.
    disableSignUp: true,
    sendResetPassword: async ({ user, url }) => {
      const content = resetPasswordEmail(user.name, url);
      const { html, text } = await renderBrandedEmail(content.props);
      await sendEmail({
        to: user.email,
        subject: content.subject,
        html,
        text,
      });
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "client", input: false },
    },
  },
});
