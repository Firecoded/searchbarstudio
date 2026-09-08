// Applies pending Drizzle migrations from ./drizzle. Used in two places, with
// the same migrator both times so the migration-tracking table stays
// consistent:
//   - the build ("node scripts/migrate.mjs && next build"), which runs on a
//     Vercel *production* deploy and migrates the prod database before the new
//     code goes live;
//   - "npm run db:migrate", which sets MIGRATE_LOCAL=1 and loads .env to
//     migrate the local (dev) database.
//
// Guards so nothing migrates the wrong database:
//   - On Vercel, only production builds proceed. Preview builds skip.
//   - Locally, a plain `next build` skips; only db:migrate (MIGRATE_LOCAL=1)
//     runs.
//   - Uses the direct (unpooled) connection, which Neon wants for DDL.
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const vercelEnv = process.env.VERCEL_ENV;
if (vercelEnv) {
  if (vercelEnv !== "production") {
    console.log(`[migrate] VERCEL_ENV=${vercelEnv}, skipping (non-production).`);
    process.exit(0);
  }
} else if (process.env.MIGRATE_LOCAL !== "1") {
  console.log("[migrate] Not a production deploy and MIGRATE_LOCAL unset, skipping.");
  process.exit(0);
}

// Prefer the explicit direct string. Otherwise derive it from the pooled
// DATABASE_URL: Neon's direct host is the pooled host minus the "-pooler"
// segment, so we don't need a second env var set in Vercel.
function directUrl() {
  if (process.env.DATABASE_URL_UNPOOLED) return process.env.DATABASE_URL_UNPOOLED;
  const pooled = process.env.DATABASE_URL;
  if (!pooled) return null;
  try {
    const u = new URL(pooled);
    u.host = u.host.replace("-pooler", "");
    return u.toString();
  } catch {
    return pooled;
  }
}

const url = directUrl();
if (!url) {
  console.error("[migrate] No DATABASE_URL_UNPOOLED or DATABASE_URL set.");
  process.exit(1);
}

// prepare:false so this also works if a pooled (pgbouncer) URL is ever used.
const sql = postgres(url, { max: 1, prepare: false });
try {
  await migrate(drizzle(sql), { migrationsFolder: "./drizzle" });
  console.log("[migrate] Migrations applied.");
} finally {
  await sql.end();
}
