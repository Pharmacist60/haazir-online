// Haazir API (eco Pharmacy). © The Pharmacist. All rights reserved.
// Runs as a Supabase Edge Function (see index.ts) and, for testing, under Node.js with SQLite.
import crypto from 'node:crypto';
import zlib from 'node:zlib';
import { Buffer } from 'node:buffer';
import * as L from './logic.js';

export const VERSION = '1.13.0';

/* ---------------- database layout ---------------- */
// Every table, with its columns. Used to create the database, and to back up and restore it.
const TABLES = {
  settings: ['key', 'value'],
  admins: ['username', 'name', 'role', 'pass_hash', 'created_at', 'notify', 'last_seen'],
  employees: ['id', 'name', 'role', 'pin_hash', 'joined', 'left_date', 'device_id', 'created_at', 'notes'],
  emp_settings: ['emp_id', 'eff_from', 'salary', 'start_time', 'end_time', 'hours', 'month_hours', 'off_days', 'leaves', 'grace', 'changed_by', 'changed_at', 'day_shifts'],
  devices: ['id', 'emp_id', 'label', 'status', 'is_change', 'requested_at', 'pin_fails', 'locked_until'],
  attendance: ['id', 'emp_key', 'date', 'in_time', 'out_time', 'method', 'created_at'],
  overtime: ['emp_id', 'date', 'hours', 'rate', 'approved_by'],
  late_requests: ['id', 'emp_id', 'date', 'in_time', 'out_time', 'reason', 'submitted_at', 'status', 'decided_by'],
  networks: ['id', 'name', 'ip'],
  audit: ['id', 'at', 'by_user', 'what'],
  events: ['id', 'at_ms', 'at', 'type', 'emp_id', 'text', 'uniq'],
};
const SERIAL_TABLES = ['attendance', 'late_requests', 'networks', 'audit', 'events'];
const DEFAULT_NOTIFY = '{"checkin":true,"checkout":true,"late":true,"absent":true,"overleave":true,"early":true,"pinreset":true,"device":false,"sound":true}';

function schema(dialect) {
  const pg = dialect === 'pg';
  const ID = pg ? 'SERIAL PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT';
  const REAL = pg ? 'DOUBLE PRECISION' : 'REAL';
  return [
    `CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS admins (username TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, pass_hash TEXT NOT NULL, created_at TEXT NOT NULL, notify TEXT NOT NULL DEFAULT '${DEFAULT_NOTIFY}', last_seen INTEGER NOT NULL DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS employees (id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL DEFAULT '', pin_hash TEXT NOT NULL, joined TEXT NOT NULL, left_date TEXT, device_id TEXT, created_at TEXT NOT NULL, notes TEXT)`,
    `CREATE TABLE IF NOT EXISTS emp_settings (emp_id TEXT NOT NULL, eff_from TEXT NOT NULL, salary ${REAL} NOT NULL, start_time TEXT NOT NULL, end_time TEXT NOT NULL, hours ${REAL} NOT NULL, month_hours ${REAL}, off_days TEXT NOT NULL, leaves INTEGER NOT NULL, grace INTEGER NOT NULL, changed_by TEXT, changed_at TEXT, day_shifts TEXT, PRIMARY KEY (emp_id, eff_from))`,
    `CREATE TABLE IF NOT EXISTS devices (id TEXT PRIMARY KEY, emp_id TEXT NOT NULL, label TEXT NOT NULL, status TEXT NOT NULL, is_change INTEGER NOT NULL DEFAULT 0, requested_at TEXT NOT NULL, pin_fails INTEGER NOT NULL DEFAULT 0, locked_until ${REAL} NOT NULL DEFAULT 0)`,
    `CREATE TABLE IF NOT EXISTS attendance (id ${ID}, emp_key TEXT NOT NULL, date TEXT NOT NULL, in_time TEXT NOT NULL, out_time TEXT, method TEXT NOT NULL, created_at TEXT NOT NULL, UNIQUE (emp_key, date))`,
    `CREATE TABLE IF NOT EXISTS overtime (emp_id TEXT NOT NULL, date TEXT NOT NULL, hours ${REAL} NOT NULL, rate ${REAL} NOT NULL, approved_by TEXT NOT NULL, PRIMARY KEY (emp_id, date))`,
    `CREATE TABLE IF NOT EXISTS late_requests (id ${ID}, emp_id TEXT NOT NULL, date TEXT NOT NULL, in_time TEXT, out_time TEXT, reason TEXT NOT NULL, submitted_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', decided_by TEXT)`,
    `CREATE TABLE IF NOT EXISTS networks (id ${ID}, name TEXT NOT NULL, ip TEXT NOT NULL UNIQUE)`,
    `CREATE TABLE IF NOT EXISTS audit (id ${ID}, at TEXT NOT NULL, by_user TEXT NOT NULL, what TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, username TEXT NOT NULL, expires_at ${REAL} NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS events (id ${ID}, at_ms ${REAL} NOT NULL, at TEXT NOT NULL, type TEXT NOT NULL, emp_id TEXT, text TEXT NOT NULL, uniq TEXT UNIQUE)`,
    `CREATE TABLE IF NOT EXISTS push_tokens (token TEXT PRIMARY KEY, username TEXT NOT NULL, created_at TEXT NOT NULL, last_seen TEXT NOT NULL)`,
    `CREATE TABLE IF NOT EXISTS backups (id ${ID}, created_ms ${REAL} NOT NULL, created_at TEXT NOT NULL, kind TEXT NOT NULL, size INTEGER NOT NULL, data TEXT NOT NULL)`,
  ];
}

