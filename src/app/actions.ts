"use server";

import { sendEmail } from "@/lib/email";

const CONTACT_TO = process.env.CONTACT_TO ?? "searchbarstudio@gmail.com";

export type ContactState = { ok: boolean; error?: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function row(label: string, value: string) {
  return `<p style="margin:0 0 10px"><strong>${label}:</strong> ${escapeHtml(
    value,
  )}</p>`;
}

export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: real users never see or fill this field.
  if ((formData.get("company") as string)?.trim()) {
    return { ok: true };
  }

  const name = (formData.get("name") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const message = (formData.get("message") as string)?.trim() ?? "";
  const need = (formData.get("need") as string)?.trim() ?? "";
  const timeline = (formData.get("timeline") as string)?.trim() ?? "";
  const site = (formData.get("site") as string)?.trim() ?? "";
  const source = (formData.get("source") as string)?.trim() ?? "";

  if (!name) {
    return { ok: false, error: "Please add your name." };
  }
  if (!email) {
    return { ok: false, error: "Please add your email so I can reply." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      ok: false,
      error: "Please enter a valid email address, like you@example.com.",
    };
  }
  if (!message) {
    return { ok: false, error: "Please add a short note about your project." };
  }

  const html = [
    row("Name", name),
    row("Email", email),
    need && row("Needs", need),
    timeline && row("Timeline", timeline),
    site && row("Current/liked site", site),
    source && row("Heard via", source),
    `<p style="margin:16px 0 6px"><strong>Message</strong></p>`,
    `<p style="margin:0;white-space:pre-wrap">${escapeHtml(message)}</p>`,
  ]
    .filter(Boolean)
    .join("");

  try {
    await sendEmail({
      to: CONTACT_TO,
      replyTo: email,
      subject: `New inquiry from ${name}`,
      html,
    });
  } catch {
    return { ok: false, error: "Something went wrong sending your message. Please try again or email directly." };
  }

  return { ok: true };
}
