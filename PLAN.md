# SearchbarStudio — Plan & Status

The website and client platform for SearchbarStudio: a one-person studio that
designs, builds, and looks after websites for small businesses. This doc is the
map, what we're building, in what order, and where we are right now.

## The big picture

Two products living in one Next.js app:

1. **Marketing site** (public) — the "hire me" front end. Its whole job is to
   turn a visitor into a message in the inbox.
2. **Client portal / back office** (private) — admin + client logins, invites,
   and (later) monthly billing. The part that gets us paid.

## Stack

- **Next.js 16** (App Router, TypeScript, Tailwind v4) on Vercel
- **Better Auth** — self-managed email + password auth on **Drizzle ORM**
- **Neon** — serverless Postgres (project "Site + Portal")
- **Resend** — transactional email (invites, password resets)
- **Stripe** — subscriptions/billing (not started yet)

## Where we are

The **marketing site is done**, the **auth foundation is live** (you can log in,
reset a password), the **admin dashboard** lists accounts and invites clients,
the **invite flow** and **client dashboard** work, the **contact form** delivers
to the inbox, and **Stripe billing** is wired (admin sends a combined build +
monthly invoice, client pays via hosted Checkout, webhook flips status to
Active). Roughly: **Phases 1 through 4 complete; remaining work is launch prep.**

---

## Roadmap

### Phase 1 — Marketing site ✅ Done

- [x] Homepage: hero, "What I do", work (with case-study modals), care plan,
      about, process, contact form
- [x] Responsive across mobile / tablet / desktop, with a mobile hamburger menu
- [x] Logo (search-bar lockup, light + dark) and favicon
- [x] Scroll-reveal + hero load-in animations
- [x] Copy pass on the hero and sections

_Still placeholder (swap in when ready): your name, photo, area, and real
projects._

### Phase 2 — Auth & back office ✅ Done

- [x] Better Auth + Drizzle + Neon wired; schema pushed
- [x] Login page (`/login`) and route protection for `/admin`, `/dashboard`
- [x] Admin account seeded; public sign-up disabled (invite-only)
- [x] Password-reset email sending via Resend from `noreply@searchbarstudio.com`
- [x] "Log in" links in the nav (desktop + mobile) and footer
- [x] **Forgot-password** page (`/forgot-password`) — request a reset
- [x] **Reset-password** page (`/reset-password`) — where the email link lands
- [x] Real **admin dashboard**: see clients, manage users
- [x] Wire the **contact form** to email submissions via Resend

### Phase 3 — Client portal ✅ Done

- [x] **Invite flow**: admin adds a client → one-time set-password email → client
      sets their password → lands on their dashboard
- [x] **Client dashboard**: their project, status, and a place to request changes
      (placeholder content for now)
- [x] Roles polish (admin vs client gating throughout)

### Phase 4 — Billing (Stripe) ✅ Done

- [x] Stripe subscriptions: hosted checkout + hosted billing portal (no card data
      in our code). One Checkout combines the one-time build fee (first invoice
      only) with the recurring monthly plan; terms consent collected at checkout;
      webhook syncs status.
- [x] Show subscription status in the client dashboard ("Active, next charge …")
- [x] Kick off a subscription from the admin when a client comes on

### Later / launch

- [ ] Replace all `[placeholder]` content with the real thing
- [ ] Deploy (Vercel Pro or a small VPS), point the domain, production env vars
- [ ] Branded two-way client email for `hello@`. Plan: a free-tier mailbox
      (Zoho or similar) that forwards inbound to the personal Gmail, plus Gmail
      "Send mail as" so replies go out from `hello@searchbarstudio.com`. Gmail
      stays the day-to-day inbox; the branded address is the in-between.
- [ ] Swap the email wordmark for a hosted logo image (needs the domain live +
      a public logo URL); keep the wordmark as the image's alt-text fallback for
      clients that block images.
- [ ] Final responsive + accessibility polish

---

## Key decisions (so we don't relitigate)

- **No prices on the marketing site.** Pure book-a-call; quality is the qualifier.
- **Invite-only accounts.** No open registration; the admin creates clients.
- **Self-managed Better Auth** on Drizzle (not Neon's managed auth), so we own the
  data and schema.
- **Websites are the headline**; web/mobile/custom apps are framed as depth, not a
  competing menu.
- **Warm brand**: cream + terracotta, Newsreader serif + Manrope, single warm theme.

See `design/architecture.html` for the deeper technical reference.
