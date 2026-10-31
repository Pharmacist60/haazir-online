// Haazir time and shift rules (eco Pharmacy). All dates and times are Pakistan time (Asia/Karachi).
// Date-only values are 'YYYY-MM-DD' strings and times are 'HH:MM' strings.

let TZ = 'Asia/Karachi';
export const setTimeZone = tz => { TZ = tz || TZ; };

export const pad = n => String(n).padStart(2, '0');
const parts = (d = new Date()) => {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', { timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(d).map(x => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour === '24' ? '00' : p.hour}:${p.minute}` };
};
export const today = () => parts().date;
export const nowTime = () => parts().time;
export const dateOf = ms => parts(new Date(ms)).date;
export const timeOf = ms => parts(new Date(ms)).time;

// Date arithmetic on plain dates, done in UTC so it never depends on the server's own time zone.
const utc = ds => new Date(ds + 'T00:00:00Z');
const dstr = d => `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
export const addDays = (ds, n) => { const d = utc(ds); d.setUTCDate(d.getUTCDate() + n); return dstr(d); };
export const weekday = ds => utc(ds).getUTCDay();
export const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
export const isDate = s => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(utc(s));
export const isTime = s => typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s);

export const fmt = t => { if (!t) return '—'; let [h, m] = t.split(':').map(Number); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${pad(m)} ${ap}`; };
export const longDate = ds => utc(ds).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' });
export const niceDate = ds => utc(ds).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'UTC' });
export const stamp = (ms = Date.now()) => `${longDate(dateOf(ms))}, ${fmt(timeOf(ms))}`;

// A shift whose end is at or before its start runs past midnight (night shift).
export const overnight = s => toMin(s.end) <= toMin(s.start);
// Minutes from midnight of the shift's start date, so 2:00 AM on a night shift counts as 26:00.
export const rel = (t, s) => { let m = toMin(t); if (overnight(s) && m < toMin(s.start) - 360) m += 1440; return m; };
export const shiftText = s => `${fmt(s.start)} – ${fmt(s.end)}${overnight(s) ? ' (next day)' : ''}`;

export function settingsOn(e, ds, raw = false) {
  let s = null; for (const h of e.history) if (h.from <= ds) s = h;
  // Day-specific hours (for example a different Friday shift) replace the normal shift on that weekday.
  const d = s && !raw && s.dayShifts ? s.dayShifts[weekday(ds)] : null;
  // Flexible (the default): the end time is not fixed, so extra time is not overtime and there is no early-leave check.
  return d ? { ...s, start: d.start, end: d.end, hours: d.hours, special: true, flexible: d.flexible !== false } : s;
}
export const employed = (e, ds) => ds >= e.joined && (!e.left || ds <= e.left);
// Resigned staff can still work on their last day; access ends the day after.
export const isGone = e => !!e.left && e.left < today();

// Decide whether a check-in now belongs to today's shift or to last night's shift.
export function pickShiftDate(e, nowM, TODAY) {
  const YEST = addDays(TODAY, -1);
  const sT = settingsOn(e, TODAY), sY = settingsOn(e, YEST);
  if (!sT || !sY || !overnight(sY)) return TODAY;
  return Math.abs(nowM + 1440 - toMin(sY.start)) < Math.abs(nowM - toMin(sT.start)) ? YEST : TODAY;
}

// The record a punch right now should close (checked in within the last 16 hours, not yet out).
export function openRecord(e, records, TODAY, nowM) {
  const YEST = addDays(TODAY, -1);
  return records.find(a => {
    if (a.out || (a.date !== TODAY && a.date !== YEST)) return false;
    const sa = settingsOn(e, a.date); if (!sa) return false;
    const since = nowM - (rel(a.in, sa) - (a.date === YEST ? 1440 : 0));
    return since >= -60 && since <= 16 * 60;
  }) || null;
}
