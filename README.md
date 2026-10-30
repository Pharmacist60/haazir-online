# Haazir (online)

Staff attendance and payroll for **eco Pharmacy**. © The Pharmacist. All rights reserved.

Version 1.8.0. Runs free on **Supabase** (database and Haazir's rules) and **GitHub Pages** (the web pages).

## Addresses

After setup (see the setup guide), with your GitHub account `Pharmacist60`:

- Admin dashboard: `https://pharmacist60.github.io/haazir-online/admin/`
- Employee app: `https://pharmacist60.github.io/haazir-online/app/`
- Counter display: `https://pharmacist60.github.io/haazir-online/counter/`

In the Haazir Android app, use the address `https://pharmacist60.github.io/haazir-online`.

## How it fits together

- `web/`: the pages (admin dashboard, employee app, counter display), published on GitHub Pages.
- `supabase/functions/haazir/`: Haazir's rules, running as a Supabase Edge Function. The database tables are created automatically on first use.
- `.github/workflows/deploy.yml`: every change uploaded to GitHub updates both automatically.

The workflow needs, in the repository's **Settings → Secrets and variables → Actions**:

- Variable `SUPABASE_PROJECT_REF`: your Supabase project's Reference ID.
- Secret `SUPABASE_ACCESS_TOKEN`: a Supabase access token.

## Free plan notes

- Supabase pauses free projects after about a week without use. Daily attendance keeps it active; after a long closure, open the project in Supabase and press **Restore**.
- Haazir saves its own backup inside the database every day (the last 30 are kept). Download a copy regularly from **Backup & Restore**.
- Absence alerts and daily backups run every minute through the database timer (pg_cron). The App Updates page shows whether this is running.

## For developers

- The test server in the `test` folder runs the same rules on a computer with a local SQLite database and serves `web/` at `http://localhost:3400` (Node.js 22.13 or newer).
- `node build/build.js` rebuilds `web/admin/admin.js` and `web/app/app.js` from `src/` (needs the TypeScript compiler, used only to convert JSX). The version number comes from `VERSION` in `supabase/functions/haazir/api.js`.
