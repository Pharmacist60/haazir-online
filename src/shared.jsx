/* Haazir shared code (eco Pharmacy). Built into public/admin/admin.js and public/app/app.js by build/build.js. */
const { useState, useEffect, useRef } = React;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap');
.pa{--green:#007A1F;--green-d:#00661A;--green-bg:#E3F3E3;--ink:#0F1561;--muted:#575E7E;--paper:#F4F6FA;--line:#D9DDEA;--amber:#8A5A08;--amber-bg:#FCF1DC;--red:#B42318;--red-bg:#FCE9E7;
font-family:'Atkinson Hyperlegible',system-ui,sans-serif;color:var(--ink);background:var(--paper);min-height:100vh;font-size:15px;line-height:1.45}
.pa *{box-sizing:border-box}
.pa button{font:inherit;cursor:pointer}
.pa input,.pa select{font:inherit;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:8px;padding:7px 10px;width:100%}
.pa :focus-visible{outline:3px solid #6FC46F;outline-offset:2px}
.num,.t td{font-variant-numeric:tabular-nums}
.demobar{display:flex;align-items:center;gap:14px;padding:0 20px;background:var(--ink);color:#C9CCE6;font-size:13px;min-height:38px;flex-wrap:wrap}
.demobar .lead{color:#fff;font-weight:700}
.demobar nav{display:flex;align-self:stretch}
.demobar button{border:0;background:none;color:#C9CCE6;padding:0 14px;font-size:13px;border-bottom:2px solid transparent;min-height:38px}
.demobar button.on{color:#fff;border-bottom-color:#33CC33;font-weight:700}
.topbar{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;padding:10px 24px;background:#fff;border-bottom:1px solid var(--line)}
.topright{display:flex;align-items:center;gap:18px;flex-wrap:wrap}
.topdate{color:var(--muted);font-size:14px}
.userchip{display:flex;align-items:center;gap:10px;padding:4px 14px 4px 4px;border:1px solid var(--line);border-radius:999px;background:#fff}
.avatar{width:34px;height:34px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:13px;font-weight:700}
.userchip b{display:block;font-size:14px;line-height:1.15}
.userchip small{display:block;color:var(--muted);font-size:12px;line-height:1.15}
.brand{display:flex;align-items:center;gap:10px;color:var(--ink)}
.brand img{width:42px;height:42px}
.wordmark{display:flex;flex-direction:column;line-height:1.1}
.wordmark b{font-size:24px;letter-spacing:.01em}
.wordmark small{font-size:12px;color:var(--muted)}
.eco{color:#009900;font-weight:700}
.demo-note{font-weight:400;font-size:13px;color:var(--muted)}
.cross{display:inline-block;width:22px;height:22px;background:#009900;clip-path:polygon(33% 0,67% 0,67% 33%,100% 33%,100% 67%,67% 67%,67% 100%,33% 100%,33% 67%,0 67%,0 33%,33% 33%)}
.seg{display:inline-flex;background:#EEF0F7;border-radius:999px;padding:3px}
.seg button{border:0;background:transparent;color:var(--muted);padding:6px 14px;border-radius:999px;font-size:14px}
.seg button.on{background:var(--ink);color:#fff;font-weight:700}
.btn{border:1px solid #C5CADB;background:#fff;color:var(--ink);border-radius:8px;height:38px;padding:0 16px;font-weight:700;font-size:14px;display:inline-flex;align-items:center;gap:8px;justify-content:center;white-space:nowrap}
.btn:hover{background:#F6F7FB}
.btn.primary:hover{background:var(--green-d)}
.btn.primary{background:var(--green);border-color:var(--green);color:#fff}
.btn.danger{color:var(--red);border-color:#E7B4B0}
.btn.small{height:32px;padding:0 12px;font-size:13px}
.btn.block{width:100%;height:46px}
.btn.tall{height:auto;min-height:46px;padding:10px 16px;white-space:normal}
.admin{display:grid;grid-template-columns:288px minmax(0,1fr);min-height:calc(100vh - 104px)}
.copy{text-align:center;font-size:12px;color:var(--muted);padding-top:12px;margin-top:auto;border-top:1px solid var(--line)}
.side{border-right:1px solid var(--line);padding:18px 14px;background:#EBEEF6}
.side span.lbl2{white-space:nowrap}
.side .navgroup{background:#fff;border:1px solid #DCE0EC;border-radius:14px;padding:8px;margin-bottom:14px}
.side .group{font-size:12px;font-weight:700;color:#8A90AB;padding:2px 6px 8px}
.side button{display:flex;gap:11px;align-items:center;width:100%;height:44px;border:1px solid #E1E4EF;background:#FAFBFE;padding:0 10px 0 7px;border-radius:10px;color:var(--ink);text-align:left;font-size:14px;font-weight:700;margin-top:6px;white-space:nowrap}
.side button:hover{background:#F1F3FA;border-color:#B9BFDA}
.side .ico{width:30px;height:30px;border-radius:8px;display:grid;place-items:center;background:#EEF0F7;color:var(--ink);flex-shrink:0}
.side button.on{background:var(--ink);border-color:var(--ink);color:#fff;box-shadow:0 4px 10px rgba(15,21,97,.22)}
.side button.on .ico{background:#009900;color:#fff}
.side button .tag{margin-left:auto}
.side button.on .tag{background:#fff;color:var(--ink)}
.main{padding:24px 28px;max-width:1100px;width:100%;min-width:0;display:flex;flex-direction:column}
.main h1{font-size:23px;margin:0 0 6px;letter-spacing:-.005em}
.sub{color:var(--muted);margin:0 0 22px;max-width:72ch;font-size:14px}
.panel{background:#fff;border:1px solid var(--line);border-radius:10px;padding:16px;margin-bottom:18px;overflow-x:auto}
.panel h2{font-size:16px;margin:0 0 12px}
.panel p{margin:0 0 10px;max-width:70ch}
table.t{width:100%;border-collapse:collapse;font-size:14px}
.t th{text-align:left;font-weight:700;color:var(--muted);font-size:13px;padding:8px;border-bottom:1px solid var(--line);white-space:nowrap}
.t td{padding:9px 8px;border-bottom:1px solid #ECEFF6;vertical-align:middle}
.t tr.click{cursor:pointer}
.t tr.click:hover td{background:#F6F8FC}
.t .r{text-align:right}
.t .nw{white-space:nowrap}
.t tr.total td{font-weight:700;border-top:2px solid var(--line)}
.tag{display:inline-block;font-size:12px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--green-bg);color:var(--green-d);white-space:nowrap}
.tag.amber{background:var(--amber-bg);color:var(--amber)}.tag.red{background:var(--red-bg);color:var(--red)}.tag.grey{background:#EEF0F6;color:var(--muted)}
.fields{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px;margin-bottom:12px}
.field label,.lbl{display:block;font-size:13px;color:var(--muted);margin-bottom:4px}
.row{display:flex;gap:10px;flex-wrap:wrap;align-items:end}
.chips{display:flex;gap:6px;flex-wrap:wrap}
.chips button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:4px 10px;font-size:13px}
.chips button.on{background:var(--ink);color:#fff;border-color:var(--ink)}
.err{color:var(--red);font-size:14px;margin-top:8px}
.muted{color:var(--muted)}
.breakdown{background:var(--paper);border-radius:8px;padding:12px 14px;margin:4px 0 8px}
.breakdown div{display:flex;justify-content:space-between;gap:16px;padding:3px 0}
.breakdown div.pay{border-top:1px solid var(--line);margin-top:6px;padding-top:8px;font-weight:700}
.radio{display:flex;gap:10px;align-items:flex-start;padding:10px;border:1px solid var(--line);border-radius:8px;margin-bottom:8px;cursor:pointer}
.radio.on{border-color:var(--green);background:var(--green-bg)}
.radio input{width:auto;margin-top:4px}
.stage{display:flex;flex-direction:column;align-items:center;padding:24px 12px;gap:14px}
.demo-strip{width:100%;max-width:380px;background:#fff;border:1px dashed #A5ABC8;border-radius:10px;padding:10px 12px;font-size:13px}
.demo-inline{border:1px dashed #A5ABC8;border-radius:8px;padding:6px 10px;width:fit-content}
.demo-strip h4{margin:0 0 8px;font-size:13px;color:var(--ink)}
.phone{width:100%;max-width:380px;min-height:620px;background:#fff;border:10px solid var(--ink);border-radius:36px;padding:20px 18px;display:flex;flex-direction:column;gap:14px}
.status{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)}
.status span{display:inline-flex;align-items:center;gap:4px}
.hello h2{font-size:21px;margin:0}
.hello p{margin:2px 0 0;color:var(--muted);font-size:14px}
.punch{width:168px;height:168px;border-radius:50%;border:0;background:#009900;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;font-size:19px;font-weight:700;margin:12px auto;box-shadow:0 0 0 12px #E3F3E3}
.punch .cross{background:#fff;width:30px;height:30px}
.punch.out{background:#C62828;box-shadow:0 0 0 12px #FBE4E4}
.btn.in{background:#009900;border-color:#009900;color:#fff}
.btn.out{background:#C62828;border-color:#C62828;color:#fff}
.punch:active{transform:scale(.97)}
.sheet{border:1px solid var(--line);border-radius:14px;padding:16px;text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center}
.sheet h3{margin:0;font-size:17px}
.sheet p{margin:0;font-size:14px;color:var(--muted)}
.sheet.ok{background:var(--green-bg);border-color:#B6DBCB}
.viewfinder{padding:12px;border-radius:12px;background:#0F1561}
.qrbox{display:grid;background:#fff;padding:8px}
.pinpad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%}
.pinpad button{border:1px solid var(--line);background:#fff;border-radius:10px;height:48px;font-size:18px}
.dots{display:flex;gap:12px;justify-content:center}
.dots span{width:13px;height:13px;border-radius:50%;border:2px solid var(--ink)}
.dots span.f{background:var(--ink)}
.mini{font-size:13px;width:100%;border-collapse:collapse}
.mini td{padding:5px 2px;border-bottom:1px solid #ECEFF6}
.latebanner{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:16px;padding:12px 12px 12px 14px;color:#fff;text-align:left;background:linear-gradient(135deg,#0F1561 0%,#1F2A8C 100%);box-shadow:0 6px 14px rgba(15,21,97,.25)}
.latebanner:hover{filter:brightness(1.08)}
.latebanner:active{transform:scale(.99)}
.latebanner .ic{width:38px;height:38px;border-radius:10px;background:#009900;display:grid;place-items:center;flex-shrink:0}
.latebanner .txt{display:flex;flex-direction:column;line-height:1.25}
.latebanner b{font-size:14.5px}
.latebanner small{font-size:13px;color:#C9CCE6}
.latebanner .go{margin-left:auto;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.14);display:grid;place-items:center;flex-shrink:0}
.nb{white-space:nowrap}
.seg2{display:inline-flex;border:1px solid #C5CADB;border-radius:10px;overflow:hidden;background:#fff}
.seg2 button{border:0;background:#fff;color:var(--ink);height:38px;padding:0 16px;font-weight:700;font-size:14px}
.seg2 button+button{border-left:1px solid #C5CADB}
.seg2 button.on{background:var(--ink);color:#fff}
.stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-bottom:18px}
.stat{background:#fff;border:1px solid var(--line);border-radius:12px;padding:14px 16px}
.stat span{display:block;font-size:13px;color:var(--muted)}
.stat b{display:block;font-size:22px;margin-top:2px;font-variant-numeric:tabular-nums}
.stat small{display:block;font-size:12px;color:var(--muted);margin-top:2px}
.bar{height:8px;border-radius:99px;background:#E6E9F3;margin-top:10px;overflow:hidden}
.bar i{display:block;height:100%;border-radius:99px;background:#009900}
.bar i.over{background:#C62828}
.pos{color:#00661A}.neg{color:var(--red)}
.lateform{display:flex;flex-direction:column;gap:10px;text-align:left;width:100%}
.phonebrand{display:flex;align-items:center;gap:8px;color:var(--ink)}
.phonebrand img{width:34px;height:34px}
.phonebrand .wordmark b{font-size:20px}
.notice{display:flex;gap:8px;align-items:flex-start;background:var(--amber-bg);color:var(--amber);border-radius:8px;padding:8px 10px;font-size:13px;text-align:left}
@media (prefers-reduced-motion:no-preference){.pop{animation:pop .25s ease-out}@keyframes pop{from{transform:scale(.94);opacity:0}to{transform:none;opacity:1}}}
@media(max-width:760px){.topdate{display:none}.topbar{flex-wrap:nowrap;padding:10px 16px}.userchip{padding:3px}.userchip>span:last-child{display:none}.topbar .wordmark small{display:none}.side .navgroup{display:contents}.admin{grid-template-columns:minmax(0,1fr)}.side{display:flex;gap:6px;overflow-x:auto;border-right:0;border-bottom:1px solid var(--line);padding:10px}.side button{white-space:nowrap;width:auto;margin:0;border-color:#DCE0EC}.side .group{display:none}.main{padding:16px}}

.bell{position:relative;width:40px;height:40px;border-radius:50%;border:1px solid var(--line);background:#fff;display:grid;place-items:center;color:var(--ink)}
.bell .dot{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:99px;background:#C62828;color:#fff;font-size:11px;font-weight:700;display:grid;place-items:center;border:2px solid #fff}
.menu.notes{width:360px;max-width:92vw;max-height:70vh;overflow:auto}
.noteshead{display:flex;justify-content:space-between;align-items:center;padding:6px 8px 10px}
.note{padding:10px 12px;border-radius:8px;font-size:14px;display:flex;flex-direction:column;gap:4px;align-items:flex-start}
.note.unread{background:#F1F3FA}
.note small,.popup small{color:var(--muted);font-size:12px}
.popups{position:fixed;right:18px;bottom:18px;display:flex;flex-direction:column;gap:10px;z-index:60;width:340px;max-width:calc(100vw - 36px)}
.popup{background:#fff;border:1px solid var(--line);border-left:5px solid #009900;border-radius:12px;padding:12px 14px;box-shadow:0 10px 24px rgba(15,21,97,.18);display:flex;flex-direction:column;gap:6px}
.popup.grey{border-left-color:#0F1561}.popup.amber{border-left-color:#C98A0B}.popup.red{border-left-color:#C62828}
.popup .ptext{font-size:14px}
.popup .x{border:0;background:none;color:var(--muted);padding:2px;cursor:pointer}
.modalwrap{position:fixed;inset:0;background:rgba(15,21,97,.35);display:grid;place-items:center;padding:16px;z-index:70}
.modal{background:#fff;border-radius:16px;padding:22px;width:100%;max-width:520px;max-height:90vh;overflow:auto}
.modal h2{margin:0 0 4px;font-size:19px}
.switchrow{display:flex;justify-content:space-between;align-items:center;gap:16px;padding:12px 0;border-bottom:1px solid #ECEFF6;cursor:pointer}
.switchrow b{display:block;font-size:14px}
.switchrow small{display:block;color:var(--muted);font-size:13px}
.pa input.switch{appearance:none;-webkit-appearance:none;width:46px;height:26px;border-radius:99px;background:#C9CDDD;position:relative;flex-shrink:0;border:0;padding:0;cursor:pointer;transition:background .15s}
.pa input.switch::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.25);transition:left .15s}
.pa input.switch:checked{background:#009900}
.pa input.switch:checked::after{left:23px}
.updbar{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#EEF0F8;border:1px solid #D4D8EA;color:var(--ink);border-radius:12px;padding:10px 14px;margin-bottom:18px;font-size:14px}
.updbar span{flex:1;min-width:200px}
.relnotes{white-space:pre-wrap;background:var(--paper);border-radius:10px;padding:12px 14px;font-size:14px;max-height:320px;overflow:auto}
.pa a.btn{text-decoration:none}
.linkish{border:0;background:none;color:var(--green-d);font-weight:700;font-size:14px;padding:6px;text-decoration:underline;cursor:pointer}
.printhead{display:none}
@media print{.pa{background:#fff}.side,.topbar,.updbar,.popups,.noprint,.toast,.pa button,.pa select,.seg2{display:none!important}.admin{display:block}.main{padding:0;max-width:none}.panel{border:0;padding:0;overflow:visible}.printhead{display:block;margin-bottom:10px;font-size:13px;color:#575E7E}.stats{grid-template-columns:repeat(4,1fr)}}
.codein{font-size:30px!important;letter-spacing:.3em;text-align:center;font-variant-numeric:tabular-nums}
.authwrap{min-height:100vh;display:grid;place-items:center;padding:24px;background:var(--paper)}
.authcard{width:100%;max-width:400px;background:#fff;border:1px solid var(--line);border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:14px}
.authcard .brand{margin-bottom:6px}
.authcard h1{font-size:21px;margin:0}
.authcard p{margin:0;color:var(--muted);font-size:14px}
.toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:var(--ink);color:#fff;padding:12px 18px;border-radius:10px;font-size:14px;max-width:90vw;z-index:50;box-shadow:0 8px 20px rgba(15,21,97,.3)}
.toast.bad{background:#B42318}
.acct{position:relative}
.acct>button{cursor:pointer;font:inherit;color:inherit}
.menu{position:absolute;right:0;top:calc(100% + 6px);background:#fff;border:1px solid var(--line);border-radius:12px;padding:6px;min-width:200px;box-shadow:0 10px 24px rgba(15,21,97,.15);z-index:40}
.menu button{display:flex;gap:10px;align-items:center;width:100%;border:0;background:none;padding:10px 12px;border-radius:8px;font-size:14px;font-weight:700;color:var(--ink);text-align:left}
.menu button:hover{background:#F3F5FB}
.loading{min-height:60vh;display:grid;place-items:center;color:var(--muted)}
.applayout{min-height:100vh;display:flex;justify-content:center;background:var(--paper)}
.appscreen{width:100%;max-width:440px;min-height:100vh;background:#fff;padding:18px 18px 24px;display:flex;flex-direction:column;gap:14px}
@media(min-width:480px){.appscreen{margin:20px 0;min-height:auto;border:1px solid var(--line);border-radius:24px}}
`;


const LOGO = "../logo.png";

/* ---------- helpers ---------- */
const pad = n => String(n).padStart(2, "0");
const dstr = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const toMin = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
const fromMin = m => `${pad(Math.floor(m / 60))}:${pad(m % 60)}`;
const nowTime = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
let TODAY = dstr(new Date());
const fmt = t => { if (!t) return "—"; let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${pad(m)} ${ap}`; };
const stamp = () => `${longDate(TODAY)}, ${fmt(nowTime())}`;
// A shift whose end is at or before its start runs past midnight (night shift).
const overnight = s => toMin(s.end) <= toMin(s.start);
// Minutes from midnight of the shift's start date, so 2:00 AM on a night shift counts as 26:00.
const rel = (t, s) => { let m = toMin(t); if (overnight(s) && m < toMin(s.start) - 360) m += 1440; return m; };
const shiftText = s => `${fmt(s.start)} – ${fmt(s.end)}${overnight(s) ? " (next day)" : ""}`;
const timeText = (t, s) => !t ? "—" : fmt(t) + (s && rel(t, s) >= 1440 ? " (next day)" : "");
const daysIn = (y, m) => new Date(y, m, 0).getDate();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekday = ds => new Date(ds + "T00:00:00").getDay();
const addDays = (ds, n) => { const d = new Date(ds + "T00:00:00"); d.setDate(d.getDate() + n); return dstr(d); };
let YEST = addDays(TODAY, -1);
let FIRST_MONTH = TODAY.slice(0, 7);
// The server decides the date (Pakistan time); the browser follows it so every screen agrees.
function setClock(today, firstDate) { TODAY = today; YEST = addDays(today, -1); if (firstDate) FIRST_MONTH = firstDate.slice(0, 7); }
const longDate = ds => new Date(ds + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
// Resigned staff can still work on their last day; access ends the day after.
const isGone = e => !!e.left && e.left < TODAY;
const employed = (e, ds) => ds >= e.joined && (!e.left || ds <= e.left);
const rs = n => "Rs " + Math.round(n).toLocaleString("en-PK");
const minText = m => m >= 60 ? `${Math.floor(m / 60)} hr ${m % 60} min` : `${m} min`;
const niceDate = ds => new Date(ds + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const monthName = ym => new Date(ym + "-01T00:00:00").toLocaleString("en-GB", { month: "long", year: "numeric" });
function settingsOn(e, ds) { let s = null; for (const h of e.history) if (h.from <= ds) s = h; return s; }
const lateBeyond = (rec, s) => Math.max(0, rel(rec.in, s) - toMin(s.start) - s.grace);
const extraAfterShift = (rec, s) => rel(rec.out, s) - (toMin(s.end) + (overnight(s) ? 1440 : 0));
// Decide whether a check-in now belongs to today's shift or to last night's shift.
function pickShiftDate(e, nowM) {
  const sT = settingsOn(e, TODAY), sY = settingsOn(e, YEST);
  if (!sT || !sY || !overnight(sY)) return TODAY;
  return Math.abs(nowM + 1440 - toMin(sY.start)) < Math.abs(nowM - toMin(sT.start)) ? YEST : TODAY;
}
function monthsList() {
  const out = []; let [y, m] = FIRST_MONTH.split("-").map(Number); const [ty, tm] = TODAY.slice(0, 7).split("-").map(Number);
  while (y < ty || (y === ty && m <= tm)) { out.push(`${y}-${pad(m)}`); m++; if (m > 12) { m = 1; y++; } }
  return out.reverse();
}

/* ---------- salary calculation ---------- */
function calcSalary(e, ym, attendance, overtime) {
  const [y, m] = ym.split("-").map(Number); const dim = daysIn(y, m);
  let base = 0, lateDed = 0, lateCount = 0, lateMins = 0, otPay = 0, otHours = 0, present = 0;
  const absences = [];
  const lastS = settingsOn(e, `${ym}-${pad(dim)}`);
  for (let d = 1; d <= dim; d++) {
    const ds = `${ym}-${pad(d)}`;
    if (!employed(e, ds)) continue;
    const s = settingsOn(e, ds); if (!s) continue;
    const dp = s.salary / dim; base += dp;
    if (ds >= TODAY || s.off.includes(weekday(ds))) continue;
    const rec = attendance.find(a => a.synced && a.empId === e.id && a.date === ds);
    if (!rec) { absences.push({ ds, dp }); continue; }
    present++;
    const lm = lateBeyond(rec, s);
    if (lm > 0) { lateCount++; lateMins += lm; lateDed += lm * dp / (s.hours * 60); }
    const ot = overtime.find(o => o.empId === e.id && o.date === ds);
    if (ot) { otHours += ot.hours; otPay += ot.hours * (dp / s.hours) * ot.rate; }
  }
  // Paid leaves are pro-rated when the employee joins or leaves during the month.
  let empDays = 0; for (let d = 1; d <= dim; d++) if (employed(e, `${ym}-${pad(d)}`)) empDays++;
  const leaves = lastS ? Math.round(lastS.leaves * empDays / dim) : 0;
  const unpaid = absences.slice(leaves);
  const absDed = unpaid.reduce((t, a) => t + a.dp, 0);
  const covered = Math.min(leaves, absences.length);
  const inProgress = `${ym}-${pad(dim)}` >= TODAY;
  const daily = lastS ? lastS.salary / dim : 0;
  // Paid leaves not taken are paid extra at the daily rate, once the month is complete.
  const unusedLeaves = Math.max(0, leaves - absences.length);
  const leavePay = inProgress ? 0 : unusedLeaves * daily;
  return { base, present, absences: absences.length, leaves, covered, unpaid: unpaid.length, absDed, unusedLeaves, leavePay, lateCount, lateMins, lateDed, otHours, otPay, payable: base - absDed - lateDed + otPay + leavePay, inProgress, daily };
}

function Copyright() {
  return <div className="copy">© {new Date().getFullYear()} <span style={{ color: "#009900", fontWeight: 700 }}>The Pharmacist</span>. All rights reserved.</div>;
}


/* ---------- Haazir Android app bridge ---------- */
// Inside the Haazir Android app, fingerprint checks and file saving go through the app itself.
const inAndroidApp = () => typeof window.HaazirApp !== "undefined";
function askApp(message, callbackName) {
  return new Promise(resolve => { window[callbackName] = (...args) => { delete window[callbackName]; resolve(args); }; window.HaazirApp.postMessage(JSON.stringify(message)); });
}
function bufToBase64(buf) {
  const bytes = new Uint8Array(buf); let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
function base64ToBlob(b64) {
  const bin = atob(b64); const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: "application/octet-stream" });
}
// Saves a file: through the app's Save screen on Android, or as a normal download in a browser.
async function saveBlob(blob, name) {
  if (inAndroidApp()) {
    const [saved, msg] = await askApp({ type: "save", name, data: bufToBase64(await blob.arrayBuffer()) }, "hzAppSaved");
    if (!saved && msg !== "cancelled") throw new Error(msg || "The file could not be saved on this phone.");
    return saved;
  }
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return true;
}

/* ---------- Excel files (.xlsx) ---------- */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(bytes) { let c = 0xffffffff; for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zipFiles(files) {
  const enc = new TextEncoder(); const parts = []; const central = []; let offset = 0;
  for (const [name, text] of files) {
    const nameB = enc.encode(name), data = enc.encode(text), crc = crc32(data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true); local.setUint16(4, 20, true); local.setUint16(8, 0, true);
    local.setUint32(14, crc, true); local.setUint32(18, data.length, true); local.setUint32(22, data.length, true); local.setUint16(26, nameB.length, true);
    parts.push(new Uint8Array(local.buffer), nameB, data);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true); cen.setUint16(4, 20, true); cen.setUint16(6, 20, true);
    cen.setUint32(16, crc, true); cen.setUint32(20, data.length, true); cen.setUint32(24, data.length, true); cen.setUint16(28, nameB.length, true); cen.setUint32(42, offset, true);
    central.push(new Uint8Array(cen.buffer), nameB);
    offset += 30 + nameB.length + data.length;
  }
  const cenSize = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true); end.setUint32(12, cenSize, true); end.setUint32(16, offset, true);
  return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
// rows: arrays of strings/numbers. The first row is the bold heading row.
function makeXlsx(sheetName, rows) {
  const esc = v => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const col = i => { let s = ""; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
  const widths = rows[0].map((_, c) => Math.min(40, Math.max(...rows.map(r => String(r[c] ?? "").length)) + 2));
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols><sheetData>${rows.map((r, ri) => `<row r="${ri + 1}">${r.map((v, ci) => {
    const ref = col(ci) + (ri + 1), st = ri === 0 ? ' s="1"' : "";
    return typeof v === "number" && isFinite(v) ? `<c r="${ref}"${st}><v>${Math.round(v * 100) / 100}</v></c>` : `<c r="${ref}" t="inlineStr"${st}><is><t>${esc(v ?? "")}</t></is></c>`;
  }).join("")}</row>`).join("")}</sheetData></worksheet>`;
  return zipFiles([
    ["[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>'],
    ["_rels/.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'],
    ["xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(sheetName.slice(0, 31))}" sheetId="1" r:id="rId1"/></sheets></workbook>`],
    ["xl/_rels/workbook.xml.rels", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'],
    ["xl/worksheets/sheet1.xml", sheet],
    ["xl/styles.xml", '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>'],
  ]);
}

// Downloads a file from Haazir (with the sign-in token) and saves it.
async function downloadFile(path, fallbackName) {
  let res;
  try { res = await fetch(API_BASE + path, { headers: authHeaders(), cache: "no-store" }); }
  catch { throw new Error("Could not reach the Haazir server. Check your internet connection and try again."); }
  if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "The file could not be downloaded."); }
  const name = ((res.headers.get("Content-Disposition") || "").match(/filename="([^"]+)"/) || [])[1] || fallbackName;
  return saveBlob(await res.blob(), name);
}
async function apiUpload(path, blob) {
  let res;
  try { res = await fetch(API_BASE + path, { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/octet-stream", "X-Haazir": "1" }, body: blob }); }
  catch { throw new Error("Could not reach the Haazir server. Check your internet connection and try again."); }
  const d = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(d.error || "The request failed.");
  return d;
}

/* ---------- notification tone ---------- */
// A short two-note chime. Browsers allow sound only after the page has been tapped or clicked once.
let audioCtx = null;
function unlockAudio() { try { audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)(); if (audioCtx.state === "suspended") audioCtx.resume(); } catch { /* no audio */ } }
if (typeof window !== "undefined") { window.addEventListener("pointerdown", unlockAudio, { once: false }); window.addEventListener("keydown", unlockAudio, { once: false }); }
function playChime() {
  try {
    unlockAudio(); if (!audioCtx || audioCtx.state !== "running") return;
    const t0 = audioCtx.currentTime;
    [[880, 0], [1318.5, 0.16]].forEach(([f, d]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0 + d); g.gain.exponentialRampToValueAtTime(0.35, t0 + d + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.6);
      o.connect(g).connect(audioCtx.destination); o.start(t0 + d); o.stop(t0 + d + 0.65);
    });
  } catch { /* no audio */ }
}

/* ---------- server calls ---------- */
// The Haazir server address is set in ../config.js (window.HAAZIR_API).
const API_BASE = (window.HAAZIR_API || "").replace(/\/$/, "");
function authHeaders() {
  const t = localStorage.getItem("hz_token");
  return { ...(t ? { Authorization: "Bearer " + t } : {}), ...(window.HZ_DEVICE ? { "X-Device": window.HZ_DEVICE } : {}), ...(inAndroidApp() ? { "X-Haazir-App": "1" } : {}) };
}
async function api(path, body) {
  const headers = authHeaders();
  const opts = body === undefined ? { headers } : { method: "POST", headers: { ...headers, "Content-Type": "application/json", "X-Haazir": "1" }, body: JSON.stringify(body) };
  let res;
  try { res = await fetch(API_BASE + path, { ...opts, cache: "no-store" }); }
  catch { const e = new Error("Could not reach the Haazir server. Check your internet connection and try again."); e.status = 0; throw e; }
  let data = {}; try { data = await res.json(); } catch { /* empty */ }
  if (!res.ok) { const e = new Error(data.error || "Something went wrong. Please try again."); e.status = res.status; throw e; }
  return data;
}
// Notices when the server has been updated to a newer version than the page that is open.
function useServerVersion() {
  const [v, setV] = useState(null);
  useEffect(() => {
    const check = async () => { try { const r = await api("/api/version"); setV(r.version); } catch { /* offline */ } };
    check(); const t = setInterval(check, 60000); return () => clearInterval(t);
  }, []);
  return v;
}
function Toast({ toast }) { return toast ? <div className={"toast" + (toast.bad ? " bad" : "")} role="status">{toast.text}</div> : null; }
function useToast() {
  const [toast, setToast] = useState(null); const timer = useRef();
  const show = (text, bad) => { setToast({ text, bad }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 4000); };
  return [toast, show];
}
