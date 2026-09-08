import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  role: text("role").default("client"),
  // Better Auth admin plugin fields (we only use impersonation, not banning).
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    // Set by the admin plugin while an admin is impersonating this user.
    impersonatedBy: text("impersonated_by"),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    issuer: text("issuer"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// One row per client mirroring their Stripe billing state. Stripe stays the
// source of truth; webhooks keep status and currentPeriodEnd in sync. Amounts
// are stored in cents for display only.
export const clientBilling = pgTable("client_billing", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  status: text("status").notNull().default("none"),
  // Token for the branded /pay/[token] page when a plan invoice is outstanding.
  token: text("token").unique(),
  checkoutUrl: text("checkout_url"),
  planName: text("plan_name"),
  buildAmount: integer("build_amount"),
  buildDetails: text("build_details"),
  monthlyAmount: integer("monthly_amount"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// A one-time charge to an existing client (deposit, final payment, add-on),
// independent of their recurring plan. A client can have many over time; the
// webhook flips status to "paid" when the payment completes.
export const charge = pgTable(
  "charge",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull(),
    description: text("description"),
    status: text("status").notNull().default("pending"),
    // Token for the branded /pay/[token] page.
    token: text("token").unique(),
    checkoutUrl: text("checkout_url"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("charge_userId_idx").on(table.userId)],
);

// An invoice sent to someone who isn't a client yet. Keyed by a token in the
// invoice link; on payment we create their account and a client_billing row and
// mark this paid. Lets the admin see invoices that are still outstanding.
export const pendingInvoice = pgTable("pending_invoice", {
  id: text("id").primaryKey(),
  token: text("token").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  planName: text("plan_name"),
  buildAmount: integer("build_amount"),
  monthlyAmount: integer("monthly_amount"),
  buildDetails: text("build_details"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

// The client's website project: what they see in the portal. Starts in
// "proposal mode" (acceptedAt null) showing the agreed scope + estimate, then
// becomes the live status view once the client confirms.
export const PROJECT_STAGES = [
  "kickoff",
  "design",
  "build",
  "review",
  "live",
  "care",
] as const;
export type ProjectStage = (typeof PROJECT_STAGES)[number];

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    stage: text("stage").notNull().default("kickoff"),
    // Proposal mode content (shown before acceptance).
    proposalIntro: text("proposal_intro"),
    scope: text("scope"),
    estimate: text("estimate"),
    // The fuller pinned brief (live mode).
    brief: text("brief"),
    // An admin-authored ask shown to the client (e.g. "email me your logo").
    needsFromClient: text("needs_from_client"),
    mocksUrl: text("mocks_url"),
    previewUrl: text("preview_url"),
    liveUrl: text("live_url"),
    // Set when the client confirms the proposal; the snapshot freezes the
    // accepted scope + estimate, immune to later edits.
    acceptedAt: timestamp("accepted_at"),
    acceptedSnapshot: text("accepted_snapshot"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("project_userId_idx").on(table.userId)],
);

// Timeline entries. Kind is derived from which fields are set: body only is a
// note, stages only a status change, both a combined entry.
export const projectUpdate = pgTable(
  "project_update",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    body: text("body"),
    fromStage: text("from_stage"),
    toStage: text("to_stage"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("project_update_projectId_idx").on(table.projectId)],
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  projects: many(project),
  billing: one(clientBilling, {
    fields: [user.id],
    references: [clientBilling.userId],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  user: one(user, {
    fields: [project.userId],
    references: [user.id],
  }),
  updates: many(projectUpdate),
}));

export const projectUpdateRelations = relations(projectUpdate, ({ one }) => ({
  project: one(project, {
    fields: [projectUpdate.projectId],
    references: [project.id],
  }),
}));
