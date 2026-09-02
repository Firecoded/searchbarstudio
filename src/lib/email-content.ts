import type { BrandedEmailProps } from "@/lib/branded-email";

// Single source of truth for transactional email copy, so the real sends and the
// admin reference gallery stay in sync. Each returns the subject plus the
// branded-email props; callers render the props and send with the subject.
export type EmailContent = { subject: string; props: BrandedEmailProps };

export function inviteEmail(name: string, url: string): EmailContent {
  return {
    subject: "You're invited to Searchbar Studio",
    props: {
      preview: "Set your password to reach your Searchbar Studio dashboard.",
      heading: "Welcome to Searchbar Studio",
      paragraphs: [
        `Hi ${name}, **let's get you set up.** Pick a password and you're in.`,
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

export function invoiceEmail(name: string, url: string): EmailContent {
  return {
    subject: "You've got an invoice from Searchbar Studio",
    props: {
      preview: "Your invoice from Searchbar Studio. Pay and set up your account.",
      heading: "You've got an invoice",
      paragraphs: [
        `Hi ${name}, **here's your invoice.** Review it and pay securely.`,
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
        `Hi ${name}, **your invoice is ready.** Review it and pay securely.`,
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
        `Hi ${name}, **thanks, your payment went through.**`,
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
        `Hi ${name}, we got a request to **reset your password.** Choose a new one below.`,
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
  { key: "invoice", label: "Invoice (new client)", build: invoiceEmail },
  { key: "billing", label: "Invoice (existing)", build: billingEmail },
  { key: "paid", label: "Payment received", build: paymentReceivedEmail },
  { key: "reset", label: "Password reset", build: resetPasswordEmail },
];
