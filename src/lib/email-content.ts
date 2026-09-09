import type { BrandedEmailProps } from "@/lib/branded-email";

// Single source of truth for transactional email copy, so the real sends and the
// admin reference gallery stay in sync. Each returns the subject plus the
// branded-email props; callers render the props and send with the subject.
export type EmailContent = { subject: string; props: BrandedEmailProps };

// Greet by first name only. Names are admin-entered as a single field, so a
// simple split is enough; the guard keeps a blank or odd name from rendering
// "Hi ,".
function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || "there";
}

export function inviteEmail(name: string, url: string): EmailContent {
  return {
    subject: "You're invited to Searchbar Studio",
    props: {
      preview: "Set your password to reach your Searchbar Studio dashboard.",
      heading: "Welcome to Searchbar Studio",
      paragraphs: [
        `Hi ${firstName(name)}, **let's get you set up.** Pick a password and you're in.`,
        "Your dashboard is your home base with me, where you can:",
      ],
      bullets: [
        "Follow your project and see updates",
        "Request changes and message me directly",
        "View invoices and manage billing",
      ],
      button: { label: "Set your password", href: url },
      note: "This link is good for 7 days. If it expires, ask me to send a new one.",
    },
  };
}

// Sent when the invite comes with a build already lined up (agreed over chat).
// Warmer than the bare invite, and it points at the proposal, not the dashboard.
export function projectInviteEmail(
  name: string,
  url: string,
  projectTitle: string,
): EmailContent {
  return {
    subject: "Your project is ready to review",
    props: {
      preview: `Set up your account to review ${projectTitle} and get started.`,
      heading: "Let's build your website",
      paragraphs: [
        `Hi ${firstName(name)}, **excited to work with you.** I've put together a proposal for what we discussed, and it's ready for you to review.`,
        "Here's how it works:",
      ],
      bullets: [
        "Set up your account with a quick password",
        "Review the build and the estimate",
        'Hit "Sounds good" and I\'ll get started',
      ],
      button: { label: "Set up your account", href: url },
      note: "This link is good for 7 days. If it expires, ask me to send a new one.",
    },
  };
}

export function invoiceEmail(name: string, url: string): EmailContent {
  return {
    subject: "You've got an invoice from Searchbar Studio",
    props: {
      preview: "Your invoice from Searchbar Studio. Pay and set up your account.",
      heading: "You've got an invoice",
      paragraphs: [
        `Hi ${firstName(name)}, **here's your invoice.** Review it and pay securely.`,
        "Right after paying, **you'll create your account.** It's your home base with me, where you can:",
      ],
      bullets: [
        "Follow your project and see updates as they happen",
        "Request changes and message me directly",
        "View your invoices and manage billing any time",
      ],
      button: { label: "View your invoice", href: url },
      note: "Setting up your account takes just a few seconds after you pay.",
    },
  };
}

export function billingEmail(name: string, url: string): EmailContent {
  return {
    subject: "Your Searchbar Studio invoice",
    props: {
      preview: "Your invoice from Searchbar Studio is ready to pay.",
      heading: "Your invoice is ready",
      paragraphs: [
        `Hi ${firstName(name)}, **your invoice is ready.** Review it and pay securely.`,
        "You can view your invoices and manage billing any time from your dashboard.",
      ],
      button: { label: "Review and pay", href: url },
      note: "You can also find this in your dashboard.",
    },
  };
}

export function paymentReceivedEmail(name: string, url: string): EmailContent {
  return {
    subject: "Payment received",
    props: {
      preview: "Payment received. Thanks!",
      heading: "Payment received",
      paragraphs: [
        `Hi ${firstName(name)}, **thanks, your payment went through.**`,
        "You can view your invoice and get to your dashboard here:",
      ],
      button: { label: "View your invoice", href: url },
    },
  };
}

export function resetPasswordEmail(name: string, url: string): EmailContent {
  return {
    subject: "Reset your Searchbar Studio password",
    props: {
      preview: "Reset your Searchbar Studio password.",
      heading: "Reset your password",
      paragraphs: [
        `Hi ${firstName(name)}, we got a request to **reset your password.** Choose a new one below.`,
        "If you didn't ask for this, you can safely ignore this email.",
      ],
      button: { label: "Reset password", href: url },
    },
  };
}

// The ordered set shown in the admin reference gallery.
export const emailGallery: {
  key: string;
  label: string;
  build: (name: string, url: string) => EmailContent;
}[] = [
  { key: "invite", label: "Invite a client", build: inviteEmail },
  {
    key: "project-invite",
    label: "Invite to a project",
    build: (name, url) => projectInviteEmail(name, url, "your new website"),
  },
  { key: "invoice", label: "Invoice (new client)", build: invoiceEmail },
  { key: "billing", label: "Invoice (existing)", build: billingEmail },
  { key: "paid", label: "Payment received", build: paymentReceivedEmail },
  { key: "reset", label: "Password reset", build: resetPasswordEmail },
];