/* ---------------- helpers ---------------- */
class Fail extends Error { constructor(status, message) { super(message); this.status = status; } }
const need = (cond, msg, status = 400) => { if (!cond) throw new Fail(status, msg); };
const sha = s => crypto.createHash('sha256').update(String(s)).digest('hex');
function hashSecret(secret) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `scrypt$${salt}$${crypto.scryptSync(String(secret), salt, 32).toString('hex')}`;
}
function checkSecret(secret, stored) {
  const [, salt, hash] = String(stored || '').split('$');
  if (!salt || !hash) return false;
  const a = crypto.scryptSync(String(secret), salt, 32), b = Buffer.from(hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const attempts = new Map();
function limited(key, max = 8, windowMs = 10 * 60 * 1000) {
  const now = Date.now(), r = attempts.get(key);
  if (!r || r.until < now) { attempts.set(key, { n: 1, until: now + windowMs }); return false; }
  r.n++; return r.n > max;
}
const rs = n => 'Rs ' + Math.round(n).toLocaleString('en-PK');
const adminLabel = a => `${a.name} (${a.role})`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;

/* ---------------- the API ---------------- */
// db: { dialect, all(sql, params), exec(sql), tx(async t => ...) }   (t has all())
export function createApi({ db, timeZone = 'Asia/Karachi', cronUrl = null, allowOrigin = '*', fetchFn = (...a) => fetch(...a) }) {
  L.setTimeZone(timeZone);
  const all = (sql, ...p) => db.all(sql, p);
  const one = async (sql, ...p) => (await db.all(sql, p))[0] || null;
  const run = (sql, ...p) => db.all(sql, p);
  const getSetting = async (k, d = null) => { const r = await one('SELECT value FROM settings WHERE key = ?', k); return r ? r.value : d; };
  const setSetting = (k, v) => run('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT (key) DO UPDATE SET value = excluded.value', k, String(v));
  const audit = (by, what) => run('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, what);

  let schemaReady = null;
  // Columns added in later versions (ignored if they already exist).
  const UPGRADES = [['employees', 'notes TEXT'], ['emp_settings', 'changed_by TEXT'], ['emp_settings', 'changed_at TEXT'], ['emp_settings', 'day_shifts TEXT']];
  const ensureSchema = () => (schemaReady = schemaReady || (async () => {
    for (const s of schema(db.dialect)) await db.exec(s);
    for (const [t, col] of UPGRADES) {
      try { await db.exec(db.dialect === 'pg' ? `ALTER TABLE ${t} ADD COLUMN IF NOT EXISTS ${col}` : `ALTER TABLE ${t} ADD COLUMN ${col}`); }
      catch (e) { if (!/duplicate|exists/i.test(e.message)) throw e; }
    }
  })().catch(e => { schemaReady = null; throw e; }));

  /* ----- network: the pharmacy's internet address ----- */
  const clientIP = req => {
    const h = req.headers;
    let ip = (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('cf-connecting-ip') || h.get('x-real-ip') || req.ip || '';
    if (ip.startsWith('::ffff:')) ip = ip.slice(7);
    if (ip === '::1') ip = '127.0.0.1';
    return ip;
  };
  const isPrivate = ip => /^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.)/.test(ip);
  // IPv6 addresses change often on the same network, so the network part (first 4 groups) is used.
  const networkKey = ip => {
    if (ip.includes(':')) { const g = ip.split(':'); return g.slice(0, 4).join(':') + ':'; }
    return isPrivate(ip) ? ip.split('.').slice(0, 3).join('.') + '.' : ip;
  };
  const atShop = async req => {
    const ip = clientIP(req); if (!ip) return false;
    return (await all('SELECT ip FROM networks')).some(n => (n.ip.endsWith('.') || n.ip.endsWith(':')) ? ip.startsWith(n.ip) : ip === n.ip);
  };

  /* ----- data shaping ----- */
  async function employees() {
    const sets = await all('SELECT * FROM emp_settings ORDER BY eff_from');
    return (await all('SELECT * FROM employees ORDER BY id')).map(e => ({
      id: e.id, name: e.name, role: e.role, joined: e.joined, left: e.left_date || null, phone: e.device_id || null, notes: e.notes || '',
      history: sets.filter(s => s.emp_id === e.id).map(s => ({
        from: s.eff_from, salary: Number(s.salary), start: s.start_time, end: s.end_time, hours: Number(s.hours),
        monthHours: s.month_hours == null ? null : Number(s.month_hours), off: JSON.parse(s.off_days), leaves: Number(s.leaves), grace: Number(s.grace),
        changedBy: s.changed_by || null, changedAt: s.changed_at || null, dayShifts: s.day_shifts ? JSON.parse(s.day_shifts) : {},
      })),
    }));
  }
  const employee = async id => (await employees()).find(e => e.id === id) || null;
  const recOut = a => ({ id: Number(a.id), empId: a.emp_key, date: a.date, in: a.in_time, out: a.out_time, method: a.method, synced: true });

  /* ----- admin sessions (sign-in token sent as "Authorization: Bearer ...") ----- */
  async function currentAdmin(req) {
    const m = /^Bearer\s+(\S+)$/.exec(req.headers.get('authorization') || ''); if (!m) return null;
    const s = await one('SELECT * FROM sessions WHERE token_hash = ?', sha(m[1]));
    if (!s || Number(s.expires_at) < Date.now()) return null;
    return one('SELECT username, name, role, notify, last_seen FROM admins WHERE username = ?', s.username);
  }
  async function startSession(username) {
    const token = crypto.randomBytes(32).toString('base64url');
    await run('INSERT INTO sessions (token_hash, username, expires_at) VALUES (?, ?, ?)', sha(token), username, Date.now() + 30 * 86400000);
    return token;
  }
  async function requireAdmin(req, superOnly = false) {
    const a = await currentAdmin(req);
    need(a, 'Please sign in.', 401);
    if (superOnly) need(a.role === 'Super Admin', 'Only a super admin can do this.', 403);
    return a;
  }
  const prefsOf = a => { try { return JSON.parse(a.notify); } catch { return {}; } };

  /* ----- counter code (6 digits, changes every 30 seconds) ----- */
  async function counterSecret() {
    let sec = await getSetting('counter_secret');
    if (!sec) { sec = crypto.randomBytes(20).toString('hex'); await setSetting('counter_secret', sec); }
    return sec;
  }
  function codeFor(slot, secret) {
    const msg = Buffer.alloc(8); msg.writeBigUInt64BE(BigInt(slot));
    const h = crypto.createHmac('sha1', Buffer.from(secret, 'hex')).update(msg).digest();
    const o = h[h.length - 1] & 15;
    return String((h.readUInt32BE(o) & 0x7fffffff) % 1000000).padStart(6, '0');
  }
  async function codeValid(code) {
    code = String(code || '').replace(/\D/g, '');
    if (code.length !== 6) return false;
    const secret = await counterSecret(), slot = Math.floor(Date.now() / 30000);
    for (let d = -2; d <= 1; d++) if (codeFor(slot + d, secret) === code) return true;
    return false;
  }

  // The day attendance tracking started. Set at owner setup; for older installations, the first attendance date.
  async function trackingStartDate() {
    let d = await getSetting('tracking_start');
    if (!d) {
      const first = await one('SELECT MIN(date) AS d FROM attendance');
      d = (first && first.d) || L.today();
      await setSetting('tracking_start', d);
    }
    return d;
  }

  async function rules() {
    return { earlyGrace: Number(await getSetting('early_grace', '15')), halfPct: Number(await getSetting('half_pct', '50')) };
  }

  /* ----- notifications ----- */
  const EVENT_TYPES = ['checkin', 'checkout', 'late', 'absent', 'overleave', 'early', 'pinreset'];
  async function addEvent(type, empId, text, uniq = null) {
    if (uniq && await one('SELECT 1 AS x FROM events WHERE uniq = ?', uniq)) return;
    try { await run('INSERT INTO events (at_ms, at, type, emp_id, text, uniq) VALUES (?, ?, ?, ?, ?, ?)', Date.now(), L.stamp(), type, empId, text, uniq); }
    catch (e) { if (!/unique|duplicate/i.test(e.message)) throw e; return; }
    await pushEvent(type, text).catch(e => console.error('Phone notification failed:', e.message));
  }

  /* ----- phone notifications (Firebase Cloud Messaging) ----- */
  const NOTE_TITLES = { checkin: 'Check-In', checkout: 'Check-Out', late: 'Late Arrival', absent: 'Not Checked In', overleave: 'Beyond Allowed Leaves', early: 'Left Early', pinreset: 'PIN Reset Request' };
  let fcmToken = null;
  async function fcmAccess(sa) {
    if (fcmToken && fcmToken.project === sa.project_id && fcmToken.until > Date.now()) return fcmToken.value;
    const b64 = o => Buffer.from(typeof o === 'string' ? o : JSON.stringify(o)).toString('base64url');
    const now = Math.floor(Date.now() / 1000);
    const head = b64({ alg: 'RS256', typ: 'JWT' }) + '.' + b64({ iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: sa.token_uri || 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 });
    const jwt = head + '.' + crypto.createSign('RSA-SHA256').update(head).sign(sa.private_key).toString('base64url');
    const r = await fetchFn(sa.token_uri || 'https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion: jwt }).toString() });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new Error('Firebase sign-in failed: ' + (j.error_description || j.error || r.status));
    fcmToken = { project: sa.project_id, value: j.access_token, until: Date.now() + 50 * 60000 };
    return j.access_token;
  }
  async function fcmSend(sa, token, title, body, type) {
    const access = await fcmAccess(sa);
    const r = await fetchFn(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
      method: 'POST', headers: { Authorization: 'Bearer ' + access, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { token, notification: { title, body }, data: { type: type || '', open: 'admin' },
        android: { priority: 'high', notification: { channel_id: 'haazir_alerts', sound: 'haazir_tone', icon: 'ic_stat_haazir', color: '#0F1561' } } } }),
    });
    if (r.ok) return 'sent';
    const j = await r.json().catch(() => ({}));
    const status = (j.error && j.error.status) || '';
    if (r.status === 404 || status === 'NOT_FOUND' || status === 'UNREGISTERED' || (status === 'INVALID_ARGUMENT' && /token/i.test(JSON.stringify(j)))) { await run('DELETE FROM push_tokens WHERE token = ?', token); return 'removed'; }
    throw new Error('Firebase rejected the notification: ' + ((j.error && j.error.message) || r.status));
  }
  async function pushTo(rows, title, body, type) {
    const raw = await getSetting('fcm_sa'); if (!raw || !rows.length) return { sent: 0, failed: 0 };
    const sa = JSON.parse(raw); let sent = 0, failed = 0;
    await Promise.all(rows.map(async r => { try { if ((await fcmSend(sa, r.token, title, body, type)) === 'sent') sent++; } catch (e) { failed++; console.error(e.message); } }));
    return { sent, failed };
  }
  // Each admin receives the types they have switched on in Notification Settings.
  async function pushEvent(type, text) {
    if (!(await getSetting('fcm_sa'))) return;
    const rows = await all('SELECT p.token, a.notify FROM push_tokens p JOIN admins a ON a.username = p.username');
    const wanted = rows.filter(r => { try { return JSON.parse(r.notify)[type] !== false; } catch { return true; } });
    await pushTo(wanted, 'Haazir: ' + (NOTE_TITLES[type] || 'Notification'), text, type);
  }
  async function priorAbsences(e, date) {
    const start = await trackingStartDate();
    const first = date.slice(0, 8) + '01' > start ? date.slice(0, 8) + '01' : start;
    const recs = new Set((await all('SELECT date FROM attendance WHERE emp_key = ? AND date >= ? AND date < ?', e.id, first, date)).map(r => r.date));
    let n = 0;
    for (let ds = first; ds < date; ds = L.addDays(ds, 1)) {
      if (!L.employed(e, ds)) continue;
      const s = L.settingsOn(e, ds); if (!s || s.off.includes(L.weekday(ds))) continue;
      if (!recs.has(ds)) n++;
    }
    return n;
  }
  async function checkAbsences() {
    const T = L.today(), Y = L.addDays(T, -1), nowM = L.toMin(L.nowTime());
    const start = await trackingStartDate();
    for (const e of await employees()) {
      if (L.isGone(e)) continue;
      for (const date of [Y, T]) {
        const s = L.settingsOn(e, date);
        if (!s || !L.employed(e, date) || s.off.includes(L.weekday(date)) || date < start) continue;
        if (date === Y && !L.overnight(s)) continue;
        const since = nowM + (date === Y ? 1440 : 0) - L.toMin(s.start);
        if (since < s.grace || since > 16 * 60) continue;
        if (await one('SELECT 1 AS x FROM attendance WHERE emp_key = ? AND date = ?', e.id, date)) continue;
        await addEvent('absent', e.id, `${e.name} has not checked in. The shift started at ${L.fmt(s.start)}.`, `absent:${e.id}:${date}`);
        const prior = await priorAbsences(e, date);
        if (prior >= s.leaves) await addEvent('overleave', e.id, `${e.name} is absent today and has already used all ${plural(s.leaves, 'paid leave')} this month (${plural(prior, 'absence')} so far).`, `overleave:${e.id}:${date}`);
      }
    }
  }

  /* ----- backups (kept inside the database; downloadable as a file) ----- */
  async function exportData() {
    const tables = {};
    for (const t of Object.keys(TABLES)) tables[t] = await all(`SELECT ${TABLES[t].join(', ')} FROM ${t}`);
    tables.settings = tables.settings.filter(r => r.key !== 'fcm_sa');
    return { app: 'haazir', format: 1, version: VERSION, created: L.stamp(), tables };
  }
  async function saveBackup(kind) {
    const json = JSON.stringify(await exportData());
    const data = zlib.gzipSync(Buffer.from(json)).toString('base64');
    await run('INSERT INTO backups (created_ms, created_at, kind, size, data) VALUES (?, ?, ?, ?, ?)', Date.now(), L.stamp(), kind, json.length, data);
    if (kind === 'Daily') {
      const old = await all("SELECT id FROM backups WHERE kind = 'Daily' ORDER BY created_ms DESC");
      for (const r of old.slice(30)) await run('DELETE FROM backups WHERE id = ?', r.id);
    }
  }
  function checkBackup(data) {
    need(data && data.app === 'haazir' && data.tables && typeof data.tables === 'object', 'This file is not a Haazir backup.');
    for (const t of ['admins', 'employees', 'attendance', 'emp_settings']) need(Array.isArray(data.tables[t]), 'This file is not a Haazir backup.');
    need(data.tables.admins.some(a => a.role === 'Super Admin'), 'This backup has no super admin account, so nobody could sign in after restoring it.');
    return { employees: data.tables.employees.length, attendance: data.tables.attendance.length };
  }
  async function restoreData(data, by, label) {
    const info = checkBackup(data);
    await saveBackup('Before restore');
    // The database timer's own settings belong to this Supabase project, not to the backup.
    const keep = await all("SELECT key, value FROM settings WHERE key IN ('cron_key', 'cron', 'fcm_sa')");
    await db.tx(async t => {
      const q = (sql, ...p) => t.all(sql, p);
      for (const name of Object.keys(TABLES)) await q(`DELETE FROM ${name}`);
      await q('DELETE FROM sessions');
      for (const [name, cols] of Object.entries(TABLES)) {
        for (const row of data.tables[name] || []) {
          await q(`INSERT INTO ${name} (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`, ...cols.map(c => row[c] === undefined ? null : row[c]));
        }
      }
      for (const k of keep) {
        await q('DELETE FROM settings WHERE key = ?', k.key);
        await q('INSERT INTO settings (key, value) VALUES (?, ?)', k.key, k.value);
      }
      if (db.dialect === 'pg') for (const name of SERIAL_TABLES) await q(`SELECT setval(pg_get_serial_sequence('${name}', 'id'), (SELECT COALESCE(MAX(id), 0) + 1 FROM ${name}), false)`);
      await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, `Restored data from ${label} (${plural(info.employees, 'employee')}, ${plural(info.attendance, 'attendance record')}). The previous data was saved as a "Before restore" backup.`);
    });
    return info;
  }

  /* ----- background jobs: absence alerts, daily backup, clean-up ----- */
  let lastJobs = 0, cronTried = false;
  async function runJobs(force = false) {
    if (!force && Date.now() - lastJobs < 55000) return;
    if (!(await one('SELECT 1 AS x FROM admins LIMIT 1'))) return;
    lastJobs = Date.now();
    await checkAbsences();
    const T = L.today();
    if ((await getSetting('last_backup')) !== T) { await setSetting('last_backup', T); await saveBackup('Daily'); }
    await run('DELETE FROM events WHERE at_ms < ?', Date.now() - 60 * 86400000);
    await run('DELETE FROM sessions WHERE expires_at < ?', Date.now());
  }
  // On Supabase, a database timer (pg_cron) calls /api/cron every minute so alerts arrive on time.
  async function setupCron() {
    if (db.dialect !== 'pg' || !cronUrl) return 'not needed';
    let key = await getSetting('cron_key');
    if (!key) { key = crypto.randomBytes(24).toString('hex'); await setSetting('cron_key', key); }
    try {
      await db.exec('CREATE EXTENSION IF NOT EXISTS pg_cron');
      await db.exec('CREATE EXTENSION IF NOT EXISTS pg_net');
      const headers = JSON.stringify({ 'Content-Type': 'application/json', 'X-Haazir': '1', 'X-Cron-Key': key }).replace(/'/g, "''");
      await db.exec(`SELECT cron.schedule('haazir-every-minute', '* * * * *', $cron$ SELECT net.http_post(url := '${cronUrl.replace(/'/g, "''")}', headers := '${headers}'::jsonb, body := '{}'::jsonb) $cron$)`);
      await setSetting('cron', 'ok');
      return 'ok';
    } catch (e) { await setSetting('cron', 'failed: ' + e.message); return 'failed'; }
  }

  /* ---------------- routes ---------------- */
  const routes = {};
  const route = (method, p, fn) => { routes[`${method} ${p}`] = fn; };

  route('GET', '/api/version', () => ({ version: VERSION }));

  route('GET', '/api/setup', async () => ({ needsSetup: !(await one('SELECT 1 AS x FROM admins LIMIT 1')) }));
  route('POST', '/api/setup', async ({ body: b }) => {
    need(!(await one('SELECT 1 AS x FROM admins LIMIT 1')), 'Setup is already complete.', 409);
    const name = String(b.name || '').trim(), username = String(b.username || '').trim().toLowerCase(), password = String(b.password || '');
    need(name && /^[a-z0-9._-]{3,30}$/.test(username), 'Enter your name and a username of 3–30 letters or numbers.');
    need(password.length >= 8, 'The password must be at least 8 characters.');
    await run('INSERT INTO admins (username, name, role, pass_hash, created_at) VALUES (?, ?, ?, ?, ?)', username, name, 'Super Admin', hashSecret(password), L.stamp());
    await setSetting('mode', 'both');
    await setSetting('tracking_start', L.today());
    await audit(`${name} (Super Admin)`, 'Created the Haazir owner account');
    await setupCron();
    return { ok: true, token: await startSession(username) };
  });

  route('POST', '/api/login', async ({ req, body: b }) => {
    need(!limited('login:' + clientIP(req)), 'Too many attempts. Please wait 10 minutes and try again.', 429);
    const a = await one('SELECT * FROM admins WHERE username = ?', String(b.username || '').trim().toLowerCase());
    need(a && checkSecret(String(b.password || ''), a.pass_hash), 'Incorrect username or password.', 401);
    return { ok: true, token: await startSession(a.username) };
  });
  route('POST', '/api/logout', async ({ req }) => {
    const m = /^Bearer\s+(\S+)$/.exec(req.headers.get('authorization') || '');
    if (m) await run('DELETE FROM sessions WHERE token_hash = ?', sha(m[1]));
    return { ok: true };
  });
  route('POST', '/api/password', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const row = await one('SELECT pass_hash FROM admins WHERE username = ?', a.username);
    need(checkSecret(String(b.current || ''), row.pass_hash), 'Your current password is incorrect.');
    need(String(b.next || '').length >= 8, 'The new password must be at least 8 characters.');
    await run('UPDATE admins SET pass_hash = ? WHERE username = ?', hashSecret(b.next), a.username);
    await audit(adminLabel(a), 'Changed their password');
    return { ok: true };
  });

  route('GET', '/api/state', async ({ req }) => {
    const a = await requireAdmin(req), sup = a.role === 'Super Admin';
    const since = L.addDays(L.today(), -400);
    const trackingStart = await trackingStartDate();
    if (sup && db.dialect === 'pg' && !cronTried && (await getSetting('cron')) !== 'ok') { cronTried = true; await setupCron(); }
    return {
      today: L.today(), now: L.nowTime(), version: VERSION, hosted: true, update: null,
      me: { key: 'admin:' + a.username, label: adminLabel(a), name: a.name, role: a.role, username: a.username, notify: prefsOf(a), lastSeen: Number(a.last_seen) },
      employees: await employees(),
      phones: (await all('SELECT id, label FROM devices')).map(d => ({ id: d.id, label: d.label })),
      requests: (await all("SELECT * FROM devices WHERE status = 'pending' ORDER BY requested_at")).map(d => ({ phoneId: d.id, empId: d.emp_id, at: d.requested_at, change: !!Number(d.is_change) })),
      attendance: (await all('SELECT * FROM attendance WHERE date >= ? ORDER BY date, id', since)).map(recOut),
      overtime: (await all('SELECT * FROM overtime ORDER BY date')).map(o => ({ empId: o.emp_id, date: o.date, hours: Number(o.hours), rate: Number(o.rate), by: o.approved_by })),
      lateReqs: (await all('SELECT * FROM late_requests ORDER BY id')).map(r => ({ id: Number(r.id), empId: r.emp_id, date: r.date, in: r.in_time, out: r.out_time, reason: r.reason, at: r.submitted_at, status: r.status, by: r.decided_by })),
      networks: sup ? (await all('SELECT * FROM networks ORDER BY id')).map(n => ({ ...n, id: Number(n.id) })) : [],
      shopIP: clientIP(req), atShop: await atShop(req),
      mode: await getSetting('mode', 'both'),
      admins: sup ? await all('SELECT username, name, role FROM admins ORDER BY role DESC, name') : [],
      audit: sup ? await all('SELECT at, by_user AS by, what FROM audit ORDER BY id DESC LIMIT 500') : [],
      cron: sup ? await getSetting('cron', '') : '',
      trackingStart, rules: await rules(),
      push: { configured: sup ? ((JSON.parse((await getSetting('fcm_sa')) || 'null') || {}).project_id || null) : !!(await getSetting('fcm_sa')), myDevices: Number((await one('SELECT CAST(COUNT(*) AS INTEGER) AS n FROM push_tokens WHERE username = ?', a.username)).n) },
    };
  });

  route('POST', '/api/admin/punch', async ({ req, body: b }) => {
    const a = await requireAdmin(req), sup = a.role === 'Super Admin', here = await atShop(req), byCode = !here && await codeValid(b.code);
    need(sup || here || byCode, b.code ? 'That counter code is incorrect or has expired.' : 'Attendance can be recorded only on the pharmacy network, or with the counter code.', 403);
    const key = 'admin:' + a.username, T = L.today(), t = L.nowTime();
    const rec = await one('SELECT * FROM attendance WHERE emp_key = ? AND date = ?', key, T);
    if (!rec) await run('INSERT INTO attendance (emp_key, date, in_time, method, created_at) VALUES (?, ?, ?, ?, ?)', key, T, t, here ? 'Pharmacy network' : byCode ? 'Counter Code' : 'Super Admin, remote', L.stamp());
    else { need(!rec.out_time, 'Your attendance for today is already complete.', 409); await run('UPDATE attendance SET out_time = ? WHERE id = ?', t, rec.id); }
    return { ok: true };
  });

  route('POST', '/api/attendance/save', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const e = await employee(b.empId); need(e, 'Employee not found.', 404);
    need(L.isDate(b.date) && b.date <= L.today(), 'Choose a valid date.');
    need(L.isTime(b.in), 'Please enter a check-in time.');
    need(!b.out || L.isTime(b.out), 'Please enter a valid check-out time.');
    const reason = String(b.reason || '').trim(); need(reason, 'A reason is required for the audit log.');
    const rec = await one('SELECT * FROM attendance WHERE emp_key = ? AND date = ?', e.id, b.date);
    if (rec) await run('UPDATE attendance SET in_time = ?, out_time = ?, method = ? WHERE id = ?', b.in, b.out || null, rec.method.endsWith('(corrected)') ? rec.method : rec.method + ' (corrected)', rec.id);
    else await run('INSERT INTO attendance (emp_key, date, in_time, out_time, method, created_at) VALUES (?, ?, ?, ?, ?, ?)', e.id, b.date, b.in, b.out || null, 'Added by admin', L.stamp());
    await audit(adminLabel(a), `${rec ? 'Corrected' : 'Added'} attendance for ${e.name} on ${L.niceDate(b.date)}: ${L.fmt(b.in)} – ${b.out ? L.fmt(b.out) : 'no check-out'}. Reason: ${reason}`);
    return { ok: true };
  });

  route('POST', '/api/attendance/delete', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const e = await employee(b.empId); need(e, 'Employee not found.', 404);
    const reason = String(b.reason || '').trim(); need(reason, 'A reason is required to delete an entry.');
    const rec = await one('SELECT * FROM attendance WHERE emp_key = ? AND date = ?', e.id, String(b.date || ''));
    need(rec, 'This entry no longer exists.', 404);
    await run('DELETE FROM attendance WHERE id = ?', rec.id);
    await audit(adminLabel(a), `Deleted attendance for ${e.name} on ${L.niceDate(rec.date)} (${L.fmt(rec.in_time)} – ${rec.out_time ? L.fmt(rec.out_time) : 'no check-out'}, ${rec.method}). Reason: ${reason}`);
    return { ok: true };
  });

  route('POST', '/api/employees/save', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const name = String(b.name || '').trim(), role = String(b.role || '').trim(), pin = String(b.pin || '');
    const notes = String(b.notes || '').trim().slice(0, 500);
    need(name, "Please enter the employee's name.");
    const old = b.editId ? await employee(b.editId) : null;
    if (b.editId) need(old, 'Employee not found.', 404);
    need(old ? (pin === '' || /^\d{4}$/.test(pin)) : /^\d{4}$/.test(pin), old ? 'A new PIN must be 4 digits, or leave it blank to keep the current PIN.' : 'PIN must be 4 digits.');
    need(L.isDate(b.joined), 'Please enter the joining date.');
    need(!b.left || (L.isDate(b.left) && b.left >= b.joined), 'The resign date cannot be earlier than the joining date.');
    const num = k => Number(b[k]);
    need(num('salary') > 0 && num('hours') > 0 && num('leaves') >= 0 && num('grace') >= 0, 'Please check the salary, hours, leaves and grace period.');
    need(L.isTime(b.start) && L.isTime(b.end), 'Please enter the shift start and end times.');
    const monthHours = b.monthHours === '' || b.monthHours == null ? null : Number(b.monthHours);
    need(monthHours === null || monthHours > 0 || monthHours === -1, 'Allowed hours per month must be a positive number, Automatic, or No limit.');
    const off = (Array.isArray(b.off) ? b.off : []).map(Number).filter(n => n >= 0 && n <= 6);
    const from = old ? b.from : b.joined; need(L.isDate(from), 'Choose the date these settings take effect.');
    // Day-specific hours: { "5": { start, end, hours } } keyed by weekday (0 = Sunday).
    const dayShifts = {};
    for (const [k, v] of Object.entries(b.dayShifts && typeof b.dayShifts === 'object' ? b.dayShifts : {})) {
      const day = Number(k);
      need(day >= 0 && day <= 6 && v && L.isTime(v.start) && L.isTime(v.end) && Number(v.hours) > 0 && Number(v.hours) <= 24, 'Please check the start, end and hours for each day with different hours.');
      dayShifts[day] = { start: v.start, end: v.end, hours: Number(v.hours), flexible: v.flexible !== false };
    }
    const entry = { from, salary: num('salary'), start: b.start, end: b.end, hours: num('hours'), monthHours, off, leaves: Math.round(num('leaves')), grace: Math.round(num('grace')), dayShifts };
    const by = adminLabel(a);
    const summary = `${rs(entry.salary)}, ${L.shiftText(entry)}, ${entry.hours} hrs/day, ${entry.monthHours === -1 ? 'automatic monthly hours' : entry.monthHours ? entry.monthHours + ' hrs/month allowed' : 'no monthly hours limit'}, ${entry.leaves} paid leaves/month, ${entry.grace} min grace${Object.keys(entry.dayShifts).length ? '; different hours: ' + Object.entries(entry.dayShifts).map(([d, v]) => `${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d]} ${L.shiftText(v)} (${v.hours} hrs)`).join(', ') : ''}`;
    await db.tx(async t => {
      const q = (sql, ...p) => t.all(sql, p);
      const saveSettings = id => q(`INSERT INTO emp_settings (emp_id, eff_from, salary, start_time, end_time, hours, month_hours, off_days, leaves, grace, changed_by, changed_at, day_shifts) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT (emp_id, eff_from) DO UPDATE SET salary = excluded.salary, start_time = excluded.start_time, end_time = excluded.end_time, hours = excluded.hours, month_hours = excluded.month_hours, off_days = excluded.off_days, leaves = excluded.leaves, grace = excluded.grace, changed_by = excluded.changed_by, changed_at = excluded.changed_at, day_shifts = excluded.day_shifts`,
        id, entry.from, entry.salary, entry.start, entry.end, entry.hours, entry.monthHours, JSON.stringify(entry.off), entry.leaves, entry.grace, by, L.stamp(), JSON.stringify(entry.dayShifts));
      if (old) {
        await q('UPDATE employees SET name = ?, role = ?, joined = ?, left_date = ?, notes = ? WHERE id = ?', name, role, b.joined, b.left || null, notes, old.id);
        if (pin) { await q('UPDATE employees SET pin_hash = ? WHERE id = ?', hashSecret(pin), old.id); await q('UPDATE devices SET pin_fails = 0, locked_until = 0 WHERE emp_id = ?', old.id); }
        await saveSettings(old.id);
        const first = (await q('SELECT eff_from FROM emp_settings WHERE emp_id = ? ORDER BY eff_from LIMIT 1', old.id))[0];
        if (b.joined < first.eff_from) await q('UPDATE emp_settings SET eff_from = ? WHERE emp_id = ? AND eff_from = ?', b.joined, old.id, first.eff_from);
        await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, `Updated ${name}'s settings from ${L.niceDate(entry.from)}: ${summary}`);
        if (old.joined !== b.joined) await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, `Changed ${name}'s joining date to ${L.longDate(b.joined)}`);
        if ((old.left || '') !== (b.left || '')) await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, b.left ? `Recorded resignation for ${name}, last working day ${L.longDate(b.left)}` : `Removed resign date for ${name}`);
        if (pin) await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, `Changed ${name}'s PIN`);
        if ((old.notes || '') !== notes) await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, notes ? `Updated remarks for ${name}: ${notes}` : `Removed remarks for ${name}`);
      } else {
        const max = (await q('SELECT id FROM employees')).map(r => Number(r.id.slice(1)) || 0).reduce((m, n) => Math.max(m, n), 0);
        const id = 'E' + String(max + 1).padStart(3, '0');
        await q('INSERT INTO employees (id, name, role, pin_hash, joined, left_date, created_at, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', id, name, role, hashSecret(pin), b.joined, b.left || null, L.stamp(), notes);
        await saveSettings(id);
        await q('INSERT INTO audit (at, by_user, what) VALUES (?, ?, ?)', L.stamp(), by, `Added employee ${name} (${id}) joining ${L.niceDate(b.joined)} at ${rs(entry.salary)}`);
      }
    });
    return { ok: true };
  });

  route('POST', '/api/devices/decide', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const d = await one('SELECT * FROM devices WHERE id = ?', String(b.phoneId || ''));
    need(d && d.status === 'pending', 'This request is no longer pending.', 409);
    const e = await employee(d.emp_id);
    await db.tx(async t => {
      const q = (sql, ...p) => t.all(sql, p);
      if (b.approve) {
        await q("UPDATE devices SET status = 'revoked' WHERE emp_id = ? AND status = 'approved'", d.emp_id);
        await q("UPDATE devices SET status = 'approved', pin_fails = 0, locked_until = 0 WHERE id = ?", d.id);
        await q('UPDATE employees SET device_id = ? WHERE id = ?', d.id, d.emp_id);
      } else await q("UPDATE devices SET status = 'rejected' WHERE id = ?", d.id);
    });
    await audit(adminLabel(a), `${b.approve ? 'Approved' : 'Rejected'} ${d.label} for ${e.name}${b.approve && Number(d.is_change) ? '. Previous phone deactivated' : ''}`);
    return { ok: true };
  });
  route('POST', '/api/devices/remove', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const e = await employee(b.empId); need(e && e.phone, 'This employee has no approved phone.');
    const d = await one('SELECT label FROM devices WHERE id = ?', e.phone);
    await run("UPDATE devices SET status = 'revoked' WHERE id = ?", e.phone);
    await run('UPDATE employees SET device_id = NULL WHERE id = ?', e.id);
    await audit(adminLabel(a), `Removed ${d ? d.label : 'phone'} from ${e.name}`);
    return { ok: true };
  });

  route('POST', '/api/overtime/approve', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const e = await employee(b.empId); need(e, 'Employee not found.', 404);
    const hours = Number(b.hours), rate = Number(b.rate);
    need(L.isDate(b.date), 'Choose a valid date.');
    need(hours > 0 && hours <= 16, 'Enter the overtime hours.');
    need([1, 1.5, 2].includes(rate), 'Choose a rate.');
    await run('INSERT INTO overtime (emp_id, date, hours, rate, approved_by) VALUES (?, ?, ?, ?, ?) ON CONFLICT (emp_id, date) DO UPDATE SET hours = excluded.hours, rate = excluded.rate, approved_by = excluded.approved_by', e.id, b.date, hours, rate, adminLabel(a));
    await audit(adminLabel(a), `Approved ${hours} hrs overtime for ${e.name} on ${L.niceDate(b.date)} at ${rate}× rate`);
    return { ok: true };
  });
  route('POST', '/api/overtime/cancel', async ({ req, body: b }) => {
    const a = await requireAdmin(req); const e = await employee(b.empId); need(e, 'Employee not found.', 404);
    await run('DELETE FROM overtime WHERE emp_id = ? AND date = ?', e.id, String(b.date));
    await audit(adminLabel(a), `Cancelled overtime for ${e.name} on ${L.niceDate(b.date)}`);
    return { ok: true };
  });

  route('POST', '/api/late/decide', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const r = await one('SELECT * FROM late_requests WHERE id = ?', Number(b.id));
    need(r && r.status === 'pending', 'This request has already been decided.', 409);
    const e = await employee(r.emp_id), by = adminLabel(a);
    await db.tx(async t => {
      const q = (sql, ...p) => t.all(sql, p);
      if (b.approve) {
        const rec = (await q('SELECT * FROM attendance WHERE emp_key = ? AND date = ?', r.emp_id, r.date))[0];
        if (rec) await q('UPDATE attendance SET out_time = COALESCE(out_time, ?), method = ? WHERE id = ?', r.out_time, rec.method + ', late check-out approved', rec.id);
        else await q('INSERT INTO attendance (emp_key, date, in_time, out_time, method, created_at) VALUES (?, ?, ?, ?, ?, ?)', r.emp_id, r.date, r.in_time, r.out_time, `Late entry, approved by ${by}`, L.stamp());
      }
      await q('UPDATE late_requests SET status = ?, decided_by = ? WHERE id = ?', b.approve ? 'approved' : 'rejected', by, r.id);
    });
    await audit(by, `${b.approve ? 'Approved' : 'Rejected'} late entry for ${e.name} on ${L.niceDate(r.date)}: ${L.fmt(r.in_time)} – ${r.out_time ? L.fmt(r.out_time) : 'no check-out'}`);
    return { ok: true };
  });

  route('POST', '/api/networks/add', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const raw = clientIP(req); need(raw, 'Your internet address could not be detected.');
    // "range" matches every address in the same block (e.g. 151.123.155.x), for providers that change the last part.
    const ip = b.range !== false && /^\d+\.\d+\.\d+\.\d+$/.test(raw) ? raw.split('.').slice(0, 3).join('.') + '.' : networkKey(raw);
    const name = String(b.name || '').trim() || 'Pharmacy internet';
    need(!(await one('SELECT 1 AS x FROM networks WHERE ip = ?', ip)), 'This connection is already registered.', 409);
    await run('INSERT INTO networks (name, ip) VALUES (?, ?)', name, ip);
    await audit(adminLabel(a), `Set "${name}" (${ip}) as a pharmacy network`);
    return { ok: true };
  });
  // Turns an exact address into its range (e.g. 151.123.155.122 → 151.123.155.x).
  route('POST', '/api/networks/widen', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const n = await one('SELECT * FROM networks WHERE id = ?', Number(b.id)); need(n, 'Network not found.', 404);
    need(/^\d+\.\d+\.\d+\.\d+$/.test(n.ip), 'This network already covers a range.');
    const range = n.ip.split('.').slice(0, 3).join('.') + '.';
    if (await one('SELECT 1 AS x FROM networks WHERE ip = ?', range)) await run('DELETE FROM networks WHERE id = ?', n.id);
    else await run('UPDATE networks SET ip = ? WHERE id = ?', range, n.id);
    await audit(adminLabel(a), `Changed "${n.name}" from ${n.ip} to the range ${range}x`);
    return { ok: true };
  });
  route('POST', '/api/networks/remove', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const n = await one('SELECT * FROM networks WHERE id = ?', Number(b.id)); need(n, 'Network not found.', 404);
    await run('DELETE FROM networks WHERE id = ?', n.id);
    await audit(adminLabel(a), `Removed "${n.name}" from pharmacy networks`);
    return { ok: true };
  });
  route('POST', '/api/settings/tracking', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    need(L.isDate(b.date) && b.date <= L.addDays(L.today(), 366), 'Choose a date within the next year.');
    await setSetting('tracking_start', b.date);
    await audit(adminLabel(a), `Set the attendance tracking start date to ${L.longDate(b.date)}`);
    return { ok: true };
  });
  // Phone notifications: the super admin uploads the Firebase service account key once.
  route('POST', '/api/push/config', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    let sa; try { sa = JSON.parse(String(b.json || '')); } catch { throw new Fail(400, 'This is not a valid Firebase key file.'); }
    need(sa && sa.type === 'service_account' && sa.project_id && sa.client_email && sa.private_key, 'This is not a Firebase service account key file. In Firebase, open Project settings → Service accounts → Generate new private key.');
    fcmToken = null;
    try { await fcmAccess(sa); } catch (e) { throw new Fail(400, 'Firebase did not accept this key: ' + e.message); }
    await setSetting('fcm_sa', JSON.stringify({ type: sa.type, project_id: sa.project_id, client_email: sa.client_email, private_key: sa.private_key, token_uri: sa.token_uri }));
    await audit(adminLabel(a), `Set up phone notifications for Firebase project ${sa.project_id}`);
    return { ok: true, project: sa.project_id };
  });
  route('POST', '/api/push/remove', async ({ req }) => {
    const a = await requireAdmin(req, true);
    await run("DELETE FROM settings WHERE key = 'fcm_sa'");
    await audit(adminLabel(a), 'Switched off phone notifications (removed the Firebase key)');
    return { ok: true };
  });
  route('POST', '/api/push/register', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const token = String(b.token || ''); need(token.length > 20 && token.length < 4096, 'Invalid notification token.');
    await run('INSERT INTO push_tokens (token, username, created_at, last_seen) VALUES (?, ?, ?, ?) ON CONFLICT (token) DO UPDATE SET username = excluded.username, last_seen = excluded.last_seen', token, a.username, L.stamp(), L.stamp());
    return { ok: true };
  });
  route('POST', '/api/push/unregister', async ({ body: b }) => {
    await run('DELETE FROM push_tokens WHERE token = ?', String(b.token || ''));
    return { ok: true };
  });
  route('POST', '/api/push/test', async ({ req }) => {
    const a = await requireAdmin(req);
    need(await getSetting('fcm_sa'), 'Phone notifications are not set up yet. A super admin sets them up under Admins & Security.');
    const rows = await all('SELECT token FROM push_tokens WHERE username = ?', a.username);
    need(rows.length, 'No phone is registered for your account yet. Open the Admin Dashboard in the Haazir Android app and allow notifications.');
    const r = await pushTo(rows, 'Haazir: Test', `This is a test notification for ${a.name}. Phone notifications are working.`, 'test');
    need(r.sent > 0, 'The test notification could not be sent. Check the Firebase setup.', 502);
    return { ok: true, ...r };
  });
  route('POST', '/api/settings/rules', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const g = Number(b.earlyGrace), h = Number(b.halfPct);
    need(Number.isFinite(g) && g >= 0 && g <= 240, 'The early leave grace must be between 0 and 240 minutes.');
    need(Number.isFinite(h) && h >= 10 && h <= 90, 'The half-day share must be between 10% and 90%.');
    await setSetting('early_grace', Math.round(g)); await setSetting('half_pct', Math.round(h));
    await audit(adminLabel(a), `Set early leave rules: ${Math.round(g)} min grace; half day needs ${Math.round(h)}% of daily hours`);
    return { ok: true };
  });
  route('POST', '/api/settings/mode', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    need(['both', 'either'].includes(b.mode), 'Choose a verification mode.');
    await setSetting('mode', b.mode);
    await audit(adminLabel(a), `Changed check-in verification to: ${b.mode === 'both' ? 'Biometric and PIN' : 'Biometric, with PIN as backup'}`);
    return { ok: true };
  });
  route('POST', '/api/admins/add', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const name = String(b.name || '').trim(), username = String(b.username || '').trim().toLowerCase(), role = b.role === 'Super Admin' ? 'Super Admin' : 'Admin';
    need(name && /^[a-z0-9._-]{3,30}$/.test(username), 'Please enter a name and a username of 3–30 letters or numbers.');
    need(String(b.password || '').length >= 8, 'The password must be at least 8 characters.');
    need(!(await one('SELECT 1 AS x FROM admins WHERE username = ?', username)), 'This username is already in use.', 409);
    await run('INSERT INTO admins (username, name, role, pass_hash, created_at) VALUES (?, ?, ?, ?, ?)', username, name, role, hashSecret(b.password), L.stamp());
    await audit(adminLabel(a), `Added ${role.toLowerCase()} ${name} (${username})`);
    return { ok: true };
  });
  route('POST', '/api/admins/remove', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const t = await one('SELECT * FROM admins WHERE username = ?', String(b.username || '')); need(t, 'Admin not found.', 404);
    need(t.username !== a.username, 'You cannot remove your own account.');
    await run('DELETE FROM sessions WHERE username = ?', t.username);
    await run('DELETE FROM admins WHERE username = ?', t.username);
    await audit(adminLabel(a), `Removed ${t.role.toLowerCase()} ${t.name} (${t.username})`);
    return { ok: true };
  });
  route('POST', '/api/admins/reset', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const t = await one('SELECT * FROM admins WHERE username = ?', String(b.username || '')); need(t, 'Admin not found.', 404);
    need(String(b.password || '').length >= 8, 'The password must be at least 8 characters.');
    await run('UPDATE admins SET pass_hash = ? WHERE username = ?', hashSecret(b.password), t.username);
    await run('DELETE FROM sessions WHERE username = ?', t.username);
    await audit(adminLabel(a), `Reset the password for ${t.name} (${t.username})`);
    return { ok: true };
  });

  // Counter display: gets the secret once (super admin) and then works offline.
  route('GET', '/api/counter/secret', async ({ req }) => { await requireAdmin(req, true); return { secret: await counterSecret(), serverTime: Date.now() }; });
  route('POST', '/api/counter/reset', async ({ req }) => {
    const a = await requireAdmin(req, true);
    await setSetting('counter_secret', crypto.randomBytes(20).toString('hex'));
    await audit(adminLabel(a), 'Reset the counter code. Counter displays must be set up again.');
    return { ok: true };
  });

  // Notifications.
  route('GET', '/api/events', async ({ req, url }) => {
    const a = await requireAdmin(req), prefs = prefsOf(a);
    const after = Number(url.searchParams.get('after') || 0);
    const types = EVENT_TYPES.filter(t => prefs[t] !== false);
    const rows = types.length ? await all(`SELECT id, at, type, emp_id AS "empId", text FROM events WHERE id > ? AND type IN (${types.map(() => '?').join(',')}) ORDER BY id DESC LIMIT 50`, after, ...types) : [];
    const latest = await one('SELECT MAX(id) AS m FROM events');
    return { events: rows.map(r => ({ ...r, id: Number(r.id) })), lastSeen: Number(a.last_seen), latestId: Number((latest && latest.m) || 0) };
  });
  route('POST', '/api/events/seen', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const id = Number(b.id) || 0;
    if (id > Number(a.last_seen)) await run('UPDATE admins SET last_seen = ? WHERE username = ?', id, a.username);
    return { ok: true };
  });
  route('POST', '/api/notify/prefs', async ({ req, body: b }) => {
    const a = await requireAdmin(req);
    const prefs = Object.fromEntries([...EVENT_TYPES, 'device', 'sound'].map(k => [k, b[k] === undefined ? (k === 'pinreset' || k === 'early') : !!b[k]]));
    await run('UPDATE admins SET notify = ? WHERE username = ?', JSON.stringify(prefs), a.username);
    return { ok: true };
  });

  // Backup & Restore (super admin).
  route('GET', '/api/backups', async ({ req }) => {
    await requireAdmin(req, true);
    return (await all('SELECT id, created_at, kind, size FROM backups ORDER BY created_ms DESC')).map(r => ({ id: Number(r.id), name: String(r.id), at: r.created_at, kind: r.kind, size: Number(r.size) }));
  });
  route('GET', '/api/backup/download', async ({ req }) => {
    const a = await requireAdmin(req, true);
    await audit(adminLabel(a), 'Downloaded a backup');
    const T = L.today(), t = L.nowTime().replace(':', '');
    return { __download: true, name: `haazir-backup-${T}-${t}.json`, body: JSON.stringify(await exportData()) };
  });
  route('GET', '/api/backups/file', async ({ req, url }) => {
    await requireAdmin(req, true);
    const r = await one('SELECT * FROM backups WHERE id = ?', Number(url.searchParams.get('name')));
    need(r, 'Backup not found.', 404);
    const json = zlib.gunzipSync(Buffer.from(r.data, 'base64')).toString('utf8');
    const created = JSON.parse(json).created || '';
    return { __download: true, name: `haazir-backup-${r.kind.toLowerCase().replace(/\s+/g, '-')}-${r.id}.json`, body: json, created };
  });
  route('POST', '/api/backup/restore', async ({ req, raw }) => {
    const a = await requireAdmin(req, true);
    let data; try { data = JSON.parse(raw); } catch { throw new Fail(400, 'This file is not a Haazir backup.'); }
    const info = await restoreData(data, adminLabel(a), 'an uploaded backup file');
    return { ok: true, ...info };
  });
  route('POST', '/api/backup/restore-saved', async ({ req, body: b }) => {
    const a = await requireAdmin(req, true);
    const r = await one('SELECT * FROM backups WHERE id = ?', Number(b.name)); need(r, 'Backup not found.', 404);
    const data = JSON.parse(zlib.gunzipSync(Buffer.from(r.data, 'base64')).toString('utf8'));
    const info = await restoreData(data, adminLabel(a), `the ${r.kind.toLowerCase()} backup from ${r.created_at}`);
    return { ok: true, ...info };
  });

  /* ----- employee app (identified by the phone's secret, sent as "X-Device") ----- */
  async function employeeForDevice(req) {
    const token = String(req.headers.get('x-device') || '');
    if (token.length < 32 || token.length > 200) return { dev: null };
    const id = sha(token);
    const row = await one('SELECT * FROM devices WHERE id = ?', id);
    const emp = await one('SELECT id FROM employees WHERE device_id = ?', id);
    return { dev: { id }, row, emp: emp ? await employee(emp.id) : null };
  }

  route('GET', '/api/device/status', async ({ req }) => {
    const { dev, row, emp } = await employeeForDevice(req);
    const base = { today: L.today(), now: L.nowTime(), atShop: await atShop(req), mode: await getSetting('mode', 'both') };
    if (!dev) return { ...base, status: 'unregistered' };
    if (emp) {
      if (L.isGone(emp)) return { ...base, status: 'ended', name: emp.name, left: emp.left };
      return {
        ...base, status: 'approved',
        employee: { id: emp.id, name: emp.name, joined: emp.joined, left: emp.left, history: emp.history },
        attendance: (await all('SELECT * FROM attendance WHERE emp_key = ? AND date >= ? ORDER BY date', emp.id, L.addDays(L.today(), -40))).map(recOut),
        lateReqs: (await all('SELECT * FROM late_requests WHERE emp_id = ? ORDER BY id DESC LIMIT 5', emp.id)).map(r => ({ id: Number(r.id), date: r.date, in: r.in_time, out: r.out_time, status: r.status })),
      };
    }
    if (row && row.status === 'pending') { const e = await employee(row.emp_id); return { ...base, status: 'pending', empId: e.id, name: e.name, change: !!Number(row.is_change) }; }
    return { ...base, status: 'unregistered', rejected: !!row && row.status === 'rejected' };
  });

  route('POST', '/api/device/register', async ({ req, body: b }) => {
    const { dev } = await employeeForDevice(req); need(dev, 'This browser could not be identified. Please reload the page.');
    need(!limited('reg:' + clientIP(req), 10), 'Too many attempts. Please wait 10 minutes and try again.', 429);
    const e = await employee(String(b.empId || '').trim().toUpperCase());
    const row = e && await one('SELECT pin_hash FROM employees WHERE id = ?', e.id);
    need(e && checkSecret(String(b.pin || ''), row.pin_hash), 'Incorrect employee ID or PIN. Please contact your admin.', 401);
    need(!L.isGone(e), 'This employee ID is no longer active.', 403);
    need(e.phone !== dev.id, 'This phone is already approved.', 409);
    const label = String(b.label || 'Phone').slice(0, 60);
    await run(`INSERT INTO devices (id, emp_id, label, status, is_change, requested_at) VALUES (?, ?, ?, 'pending', ?, ?)
       ON CONFLICT (id) DO UPDATE SET emp_id = excluded.emp_id, label = excluded.label, status = 'pending', is_change = excluded.is_change, requested_at = excluded.requested_at`,
      dev.id, e.id, `${e.name.split(' ')[0]}'s ${label}`, e.phone ? 1 : 0, L.stamp());
    return { ok: true };
  });

  route('POST', '/api/punch', async ({ req, body: b }) => {
    const { dev, row, emp } = await employeeForDevice(req);
    need(emp, 'This phone is not approved for attendance.', 403);
    need(!L.isGone(emp), 'Access has ended for this employee ID.', 403);
    need(Number(row.locked_until) < Date.now(), 'Too many incorrect PINs. Please try again in 5 minutes.', 429);
    // Location: the pharmacy network, or the counter code when the phone is not on it.
    const here = await atShop(req);
    need(here || await codeValid(b.code), b.code ? 'That counter code is incorrect or has expired. Please enter the code currently shown at the counter.' : 'You are not connected to the pharmacy internet. Enter the counter code to record attendance.', 403);
    // Identity: fingerprint or face unlock in the Haazir Android app, and/or the PIN, as set by the super admin.
    const mode = await getSetting('mode', 'both');
    const inApp = req.headers.get('x-haazir-app') === '1';
    const bio = inApp && b.bio === true;
    const pinNeeded = mode === 'both' || !bio;
    if (mode === 'both' && inApp && !bio) need(b.bioUnavailable === true, 'Fingerprint or face verification is required.', 401);
    if (pinNeeded) {
      const pinRow = await one('SELECT pin_hash FROM employees WHERE id = ?', emp.id);
      if (!checkSecret(String(b.pin || ''), pinRow.pin_hash)) {
        const fails = Number(row.pin_fails) + 1;
        await run('UPDATE devices SET pin_fails = ?, locked_until = ? WHERE id = ?', fails >= 5 ? 0 : fails, fails >= 5 ? Date.now() + 5 * 60 * 1000 : 0, dev.id);
        throw new Fail(401, fails >= 5 ? 'Too many incorrect PINs. Please try again in 5 minutes.' : 'Incorrect PIN. Please try again.');
      }
      await run('UPDATE devices SET pin_fails = 0 WHERE id = ?', dev.id);
    }
    const method = (here ? 'Pharmacy network' : 'Counter Code') + (bio && pinNeeded ? ', fingerprint and PIN' : bio ? ', fingerprint' : ', PIN');
    const T = L.today(), t = L.nowTime(), nowM = L.toMin(t);
    const mine = (await all('SELECT * FROM attendance WHERE emp_key = ? AND date >= ?', emp.id, L.addDays(T, -1))).map(recOut);
    const open = L.openRecord(emp, mine, T, nowM);
    const shiftDate = open ? open.date : L.pickShiftDate(emp, nowM, T);
    need(L.settingsOn(emp, shiftDate) && L.employed(emp, shiftDate), 'Your employment has not started yet.', 403);
    const rec = open || mine.find(a => a.date === shiftDate);
    if (!rec) {
      await run('INSERT INTO attendance (emp_key, date, in_time, method, created_at) VALUES (?, ?, ?, ?, ?)', emp.id, shiftDate, t, method, L.stamp());
      const s = L.settingsOn(emp, shiftDate), late = Math.max(0, L.rel(t, s) - L.toMin(s.start) - s.grace);
      await addEvent('checkin', emp.id, `${emp.name} checked in at ${L.fmt(t)}.`);
      const lateText = late >= 60 ? `${Math.floor(late / 60)} hr ${late % 60} min` : `${late} min`;
      if (late > 0) await addEvent('late', emp.id, `${emp.name} arrived ${lateText} late. The shift started at ${L.fmt(s.start)}.`);
      return { action: 'in', time: t };
    }
    need(!rec.out, 'Your shift is already complete.', 409);
    await run('UPDATE attendance SET out_time = ? WHERE id = ?', t, rec.id);
    await addEvent('checkout', emp.id, `${emp.name} checked out at ${L.fmt(t)}.`);
    const so = L.settingsOn(emp, rec.date), rl = await rules();
    const early = (L.toMin(so.end) + (L.overnight(so) ? 1440 : 0)) - L.rel(t, so);
    const workedMin = L.rel(t, so) - L.rel(rec.in, so);
    if (so.flexible) {
      if (workedMin < so.hours * 60 * rl.halfPct / 100) await addEvent('early', emp.id, `${emp.name} checked out after only ${Math.floor(workedMin / 60)} hr ${workedMin % 60} min on a flexible-hours day. This counts as an absence.`);
    } else if (early > rl.earlyGrace) {
      const worked = workedMin;
      const earlyText = early >= 60 ? `${Math.floor(early / 60)} hr ${early % 60} min` : `${early} min`;
      await addEvent('early', emp.id, `${emp.name} left ${earlyText} early (shift ends ${L.fmt(so.end)}). This counts as ${worked >= so.hours * 60 * rl.halfPct / 100 ? 'a half day' : 'an absence'}.`);
    }
    return { action: 'out', time: t };
  });

  // Employees change their own PIN (they must know the current one).
  route('POST', '/api/device/pin', async ({ req, body: b }) => {
    const { dev, row, emp } = await employeeForDevice(req);
    need(emp && !L.isGone(emp), 'This phone is not approved for attendance.', 403);
    need(Number(row.locked_until) < Date.now(), 'Too many incorrect PINs. Please try again in 5 minutes.', 429);
    const pinRow = await one('SELECT pin_hash FROM employees WHERE id = ?', emp.id);
    if (!checkSecret(String(b.current || ''), pinRow.pin_hash)) {
      const fails = Number(row.pin_fails) + 1;
      await run('UPDATE devices SET pin_fails = ?, locked_until = ? WHERE id = ?', fails >= 5 ? 0 : fails, fails >= 5 ? Date.now() + 5 * 60 * 1000 : 0, dev.id);
      throw new Fail(401, fails >= 5 ? 'Too many incorrect PINs. Please try again in 5 minutes.' : 'Your current PIN is incorrect.');
    }
    const next = String(b.next || '');
    need(/^\d{4}$/.test(next), 'The new PIN must be 4 digits.');
    need(next !== String(b.current), 'The new PIN must be different from the current one.');
    need(!/^(\d)\1{3}$/.test(next) && !['1234', '4321', '0123', '9876'].includes(next), 'Please choose a less obvious PIN than repeated or sequential digits.');
    await run('UPDATE employees SET pin_hash = ? WHERE id = ?', hashSecret(next), emp.id);
    await run('UPDATE devices SET pin_fails = 0 WHERE id = ?', dev.id);
    await audit(`${emp.name} (${emp.id})`, 'Changed their own PIN from their phone');
    return { ok: true };
  });
  // Employees who forgot their PIN ask an admin to set a new one.
  route('POST', '/api/device/pin-forgot', async ({ req }) => {
    const { emp } = await employeeForDevice(req);
    need(emp && !L.isGone(emp), 'This phone is not approved for attendance. Please speak to your admin.', 403);
    need(!limited('pinforgot:' + emp.id, 3, 60 * 60 * 1000), 'Your request has already been sent. Please speak to your admin.', 429);
    await addEvent('pinreset', emp.id, `${emp.name} (${emp.id}) forgot their PIN and asked for a reset. Set a new PIN under Employees.`, `pinreset:${emp.id}:${L.today()}`);
    await audit(`${emp.name} (${emp.id})`, 'Asked an admin to reset their PIN');
    return { ok: true };
  });

  route('POST', '/api/late/request', async ({ req, body: b }) => {
    const { emp } = await employeeForDevice(req);
    need(emp && !L.isGone(emp), 'This phone is not approved for attendance.', 403);
    const T = L.today();
    need(L.isDate(b.date) && b.date <= T && b.date >= L.addDays(T, -7) && L.employed(emp, b.date), 'Choose a date within the last 7 days.');
    const existing = await one('SELECT * FROM attendance WHERE emp_key = ? AND date = ?', emp.id, b.date);
    need(!(existing && existing.out_time), 'Both times are already recorded for this date. Please contact your admin for corrections.');
    const inT = existing ? existing.in_time : b.in;
    need(L.isTime(inT), 'Please enter the check-in time.');
    need(!b.out || L.isTime(b.out), 'Please enter a valid check-out time.');
    const reason = String(b.reason || '').trim().slice(0, 300); need(reason, 'Please provide a reason.');
    need(!(await one("SELECT 1 AS x FROM late_requests WHERE emp_id = ? AND date = ? AND status = 'pending'", emp.id, b.date)), 'A request for this date is already pending.', 409);
    await run('INSERT INTO late_requests (emp_id, date, in_time, out_time, reason, submitted_at) VALUES (?, ?, ?, ?, ?, ?)', emp.id, b.date, inT, b.out || null, reason, L.stamp());
    return { ok: true };
  });

  // Called every minute by the database timer (pg_cron).
  route('POST', '/api/cron', async ({ req }) => {
    const key = await getSetting('cron_key');
    need(key && req.headers.get('x-cron-key') === key, 'Not allowed.', 403);
    await runJobs(true);
    return { ok: true };
  });

  /* ---------------- request handler ---------------- */
  const cors = req => ({
    'Access-Control-Allow-Origin': allowOrigin === '*' ? '*' : (req.headers.get('origin') === allowOrigin ? allowOrigin : allowOrigin),
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Device, X-Haazir, X-Haazir-App, X-Cron-Key',
    'Access-Control-Expose-Headers': 'Content-Disposition',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  });
  const json = (req, status, obj) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(req) } });

  async function handle(req) {
    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(req) });
    const url = new URL(req.url);
    const i = url.pathname.indexOf('/api/');
    const path = i >= 0 ? url.pathname.slice(i) : url.pathname;
    const fn = routes[`${req.method} ${path}`];
    if (!fn) return json(req, 404, { error: 'Not found.' });
    try {
      await ensureSchema();
      if (path !== '/api/cron') await runJobs().catch(e => console.error('Background jobs failed:', e.message));
      let raw = '', body = {};
      if (req.method === 'POST') {
        need(req.headers.get('x-haazir') === '1', 'Request blocked.', 403);
        raw = await req.text();
        need(raw.length <= (path === '/api/backup/restore' ? 100 * 1048576 : 100000), 'The request is too large.', 413);
        if (path !== '/api/backup/restore') { try { body = raw ? JSON.parse(raw) : {}; } catch { throw new Fail(400, 'Invalid request.'); } }
      }
      const out = await fn({ req, url, body, raw });
      if (out && out.__download) {
        return new Response(out.body, { status: 200, headers: { 'Content-Type': 'application/json', 'Content-Disposition': `attachment; filename="${out.name}"`, 'Cache-Control': 'no-store', ...cors(req) } });
      }
      return json(req, 200, out);
    } catch (e) {
      const status = e instanceof Fail ? e.status : 500;
      if (status === 500) console.error(e);
      return json(req, status, { error: status === 500 ? 'Something went wrong on the server. Please try again.' : e.message });
    }
  }

  return { handle, runJobs, routes };
}
