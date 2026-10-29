// Runs Haazir on this computer for testing: the same rules as on Supabase, with a local SQLite database.
// Usage: node test/local.mjs   (then open http://localhost:3400/admin/)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';
import { createApi } from '../supabase/functions/haazir/api.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const WEB = path.join(here, '..', 'web');
const file = process.env.HAAZIR_TEST_DB || path.join(here, 'test.db');
const sqlite = new DatabaseSync(file);
const conv = v => (v === undefined ? null : typeof v === 'boolean' ? (v ? 1 : 0) : v);
const db = {
  dialect: 'sqlite',
  all: async (s, p = []) => {
    const st = sqlite.prepare(s);
    return /^\s*(select|with)|returning/i.test(s) ? st.all(...p.map(conv)) : (st.run(...p.map(conv)), []);
  },
  exec: async s => sqlite.exec(s),
  tx: async fn => {
    sqlite.exec('BEGIN');
    try { const r = await fn({ all: db.all }); sqlite.exec('COMMIT'); return r; } catch (e) { sqlite.exec('ROLLBACK'); throw e; }
  },
};
const api = createApi({ db });
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.css': 'text/css' };
const port = Number(process.env.PORT || 3400);

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  if (url.pathname.startsWith('/api/')) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const ip = (req.socket.remoteAddress || '').replace('::ffff:', '');
    const headers = new Headers(req.headers); if (!headers.get('x-forwarded-for')) headers.set('x-forwarded-for', ip === '::1' ? '127.0.0.1' : ip);
    const r = await api.handle(new Request(url, { method: req.method, headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) }));
    res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer())); return;
  }
  let f = path.normalize(path.join(WEB, decodeURIComponent(url.pathname)));
  if (!f.startsWith(WEB)) { res.writeHead(403); return res.end(); }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
}).listen(port, () => console.log(`Haazir test server: http://localhost:${port}/admin/  (data: ${file})`));
