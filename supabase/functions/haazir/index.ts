// Haazir on Supabase Edge Functions (eco Pharmacy). © The Pharmacist. All rights reserved.
// Connects Haazir's rules (api.js) to the project's own Postgres database.
import postgres from 'npm:postgres@3.4.5';
import { createApi } from './api.js';

const sql = postgres(Deno.env.get('SUPABASE_DB_URL')!, { prepare: false, max: 3, idle_timeout: 20 });
// api.js writes "?" for values; Postgres expects $1, $2, ...
const numbered = (s: string) => { let i = 0; return s.replace(/\?/g, () => '$' + (++i)); };

const db = {
  dialect: 'pg',
  all: (s: string, p: unknown[] = []) => sql.unsafe(numbered(s), p as never[]),
  exec: (s: string) => sql.unsafe(s),
  tx: (fn: (t: unknown) => Promise<unknown>) => sql.begin(t => fn({ all: (s: string, p: unknown[] = []) => t.unsafe(numbered(s), p as never[]) })),
};

const base = Deno.env.get('SUPABASE_URL');
const api = createApi({
  db,
  timeZone: Deno.env.get('HAAZIR_TIMEZONE') || 'Asia/Karachi',
  cronUrl: base ? `${base}/functions/v1/haazir/api/cron` : null,
  allowOrigin: Deno.env.get('HAAZIR_ORIGIN') || '*',
});

Deno.serve(req => api.handle(req));
