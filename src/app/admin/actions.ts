"use server";

import { randomBytes, randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user, account, verification } from "@/db/schema";
import { sendEmail } from "@/lib/email";

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

// Invited clients get a week to set their password before the link expires.
const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type InviteState = { ok: boolean; error?: string; invited?: string };

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user.role === "admin";
}

function inviteEmail(name: string, url: string) {
  return `
    <div style="font-family:system-ui,sans-serif;color:#241d16;max-width:520px">
      <p>Hi ${name},</p>
      <p>You've been set up with a client account at SearchbarStudio. Set your
      password to get into your dashboard.</p>
      <p style="margin:24px 0">
        <a href="${url}" style="background:#c1592f;color:#fff;text-decoration:none;padding:12px 22px;border-radius:10px;font-weight:600;display:inline-block">
          Set your password
        </a>
      </p>
      <p style="color:#6f6357;font-size:14px">This link is good for 7 days. If it
      expires, ask me to send a new one.</p>
    </div>
  `;
}

export async function inviteClient(
  _prev: InviteState,
  formData: FormData,
): Promise<InviteState> {
  if (!(await requireAdmin())) {
    return { ok: false, error: "Not authorized." };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = ((formData.get("email") as string)?.trim() ?? "").toLowerCase();

  if (!name) return { ok: false, error: "Please add the client's name." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  const existing = await db.query.user.findFirst({
    where: eq(user.email, email),
  });

  let userId: string;
  if (existing) {
    const credential = await db.query.account.findFirst({
      where: and(
        eq(account.userId, existing.id),
        eq(account.providerId, "credential"),
      ),
    });
    // An existing user who already set a password can't be re-invited.
    if (credential) {
      return { ok: false, error: "That email already has an account." };
    }
    userId = existing.id;
  } else {
    userId = randomUUID();
    await db.insert(user).values({
      id: userId,
      name,
      email,
      emailVerified: true,
      role: "client",
    });
  }

  // A verification row keyed this way is what Better Auth's reset-password
  // endpoint consumes, and it creates the credential account on first use.
  const token = randomBytes(24).toString("base64url");
  await db.insert(verification).values({
    id: randomUUID(),
    identifier: `reset-password:${token}`,
    value: userId,
    expiresAt: new Date(Date.now() + INVITE_TTL_MS),
  });

  const url = `${APP_URL}/set-password?token=${token}`;
  try {
    await sendEmail({
      to: email,
      subject: "You're invited to SearchbarStudio",
      html: inviteEmail(name, url),
    });
  } catch {
    return {
      ok: false,
      error: "Couldn't send the invite email. Check the address and try again.",
    };
  }

  revalidatePath("/admin");
  return { ok: true, invited: email };
}
