"use strict";
"use strict";
const APP_VERSION = "1.3.0";
/* Icons from Lucide (ISC License), https://lucide.dev */
const ICON_TREES = {
    Clock: [{ "tag": "circle", "attr": { "cx": "12", "cy": "12", "r": "10" }, "child": [] }, { "tag": "polyline", "attr": { "points": "12 6 12 12 16 14" }, "child": [] }],
    Fingerprint: [{ "tag": "path", "attr": { "d": "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" }, "child": [] }, { "tag": "path", "attr": { "d": "M14 13.12c0 2.38 0 6.38-1 8.88" }, "child": [] }, { "tag": "path", "attr": { "d": "M17.29 21.02c.12-.6.43-2.3.5-3.02" }, "child": [] }, { "tag": "path", "attr": { "d": "M2 12a10 10 0 0 1 18-6" }, "child": [] }, { "tag": "path", "attr": { "d": "M2 16h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M21.8 16c.2-2 .131-5.354 0-6" }, "child": [] }, { "tag": "path", "attr": { "d": "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" }, "child": [] }, { "tag": "path", "attr": { "d": "M8.65 22c.21-.66.45-1.32.57-2" }, "child": [] }, { "tag": "path", "attr": { "d": "M9 6.8a6 6 0 0 1 9 5.2v2" }, "child": [] }],
    Wifi: [{ "tag": "path", "attr": { "d": "M12 20h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M2 8.82a15 15 0 0 1 20 0" }, "child": [] }, { "tag": "path", "attr": { "d": "M5 12.859a10 10 0 0 1 14 0" }, "child": [] }, { "tag": "path", "attr": { "d": "M8.5 16.429a5 5 0 0 1 7 0" }, "child": [] }],
    WifiOff: [{ "tag": "path", "attr": { "d": "M12 20h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M8.5 16.429a5 5 0 0 1 7 0" }, "child": [] }, { "tag": "path", "attr": { "d": "M5 12.859a10 10 0 0 1 5.17-2.69" }, "child": [] }, { "tag": "path", "attr": { "d": "M19 12.859a10 10 0 0 0-2.007-1.523" }, "child": [] }, { "tag": "path", "attr": { "d": "M2 8.82a15 15 0 0 1 4.177-2.643" }, "child": [] }, { "tag": "path", "attr": { "d": "M22 8.82a15 15 0 0 0-11.288-3.764" }, "child": [] }, { "tag": "path", "attr": { "d": "m2 2 20 20" }, "child": [] }],
    Signal: [{ "tag": "path", "attr": { "d": "M2 20h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M7 20v-4" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 20v-8" }, "child": [] }, { "tag": "path", "attr": { "d": "M17 20V8" }, "child": [] }, { "tag": "path", "attr": { "d": "M22 4v16" }, "child": [] }],
    Smartphone: [{ "tag": "rect", "attr": { "width": "14", "height": "20", "x": "5", "y": "2", "rx": "2", "ry": "2" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 18h.01" }, "child": [] }],
    ShieldCheck: [{ "tag": "path", "attr": { "d": "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" }, "child": [] }, { "tag": "path", "attr": { "d": "m9 12 2 2 4-4" }, "child": [] }],
    Users: [{ "tag": "path", "attr": { "d": "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }, "child": [] }, { "tag": "circle", "attr": { "cx": "9", "cy": "7", "r": "4" }, "child": [] }, { "tag": "path", "attr": { "d": "M22 21v-2a4 4 0 0 0-3-3.87" }, "child": [] }, { "tag": "path", "attr": { "d": "M16 3.13a4 4 0 0 1 0 7.75" }, "child": [] }],
    Wallet: [{ "tag": "path", "attr": { "d": "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }, "child": [] }],
    Network: [{ "tag": "rect", "attr": { "x": "16", "y": "16", "width": "6", "height": "6", "rx": "1" }, "child": [] }, { "tag": "rect", "attr": { "x": "2", "y": "16", "width": "6", "height": "6", "rx": "1" }, "child": [] }, { "tag": "rect", "attr": { "x": "9", "y": "2", "width": "6", "height": "6", "rx": "1" }, "child": [] }, { "tag": "path", "attr": { "d": "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 12V8" }, "child": [] }],
    ScrollText: [{ "tag": "path", "attr": { "d": "M15 12h-5" }, "child": [] }, { "tag": "path", "attr": { "d": "M15 8h-5" }, "child": [] }, { "tag": "path", "attr": { "d": "M19 17V5a2 2 0 0 0-2-2H4" }, "child": [] }, { "tag": "path", "attr": { "d": "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" }, "child": [] }],
    Check: [{ "tag": "path", "attr": { "d": "M20 6 9 17l-5-5" }, "child": [] }],
    Timer: [{ "tag": "line", "attr": { "x1": "10", "x2": "14", "y1": "2", "y2": "2" }, "child": [] }, { "tag": "line", "attr": { "x1": "12", "x2": "15", "y1": "14", "y2": "11" }, "child": [] }, { "tag": "circle", "attr": { "cx": "12", "cy": "14", "r": "8" }, "child": [] }],
    CalendarDays: [{ "tag": "path", "attr": { "d": "M8 2v4" }, "child": [] }, { "tag": "path", "attr": { "d": "M16 2v4" }, "child": [] }, { "tag": "rect", "attr": { "width": "18", "height": "18", "x": "3", "y": "4", "rx": "2" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 10h18" }, "child": [] }, { "tag": "path", "attr": { "d": "M8 14h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 14h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M16 14h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M8 18h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 18h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M16 18h.01" }, "child": [] }],
    CloudOff: [{ "tag": "path", "attr": { "d": "m2 2 20 20" }, "child": [] }, { "tag": "path", "attr": { "d": "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" }, "child": [] }, { "tag": "path", "attr": { "d": "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" }, "child": [] }],
    QrCode: [{ "tag": "rect", "attr": { "width": "5", "height": "5", "x": "3", "y": "3", "rx": "1" }, "child": [] }, { "tag": "rect", "attr": { "width": "5", "height": "5", "x": "16", "y": "3", "rx": "1" }, "child": [] }, { "tag": "rect", "attr": { "width": "5", "height": "5", "x": "3", "y": "16", "rx": "1" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 16h-3a2 2 0 0 0-2 2v3" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 21v.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 7v3a2 2 0 0 1-2 2H7" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 12h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 3h.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 16v.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M16 12h1" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 12v.01" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 21v-1" }, "child": [] }],
    History: [{ "tag": "path", "attr": { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 3v5h5" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 7v5l4 2" }, "child": [] }],
    ChevronRight: [{ "tag": "path", "attr": { "d": "m9 18 6-6-6-6" }, "child": [] }],
    Hourglass: [{ "tag": "path", "attr": { "d": "M5 22h14" }, "child": [] }, { "tag": "path", "attr": { "d": "M5 2h14" }, "child": [] }, { "tag": "path", "attr": { "d": "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" }, "child": [] }, { "tag": "path", "attr": { "d": "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" }, "child": [] }],
    LogOut: [{ "tag": "path", "attr": { "d": "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }, "child": [] }, { "tag": "polyline", "attr": { "points": "16 17 21 12 16 7" }, "child": [] }, { "tag": "line", "attr": { "x1": "21", "x2": "9", "y1": "12", "y2": "12" }, "child": [] }],
    KeyRound: [{ "tag": "path", "attr": { "d": "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" }, "child": [] }, { "tag": "circle", "attr": { "cx": "16.5", "cy": "7.5", "r": ".5", "fill": "currentColor" }, "child": [] }],
    Download: [{ "tag": "path", "attr": { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }, "child": [] }, { "tag": "polyline", "attr": { "points": "7 10 12 15 17 10" }, "child": [] }, { "tag": "line", "attr": { "x1": "12", "x2": "12", "y1": "15", "y2": "3" }, "child": [] }],
    Bell: [{ "tag": "path", "attr": { "d": "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }, "child": [] }, { "tag": "path", "attr": { "d": "M10.3 21a1.94 1.94 0 0 0 3.4 0" }, "child": [] }],
    X: [{ "tag": "path", "attr": { "d": "M18 6 6 18" }, "child": [] }, { "tag": "path", "attr": { "d": "m6 6 12 12" }, "child": [] }],
    RefreshCw: [{ "tag": "path", "attr": { "d": "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 3v5h-5" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }, "child": [] }, { "tag": "path", "attr": { "d": "M8 16H3v5" }, "child": [] }],
    DatabaseBackup: [{ "tag": "ellipse", "attr": { "cx": "12", "cy": "5", "rx": "9", "ry": "3" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 12a9 3 0 0 0 5 2.69" }, "child": [] }, { "tag": "path", "attr": { "d": "M21 9.3V5" }, "child": [] }, { "tag": "path", "attr": { "d": "M3 5v14a9 3 0 0 0 6.47 2.88" }, "child": [] }, { "tag": "path", "attr": { "d": "M12 12v4h4" }, "child": [] }, { "tag": "path", "attr": { "d": "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" }, "child": [] }],
    Upload: [{ "tag": "path", "attr": { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }, "child": [] }, { "tag": "polyline", "attr": { "points": "17 8 12 3 7 8" }, "child": [] }, { "tag": "line", "attr": { "x1": "12", "x2": "12", "y1": "3", "y2": "15" }, "child": [] }],
};
function renderIconNode(n, i) { return React.createElement(n.tag, { key: i, ...n.attr }, (n.child || []).map(renderIconNode)); }
function makeIcon(name) {
    return function Icon({ size = 20, color = "currentColor", style }) {
        return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, ...style }, "aria-hidden": "true" }, ICON_TREES[name].map(renderIconNode));
    };
}
const Clock = makeIcon("Clock");
const Fingerprint = makeIcon("Fingerprint");
const Wifi = makeIcon("Wifi");
const WifiOff = makeIcon("WifiOff");
const Signal = makeIcon("Signal");
const Smartphone = makeIcon("Smartphone");
const ShieldCheck = makeIcon("ShieldCheck");
const Users = makeIcon("Users");
const Wallet = makeIcon("Wallet");
const Network = makeIcon("Network");
const ScrollText = makeIcon("ScrollText");
const Check = makeIcon("Check");
const Timer = makeIcon("Timer");
const CalendarDays = makeIcon("CalendarDays");
const CloudOff = makeIcon("CloudOff");
const QrCode = makeIcon("QrCode");
const History = makeIcon("History");
const ChevronRight = makeIcon("ChevronRight");
const Hourglass = makeIcon("Hourglass");
const LogOut = makeIcon("LogOut");
const KeyRound = makeIcon("KeyRound");
const Download = makeIcon("Download");
const Bell = makeIcon("Bell");
const X = makeIcon("X");
const RefreshCw = makeIcon("RefreshCw");
const DatabaseBackup = makeIcon("DatabaseBackup");
const Upload = makeIcon("Upload");
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
const fmt = t => { if (!t)
    return "—"; let [h, m] = t.split(":").map(Number); const ap = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${pad(m)} ${ap}`; };
const stamp = () => `${longDate(TODAY)}, ${fmt(nowTime())}`;
// A shift whose end is at or before its start runs past midnight (night shift).
const overnight = s => toMin(s.end) <= toMin(s.start);
// Minutes from midnight of the shift's start date, so 2:00 AM on a night shift counts as 26:00.
const rel = (t, s) => { let m = toMin(t); if (overnight(s) && m < toMin(s.start) - 360)
    m += 1440; return m; };
const shiftText = s => `${fmt(s.start)} – ${fmt(s.end)}${overnight(s) ? " (next day)" : ""}`;
const timeText = (t, s) => !t ? "—" : fmt(t) + (s && rel(t, s) >= 1440 ? " (next day)" : "");
const daysIn = (y, m) => new Date(y, m, 0).getDate();
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekday = ds => new Date(ds + "T00:00:00").getDay();
const addDays = (ds, n) => { const d = new Date(ds + "T00:00:00"); d.setDate(d.getDate() + n); return dstr(d); };
let YEST = addDays(TODAY, -1);
let FIRST_MONTH = TODAY.slice(0, 7);
// The server decides the date (Pakistan time); the browser follows it so every screen agrees.
function setClock(today, firstDate) { TODAY = today; YEST = addDays(today, -1); if (firstDate)
    FIRST_MONTH = firstDate.slice(0, 7); }
const longDate = ds => new Date(ds + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
// Resigned staff can still work on their last day; access ends the day after.
const isGone = e => !!e.left && e.left < TODAY;
const employed = (e, ds) => ds >= e.joined && (!e.left || ds <= e.left);
const rs = n => "Rs " + Math.round(n).toLocaleString("en-PK");
const minText = m => m >= 60 ? `${Math.floor(m / 60)} hr ${m % 60} min` : `${m} min`;
const niceDate = ds => new Date(ds + "T00:00:00").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const monthName = ym => new Date(ym + "-01T00:00:00").toLocaleString("en-GB", { month: "long", year: "numeric" });
function settingsOn(e, ds) { let s = null; for (const h of e.history)
    if (h.from <= ds)
        s = h; return s; }
const lateBeyond = (rec, s) => Math.max(0, rel(rec.in, s) - toMin(s.start) - s.grace);
const extraAfterShift = (rec, s) => rel(rec.out, s) - (toMin(s.end) + (overnight(s) ? 1440 : 0));
// Decide whether a check-in now belongs to today's shift or to last night's shift.
function pickShiftDate(e, nowM) {
    const sT = settingsOn(e, TODAY), sY = settingsOn(e, YEST);
    if (!sT || !sY || !overnight(sY))
        return TODAY;
    return Math.abs(nowM + 1440 - toMin(sY.start)) < Math.abs(nowM - toMin(sT.start)) ? YEST : TODAY;
}
function monthsList() {
    const out = [];
    let [y, m] = FIRST_MONTH.split("-").map(Number);
    const [ty, tm] = TODAY.slice(0, 7).split("-").map(Number);
    while (y < ty || (y === ty && m <= tm)) {
        out.push(`${y}-${pad(m)}`);
        m++;
        if (m > 12) {
            m = 1;
            y++;
        }
    }
    return out.reverse();
}
/* ---------- salary calculation ---------- */
function calcSalary(e, ym, attendance, overtime) {
    const [y, m] = ym.split("-").map(Number);
    const dim = daysIn(y, m);
    let base = 0, lateDed = 0, lateCount = 0, lateMins = 0, otPay = 0, otHours = 0, present = 0;
    const absences = [];
    const lastS = settingsOn(e, `${ym}-${pad(dim)}`);
    for (let d = 1; d <= dim; d++) {
        const ds = `${ym}-${pad(d)}`;
        if (!employed(e, ds))
            continue;
        const s = settingsOn(e, ds);
        if (!s)
            continue;
        const dp = s.salary / dim;
        base += dp;
        if (ds >= TODAY || s.off.includes(weekday(ds)))
            continue;
        const rec = attendance.find(a => a.synced && a.empId === e.id && a.date === ds);
        if (!rec) {
            absences.push({ ds, dp });
            continue;
        }
        present++;
        const lm = lateBeyond(rec, s);
        if (lm > 0) {
            lateCount++;
            lateMins += lm;
            lateDed += lm * dp / (s.hours * 60);
        }
        const ot = overtime.find(o => o.empId === e.id && o.date === ds);
        if (ot) {
            otHours += ot.hours;
            otPay += ot.hours * (dp / s.hours) * ot.rate;
        }
    }
    // Paid leaves are pro-rated when the employee joins or leaves during the month.
    let empDays = 0;
    for (let d = 1; d <= dim; d++)
        if (employed(e, `${ym}-${pad(d)}`))
            empDays++;
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
    return React.createElement("div", { className: "copy" },
        "\u00A9 ",
        new Date().getFullYear(),
        " ",
        React.createElement("span", { style: { color: "#009900", fontWeight: 700 } }, "The Pharmacist"),
        ". All rights reserved.");
}
/* ---------- Haazir Android app bridge ---------- */
// Inside the Haazir Android app, fingerprint checks and file saving go through the app itself.
const inAndroidApp = () => typeof window.HaazirApp !== "undefined";
function askApp(message, callbackName) {
    return new Promise(resolve => { window[callbackName] = (...args) => { delete window[callbackName]; resolve(args); }; window.HaazirApp.postMessage(JSON.stringify(message)); });
}
function bufToBase64(buf) {
    const bytes = new Uint8Array(buf);
    let bin = "";
    for (let i = 0; i < bytes.length; i += 0x8000)
        bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
}
function base64ToBlob(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++)
        bytes[i] = bin.charCodeAt(i);
    return new Blob([bytes], { type: "application/octet-stream" });
}
// Saves a file: through the app's Save screen on Android, or as a normal download in a browser.
async function saveBlob(blob, name) {
    if (inAndroidApp()) {
        const [saved, msg] = await askApp({ type: "save", name, data: bufToBase64(await blob.arrayBuffer()) }, "hzAppSaved");
        if (!saved && msg !== "cancelled")
            throw new Error(msg || "The file could not be saved on this phone.");
        return saved;
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
}
/* ---------- Excel files (.xlsx) ---------- */
const CRC_TABLE = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++)
        c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
} return t; })();
function crc32(bytes) { let c = 0xffffffff; for (let i = 0; i < bytes.length; i++)
    c = CRC_TABLE[(c ^ bytes[i]) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zipFiles(files) {
    const enc = new TextEncoder();
    const parts = [];
    const central = [];
    let offset = 0;
    for (const [name, text] of files) {
        const nameB = enc.encode(name), data = enc.encode(text), crc = crc32(data);
        const local = new DataView(new ArrayBuffer(30));
        local.setUint32(0, 0x04034b50, true);
        local.setUint16(4, 20, true);
        local.setUint16(8, 0, true);
        local.setUint32(14, crc, true);
        local.setUint32(18, data.length, true);
        local.setUint32(22, data.length, true);
        local.setUint16(26, nameB.length, true);
        parts.push(new Uint8Array(local.buffer), nameB, data);
        const cen = new DataView(new ArrayBuffer(46));
        cen.setUint32(0, 0x02014b50, true);
        cen.setUint16(4, 20, true);
        cen.setUint16(6, 20, true);
        cen.setUint32(16, crc, true);
        cen.setUint32(20, data.length, true);
        cen.setUint32(24, data.length, true);
        cen.setUint16(28, nameB.length, true);
        cen.setUint32(42, offset, true);
        central.push(new Uint8Array(cen.buffer), nameB);
        offset += 30 + nameB.length + data.length;
    }
    const cenSize = central.reduce((n, p) => n + p.length, 0);
    const end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true);
    end.setUint16(8, files.length, true);
    end.setUint16(10, files.length, true);
    end.setUint32(12, cenSize, true);
    end.setUint32(16, offset, true);
    return new Blob([...parts, ...central, new Uint8Array(end.buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
// rows: arrays of strings/numbers. The first row is the bold heading row.
function makeXlsx(sheetName, rows) {
    const esc = v => String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    const col = i => { let s = ""; i++; while (i) {
        const m = (i - 1) % 26;
        s = String.fromCharCode(65 + m) + s;
        i = Math.floor((i - 1) / 26);
    } return s; };
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
    try {
        res = await fetch(API_BASE + path, { headers: authHeaders(), cache: "no-store" });
    }
    catch {
        throw new Error("Could not reach the Haazir server. Check your internet connection and try again.");
    }
    if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "The file could not be downloaded.");
    }
    const name = ((res.headers.get("Content-Disposition") || "").match(/filename="([^"]+)"/) || [])[1] || fallbackName;
    return saveBlob(await res.blob(), name);
}
async function apiUpload(path, blob) {
    let res;
    try {
        res = await fetch(API_BASE + path, { method: "POST", headers: { ...authHeaders(), "Content-Type": "application/octet-stream", "X-Haazir": "1" }, body: blob });
    }
    catch {
        throw new Error("Could not reach the Haazir server. Check your internet connection and try again.");
    }
    const d = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error(d.error || "The request failed.");
    return d;
}
/* ---------- notification tone ---------- */
// A short two-note chime. Browsers allow sound only after the page has been tapped or clicked once.
let audioCtx = null;
function unlockAudio() { try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended")
        audioCtx.resume();
}
catch { /* no audio */ } }
if (typeof window !== "undefined") {
    window.addEventListener("pointerdown", unlockAudio, { once: false });
    window.addEventListener("keydown", unlockAudio, { once: false });
}
function playChime() {
    try {
        unlockAudio();
        if (!audioCtx || audioCtx.state !== "running")
            return;
        const t0 = audioCtx.currentTime;
        [[880, 0], [1318.5, 0.16]].forEach(([f, d]) => {
            const o = audioCtx.createOscillator(), g = audioCtx.createGain();
            o.type = "sine";
            o.frequency.value = f;
            g.gain.setValueAtTime(0.0001, t0 + d);
            g.gain.exponentialRampToValueAtTime(0.35, t0 + d + 0.02);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.6);
            o.connect(g).connect(audioCtx.destination);
            o.start(t0 + d);
            o.stop(t0 + d + 0.65);
        });
    }
    catch { /* no audio */ }
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
    try {
        res = await fetch(API_BASE + path, { ...opts, cache: "no-store" });
    }
    catch {
        const e = new Error("Could not reach the Haazir server. Check your internet connection and try again.");
        e.status = 0;
        throw e;
    }
    let data = {};
    try {
        data = await res.json();
    }
    catch { /* empty */ }
    if (!res.ok) {
        const e = new Error(data.error || "Something went wrong. Please try again.");
        e.status = res.status;
        throw e;
    }
    return data;
}
// Notices when the server has been updated to a newer version than the page that is open.
function useServerVersion() {
    const [v, setV] = useState(null);
    useEffect(() => {
        const check = async () => { try {
            const r = await api("/api/version");
            setV(r.version);
        }
        catch { /* offline */ } };
        check();
        const t = setInterval(check, 60000);
        return () => clearInterval(t);
    }, []);
    return v;
}
function Toast({ toast }) { return toast ? React.createElement("div", { className: "toast" + (toast.bad ? " bad" : ""), role: "status" }, toast.text) : null; }
function useToast() {
    const [toast, setToast] = useState(null);
    const timer = useRef();
    const show = (text, bad) => { setToast({ text, bad }); clearTimeout(timer.current); timer.current = setTimeout(() => setToast(null), 4000); };
    return [toast, show];
}
/* ---------- admin ---------- */
function AdminView({ db, act, reload, onSignOut, notif, serverVersion }) {
    const superAdmin = db.me.role === "Super Admin";
    const me = db.me.label;
    const groups = [
        ["Attendance", [["today", "Today", Clock], ["records", "Attendance Records", CalendarDays], ["hours", "Work Hours", Hourglass], ["late", "Late Entries", History], ["overtime", "Overtime", Timer]]],
        ["People", [["employees", "Employees", Users], ["phones", "Registered Phones", Smartphone]]],
        ["Finance", [["salary", "Payroll", Wallet]]],
        ...(superAdmin ? [["Administration", [["network", "Pharmacy Network", Network], ["access", "Admins & Security", ShieldCheck], ["backup", "Backup & Restore", DatabaseBackup], ["updates", "App Updates", Download], ["log", "Audit Log", ScrollText]]]] : []),
    ];
    const [tab, setTab] = useState("today");
    // The Android app's Back button: return to Today first, then let the app ask about exiting.
    useEffect(() => {
        window.hzBack = () => {
            if (notif.settings) {
                notif.closeSettings();
                return true;
            }
            if (tab !== "today") {
                setTab("today");
                window.scrollTo(0, 0);
                return true;
            }
            return false;
        };
        return () => { delete window.hzBack; };
    }, [tab, notif.settings]);
    const p = { db, act, me, superAdmin };
    const badges = { phones: db.requests.length, late: db.lateReqs.filter(r => r.status === "pending").length, updates: db.update && db.update.available ? 1 : 0 };
    const Btn = ([k, l, I]) => React.createElement("button", { key: k, className: tab === k ? "on" : "", onClick: () => setTab(k) },
        React.createElement("span", { className: "ico" },
            React.createElement(I, { size: 16 })),
        l,
        badges[k] > 0 && React.createElement("span", { className: "tag amber" }, badges[k]));
    return (React.createElement(React.Fragment, null,
        React.createElement("header", { className: "topbar" },
            React.createElement("div", { className: "brand" },
                React.createElement("img", { src: LOGO, alt: "" }),
                React.createElement("span", { className: "wordmark" },
                    React.createElement("b", null, "Haazir"),
                    React.createElement("small", null,
                        React.createElement("span", { className: "eco" }, "eco"),
                        " Pharmacy Staff Attendance"))),
            React.createElement("div", { className: "topright" },
                React.createElement("span", { className: "topdate" }, new Date(TODAY + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })),
                React.createElement("button", { className: "btn small", onClick: reload, title: "Refresh data" },
                    React.createElement(RefreshCw, { size: 14 }),
                    " Refresh"),
                React.createElement(BellMenu, { notif: notif }),
                React.createElement(AccountMenu, { db: db, act: act, onSignOut: onSignOut, onSettings: notif.openSettings }))),
        React.createElement("div", { className: "admin" },
            React.createElement("nav", { className: "side" }, groups.map(([g, items]) => React.createElement("div", { key: g, className: "navgroup" },
                React.createElement("div", { className: "group" }, g),
                items.map(Btn)))),
            React.createElement("main", { className: "main" },
                serverVersion && serverVersion !== APP_VERSION && React.createElement("div", { className: "updbar" },
                    React.createElement(RefreshCw, { size: 18 }),
                    React.createElement("span", null,
                        "Haazir has been updated to version ",
                        serverVersion,
                        ". Reload to use the new version."),
                    React.createElement("button", { className: "btn small primary", onClick: () => location.reload() }, "Reload")),
                superAdmin && db.update && db.update.available && tab !== "updates" && serverVersion === APP_VERSION && React.createElement("div", { className: "updbar" },
                    React.createElement(Download, { size: 18 }),
                    React.createElement("span", null,
                        "Haazir ",
                        db.update.latest,
                        " is available. You are using version ",
                        db.update.current,
                        "."),
                    React.createElement("button", { className: "btn small primary", onClick: () => setTab("updates") }, "View Update")),
                tab === "today" && React.createElement(Today, { ...p }),
                tab === "records" && React.createElement(Records, { ...p }),
                tab === "employees" && React.createElement(Employees, { ...p }),
                tab === "phones" && React.createElement(Phones, { ...p }),
                tab === "overtime" && React.createElement(Overtime, { ...p }),
                tab === "salary" && React.createElement(Salary, { ...p }),
                tab === "network" && React.createElement(NetworkTab, { ...p }),
                tab === "access" && React.createElement(Access, { ...p }),
                tab === "log" && React.createElement(Log, { ...p }),
                tab === "late" && React.createElement(LateRequests, { ...p }),
                tab === "hours" && React.createElement(WorkHours, { ...p }),
                tab === "updates" && React.createElement(Updates, { ...p }),
                tab === "backup" && React.createElement(BackupPage, { ...p }),
                React.createElement(Copyright, null)))));
}
function LateRequests({ db, act, me }) {
    const emp = id => db.employees.find(e => e.id === id);
    const pending = db.lateReqs.filter(r => r.status === "pending");
    const decided = db.lateReqs.filter(r => r.status !== "pending").slice(-10).reverse();
    const decide = (r, ok) => act("/api/late/decide", { id: r.id, approve: ok });
    const row = (r, actions) => {
        const e = emp(r.empId), s = settingsOn(e, r.date);
        const lm = r.in && s ? lateBeyond(r, s) : 0;
        return React.createElement("tr", { key: r.id },
            React.createElement("td", null,
                React.createElement("b", null, e.name),
                React.createElement("div", { className: "muted" }, e.id)),
            React.createElement("td", null,
                niceDate(r.date),
                React.createElement("div", { className: "muted" }, s ? shiftText(s) : "")),
            React.createElement("td", null,
                timeText(r.in, s),
                React.createElement("br", null),
                timeText(r.out, s),
                lm > 0 && React.createElement("div", null,
                    React.createElement("span", { className: "tag amber" },
                        "Late by ",
                        minText(lm)))),
            React.createElement("td", { style: { maxWidth: 260 } },
                r.reason,
                React.createElement("div", { className: "muted" },
                    "Submitted ",
                    r.at)),
            React.createElement("td", null, actions));
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Late Entries"),
        React.createElement("p", { className: "sub" }, "Requests from employees who could not record attendance during a power or internet outage. Entries are added only after approval by an admin or super admin."),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Pending Approval"),
            pending.length === 0 ? React.createElement("p", { className: "muted" }, "No pending requests.") :
                React.createElement("table", { className: "t" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Employee"),
                            React.createElement("th", null, "Shift Date"),
                            React.createElement("th", null, "Check-In / Out"),
                            React.createElement("th", null, "Reason"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, pending.map(r => row(r, React.createElement("div", { className: "row", style: { justifyContent: "flex-end" } },
                        React.createElement("button", { className: "btn small primary", onClick: () => decide(r, true) }, "Approve"),
                        React.createElement("button", { className: "btn small danger", onClick: () => decide(r, false) }, "Reject"))))))),
        decided.length > 0 && React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Recent Decisions"),
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Employee"),
                        React.createElement("th", null, "Shift Date"),
                        React.createElement("th", null, "Check-In / Out"),
                        React.createElement("th", null, "Reason"),
                        React.createElement("th", null, "Decision"))),
                React.createElement("tbody", null, decided.map(r => row(r, React.createElement(React.Fragment, null,
                    React.createElement("span", { className: "tag" + (r.status === "rejected" ? " red" : "") }, r.status === "approved" ? "Approved" : "Rejected"),
                    React.createElement("div", { className: "muted" }, r.by)))))))));
}
const hm = min => { const sgn = min < 0 ? "−" : ""; min = Math.abs(Math.round(min)); return `${sgn}${Math.floor(min / 60)}h ${pad(min % 60)}m`; };
// Day-by-day hours worked for one employee in a month, measured from check-in to check-out.
function workHours(e, ym, attendance, overtime) {
    const [y, m] = ym.split("-").map(Number);
    const dim = daysIn(y, m);
    const rows = [];
    let worked = 0, scheduled = 0, days = 0, missing = 0, otHours = 0;
    for (let d = 1; d <= dim; d++) {
        const ds = `${ym}-${pad(d)}`;
        if (ds > TODAY)
            break;
        if (!employed(e, ds))
            continue;
        const s = settingsOn(e, ds);
        if (!s)
            continue;
        const rec = attendance.find(a => a.synced && a.empId === e.id && a.date === ds);
        const off = s.off.includes(weekday(ds));
        const sched = off ? 0 : s.hours * 60;
        const w = rec && rec.out ? rel(rec.out, s) - rel(rec.in, s) : null;
        if (ds < TODAY || w !== null)
            scheduled += sched;
        if (w !== null) {
            worked += w;
            days++;
        }
        if (rec && !rec.out && ds < TODAY)
            missing++;
        const ot = overtime.find(o => o.empId === e.id && o.date === ds);
        if (ot && rec)
            otHours += ot.hours;
        rows.push({ ds, s, rec, off, sched, w });
    }
    const lastS = settingsOn(e, `${ym}-${pad(dim)}`) || rows[rows.length - 1]?.s;
    // Allowed hours are pro-rated when the employee joins or leaves during the month.
    let empDays = 0;
    for (let d = 1; d <= dim; d++)
        if (employed(e, `${ym}-${pad(d)}`))
            empDays++;
    // Automatic (-1): daily hours on every working day of this month (employees may work their paid leave days, which are paid extra).
    let allowed = null, autoDays = null;
    if (lastS && lastS.monthHours === -1) {
        let mins = 0, workDays = 0;
        for (let d = 1; d <= dim; d++) {
            const ds = `${ym}-${pad(d)}`;
            if (!employed(e, ds))
                continue;
            const sd = settingsOn(e, ds);
            if (!sd || sd.off.includes(weekday(ds)))
                continue;
            mins += sd.hours * 60;
            workDays++;
        }
        allowed = mins;
        autoDays = workDays;
    }
    else if (lastS?.monthHours)
        allowed = lastS.monthHours * 60 * empDays / dim;
    return { rows, worked, scheduled, days, missing, otHours, allowed, autoDays, prorated: !!allowed && empDays < dim };
}
function WorkHoursInner({ db }) {
    const [mode, setMode] = useState("employee");
    const [empId, setEmpId] = useState(db.employees[0].id);
    const [month, setMonth] = useState(TODAY.slice(0, 7));
    const e = db.employees.find(x => x.id === empId);
    const allowedCell = r => {
        if (!r.allowed)
            return React.createElement("span", { className: "muted" }, "No limit");
        const left = r.allowed - r.worked;
        return left >= 0 ? React.createElement("span", { className: "pos" },
            hm(left),
            " remaining") : React.createElement("span", { className: "neg" },
            hm(-left),
            " over");
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Work Hours"),
        React.createElement("p", { className: "sub" }, "Hours worked each day, measured from check-in to check-out, compared with scheduled hours and each employee's allowed hours per month. Night shifts are counted across midnight."),
        React.createElement("div", { className: "row", style: { marginBottom: 16, alignItems: "center" } },
            React.createElement("div", { className: "seg2", role: "tablist" },
                React.createElement("button", { className: mode === "employee" ? "on" : "", onClick: () => setMode("employee") }, "By Employee"),
                React.createElement("button", { className: mode === "all" ? "on" : "", onClick: () => setMode("all") }, "All Staff")),
            mode === "employee" && React.createElement("select", { value: empId, onChange: ev => setEmpId(ev.target.value), style: { width: "auto" } }, db.employees.map(x => React.createElement("option", { key: x.id, value: x.id },
                x.name,
                " (",
                x.id,
                ")",
                x.left ? ", Resigned" : ""))),
            React.createElement(MonthPick, { value: month, onChange: setMonth }),
            React.createElement(ExportButtons, { onExcel: () => {
                    if (mode === "employee") {
                        const r = workHours(e, month, db.attendance, db.overtime);
                        return saveBlob(makeXlsx("Work Hours " + month, [
                            ["Date", "Check-In", "Check-Out", "Worked (hrs)", "Scheduled (hrs)", "Difference (hrs)", "Note"],
                            ...r.rows.map(({ ds, s, rec, off, sched, w }) => [niceDate(ds), rec ? timeText(rec.in, s) : "", rec ? timeText(rec.out, s) : "", w !== null ? r2(w / 60) : "", r2(sched / 60), w !== null ? r2((w - sched) / 60) : "", off ? (rec ? "Worked on day off" : "Day off") : !rec ? (ds === TODAY ? "Today" : "Absent") : !rec.out ? "No check-out" : ""]),
                            ["Total", "", "", r2(r.worked / 60), r2(r.scheduled / 60), r2((r.worked - r.scheduled) / 60), r.allowed ? `Allowed this month: ${r2(r.allowed / 60)} hrs` : ""],
                        ]), `Haazir Work Hours ${e.name} ${month}.xlsx`);
                    }
                    const rows = db.employees.map(x => ({ x, r: workHours(x, month, db.attendance, db.overtime) })).filter(({ r }) => r.rows.length > 0);
                    return saveBlob(makeXlsx("Work Hours " + month, [
                        ["Employee ID", "Name", "Days Worked", "Hours Worked", "Scheduled Hours", "Allowed Hours", "Remaining (hrs)", "Approved Overtime (hrs)", "Days Missing Check-Out"],
                        ...rows.map(({ x, r }) => [x.id, x.name, r.days, r2(r.worked / 60), r2(r.scheduled / 60), r.allowed ? r2(r.allowed / 60) : "", r.allowed ? r2((r.allowed - r.worked) / 60) : "", r.otHours, r.missing]),
                    ]), `Haazir Work Hours All Staff ${month}.xlsx`);
                } })),
        React.createElement("div", { className: "printhead" },
            "Haazir, eco Pharmacy: Work Hours for ",
            mode === "employee" ? `${e.name} (${e.id}), ` : "all staff, ",
            monthName(month),
            ". Printed ",
            longDate(TODAY),
            "."),
        mode === "employee" ? (() => {
            const r = workHours(e, month, db.attendance, db.overtime);
            if (r.rows.length === 0)
                return React.createElement("div", { className: "panel" },
                    React.createElement("p", { className: "muted" },
                        e.name,
                        " was not employed in ",
                        monthName(month),
                        "."));
            const pct = r.allowed ? Math.min(100, (r.worked / r.allowed) * 100) : 0;
            const diff = r.worked - r.scheduled;
            return (React.createElement(React.Fragment, null,
                React.createElement("div", { className: "stats" },
                    React.createElement("div", { className: "stat" },
                        React.createElement("span", null, "Hours worked"),
                        React.createElement("b", null, hm(r.worked)),
                        React.createElement("small", null,
                            r.days,
                            " days with full records")),
                    React.createElement("div", { className: "stat" },
                        React.createElement("span", null, "Scheduled to date"),
                        React.createElement("b", null, hm(r.scheduled)),
                        React.createElement("small", { className: diff >= 0 ? "pos" : "neg" }, diff >= 0 ? `${hm(diff)} extra` : `${hm(-diff)} short`)),
                    React.createElement("div", { className: "stat" },
                        React.createElement("span", null, "Allowed this month"),
                        React.createElement("b", null, r.allowed ? hm(r.allowed) : "No limit"),
                        r.allowed ? React.createElement(React.Fragment, null,
                            React.createElement("small", null,
                                allowedCell(r),
                                r.autoDays !== null ? `, automatic (${r.autoDays} working days)` : r.prorated ? ", pro-rated" : ""),
                            React.createElement("div", { className: "bar", "aria-label": `${Math.round(pct)}% of allowed hours used` },
                                React.createElement("i", { className: r.worked > r.allowed ? "over" : "", style: { width: `${pct}%` } }))) : React.createElement("small", null, "Set in Employees")),
                    React.createElement("div", { className: "stat" },
                        React.createElement("span", null, "Approved overtime"),
                        React.createElement("b", null,
                            r.otHours,
                            " hrs"),
                        React.createElement("small", null, r.missing > 0 ? React.createElement("span", { className: "neg" },
                            r.missing,
                            " day",
                            r.missing > 1 ? "s" : "",
                            " missing check-out") : "All records complete"))),
                React.createElement("div", { className: "panel" },
                    React.createElement("table", { className: "t" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", null, "Date"),
                                React.createElement("th", null, "Check-In"),
                                React.createElement("th", null, "Check-Out"),
                                React.createElement("th", { className: "r" }, "Worked"),
                                React.createElement("th", { className: "r" }, "Scheduled"),
                                React.createElement("th", { className: "r" }, "Difference"),
                                React.createElement("th", null, "Status"))),
                        React.createElement("tbody", null,
                            r.rows.slice().reverse().map(({ ds, s, rec, off, sched, w }) => {
                                const d = w !== null ? w - sched : null;
                                const st = rec && !rec.out ? (ds === TODAY || ds === YEST ? React.createElement("span", { className: "tag grey" }, "In Progress") : React.createElement("span", { className: "tag red" }, "No Check-Out"))
                                    : off ? React.createElement("span", { className: "tag grey" }, rec ? "Worked on Day Off" : "Day Off")
                                        : !rec ? (ds === TODAY ? React.createElement("span", { className: "tag grey" }, "Today") : React.createElement("span", { className: "tag red" }, "Absent"))
                                            : d < -15 ? React.createElement("span", { className: "tag amber" }, "Short") : React.createElement("span", { className: "tag" }, "Complete");
                                return React.createElement("tr", { key: ds },
                                    React.createElement("td", { className: "nw" }, niceDate(ds)),
                                    React.createElement("td", { className: "nw" }, rec ? timeText(rec.in, s) : "—"),
                                    React.createElement("td", { className: "nw" }, rec ? timeText(rec.out, s) : "—"),
                                    React.createElement("td", { className: "r nw" },
                                        React.createElement("b", null, w !== null ? hm(w) : "—")),
                                    React.createElement("td", { className: "r nw" }, sched ? hm(sched) : "—"),
                                    React.createElement("td", { className: "r nw " + (d === null ? "" : d >= 0 ? "pos" : "neg") }, d === null ? "—" : (d > 0 ? "+" : "") + hm(d)),
                                    React.createElement("td", null, st));
                            }),
                            React.createElement("tr", { className: "total" },
                                React.createElement("td", { colSpan: 3 },
                                    "Total for ",
                                    monthName(month)),
                                React.createElement("td", { className: "r nw" }, hm(r.worked)),
                                React.createElement("td", { className: "r nw" }, hm(r.scheduled)),
                                React.createElement("td", { className: "r nw " + (diff >= 0 ? "pos" : "neg") }, (diff > 0 ? "+" : "") + hm(diff)),
                                React.createElement("td", null)))))));
        })() : (React.createElement("div", { className: "panel" },
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Employee"),
                        React.createElement("th", { className: "r" }, "Days Worked"),
                        React.createElement("th", { className: "r" }, "Hours Worked"),
                        React.createElement("th", { className: "r" }, "Scheduled"),
                        React.createElement("th", { className: "r" }, "Allowed"),
                        React.createElement("th", null, "Against Allowed"),
                        React.createElement("th", { className: "r" }, "Approved OT"))),
                React.createElement("tbody", null, db.employees.map(x => ({ x, r: workHours(x, month, db.attendance, db.overtime) })).filter(({ r }) => r.rows.length > 0).map(({ x, r }) => (React.createElement("tr", { key: x.id, className: "click", onClick: () => { setEmpId(x.id); setMode("employee"); } },
                    React.createElement("td", null,
                        React.createElement("b", null, x.name),
                        React.createElement("div", { className: "muted" }, x.id)),
                    React.createElement("td", { className: "r" }, r.days),
                    React.createElement("td", { className: "r nw" },
                        React.createElement("b", null, hm(r.worked))),
                    React.createElement("td", { className: "r nw" }, hm(r.scheduled)),
                    React.createElement("td", { className: "r nw" },
                        r.allowed ? hm(r.allowed) : "—",
                        r.prorated && React.createElement("div", { className: "muted" }, "Pro-rated")),
                    React.createElement("td", { className: "nw" },
                        allowedCell(r),
                        r.missing > 0 && React.createElement("div", null,
                            React.createElement("span", { className: "tag red" },
                                r.missing,
                                " No Check-Out"))),
                    React.createElement("td", { className: "r" },
                        r.otHours,
                        " hrs")))))),
            React.createElement("p", { className: "muted", style: { marginTop: 12, fontSize: 13 } }, "Select an employee to see their day-by-day hours.")))));
}
function MonthPick({ value, onChange }) {
    return React.createElement("select", { value: value, onChange: e => onChange(e.target.value), style: { width: "auto" } }, monthsList().map(m => React.createElement("option", { key: m, value: m }, monthName(m))));
}
function AdminCodePunch({ act, label, out }) {
    const [code, setCode] = useState("");
    const [err, setErr] = useState("");
    return (React.createElement("div", { className: "notice", style: { marginTop: 12, flexDirection: "column", alignItems: "stretch", gap: 10 } },
        React.createElement("span", null, "You are not on the pharmacy network. To record your attendance, enter the 6-digit code shown on the counter display."),
        React.createElement("div", { className: "row", style: { alignItems: "center" } },
            React.createElement("input", { className: "codein", style: { maxWidth: 200, fontSize: "22px" }, inputMode: "numeric", maxLength: 6, value: code, onChange: e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)), "aria-label": "Counter code" }),
            React.createElement("button", { className: "btn " + (out ? "out" : "in"), disabled: code.length !== 6, onClick: async () => { if (await act("/api/admin/punch", { code }, setErr))
                    setCode(""); } }, label)),
        err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err)));
}
function Today({ db, act, superAdmin }) {
    const mine = db.attendance.find(a => a.empId === db.me.key && a.date === TODAY);
    const atShop = db.atShop;
    const canPunch = superAdmin || atShop;
    const open = !mine || !mine.out;
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Today's Attendance"),
        React.createElement("p", { className: "sub" },
            "Live status for ",
            longDate(TODAY),
            ". Select Refresh at the top to load the latest check-ins."),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "My Attendance"),
            React.createElement("div", { className: "row", style: { alignItems: "center" } },
                React.createElement("span", null,
                    !mine ? "Not checked in yet." : mine.out ? `In ${fmt(mine.in)}, out ${fmt(mine.out)}.` : `Checked in at ${fmt(mine.in)}.`,
                    " ",
                    superAdmin ? "As super admin, you may record attendance from any network." : atShop ? "Connected to the pharmacy network." : ""),
                open && canPunch && React.createElement("button", { className: "btn " + (mine ? "out" : "in"), onClick: () => act("/api/admin/punch", {}) }, mine ? "Check Out" : "Check In")),
            open && !canPunch && React.createElement(AdminCodePunch, { act: act, label: mine ? "Check Out" : "Check In", out: !!mine })),
        React.createElement("div", { className: "panel" },
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Employee"),
                        React.createElement("th", null, "Shift"),
                        React.createElement("th", null, "Check-In"),
                        React.createElement("th", null, "Check-Out"),
                        React.createElement("th", null, "Method"),
                        React.createElement("th", null, "Status"))),
                React.createElement("tbody", null, db.employees.filter(e => !isGone(e)).map(e => {
                    let s = settingsOn(e, TODAY);
                    let rec = db.attendance.find(a => a.empId === e.id && a.date === TODAY && a.synced);
                    const sy = settingsOn(e, YEST);
                    const night = !rec && sy && overnight(sy) ? db.attendance.find(a => a.empId === e.id && a.date === YEST && a.synced && (!a.out || toMin(nowTime()) < toMin(sy.end) + 120)) : null;
                    if (night) {
                        rec = night;
                        s = sy;
                    }
                    let st;
                    if (night)
                        st = night.out ? React.createElement("span", { className: "tag" }, "Night Shift Complete") : React.createElement("span", { className: "tag" }, "On Night Shift");
                    else if (!s)
                        st = React.createElement("span", { className: "tag grey" }, "Not Yet Joined");
                    else if (s.off.includes(weekday(TODAY)))
                        st = React.createElement("span", { className: "tag grey" }, "Day Off");
                    else if (!rec)
                        st = toMin(nowTime()) > toMin(s.start) + s.grace ? React.createElement("span", { className: "tag red" }, "Not Checked In") : React.createElement("span", { className: "tag grey" }, "Shift Not Started");
                    else {
                        const lm = lateBeyond(rec, s);
                        st = rec.out ? React.createElement("span", { className: "tag" }, "Checked Out") : lm > 0 ? React.createElement("span", { className: "tag amber" },
                            "Late by ",
                            minText(lm)) : React.createElement("span", { className: "tag" }, "On Time");
                    }
                    return React.createElement("tr", { key: e.id },
                        React.createElement("td", null,
                            React.createElement("b", null, e.name),
                            React.createElement("div", { className: "muted" }, e.id)),
                        React.createElement("td", { className: "nw" }, s ? React.createElement(React.Fragment, null,
                            fmt(s.start),
                            " \u2013 ",
                            fmt(s.end),
                            overnight(s) && React.createElement("div", { className: "muted" }, "Night shift")) : "—"),
                        React.createElement("td", { className: "nw" }, rec ? timeText(rec.in, s) : "—"),
                        React.createElement("td", { className: "nw" }, rec ? timeText(rec.out, s) : "—"),
                        React.createElement("td", null, rec?.method || "—"),
                        React.createElement("td", null, st));
                }))))));
}
function RecordsInner({ db, act }) {
    const [empId, setEmpId] = useState(db.employees[0].id);
    const [month, setMonth] = useState(TODAY.slice(0, 7));
    const [edit, setEdit] = useState(null);
    const [err, setErr] = useState("");
    const e = db.employees.find(x => x.id === empId);
    const [y, m] = month.split("-").map(Number);
    const days = [];
    for (let d = 1; d <= daysIn(y, m); d++) {
        const ds = `${month}-${pad(d)}`;
        if (ds > TODAY)
            break;
        if (employed(e, ds))
            days.push(ds);
    }
    const save = async () => {
        if (!edit.in)
            return setErr("Please enter a check-in time.");
        if (!edit.reason.trim())
            return setErr("A reason is required for the audit log.");
        const r = await act("/api/attendance/save", { empId: e.id, date: edit.date, in: edit.in, out: edit.out, reason: edit.reason }, setErr);
        if (r) {
            setEdit(null);
            setErr("");
        }
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Attendance Records"),
        React.createElement("p", { className: "sub" }, "Add missing entries or correct errors. Every change is recorded in the audit log. Night shifts appear under the date they began."),
        React.createElement("div", { className: "panel" },
            React.createElement("div", { className: "row", style: { marginBottom: 12 } },
                React.createElement("select", { value: empId, onChange: ev => { setEmpId(ev.target.value); setEdit(null); }, style: { width: "auto" } }, db.employees.map(x => React.createElement("option", { key: x.id, value: x.id },
                    x.name,
                    " (",
                    x.id,
                    ")",
                    x.left ? ", Resigned" : ""))),
                React.createElement(MonthPick, { value: month, onChange: v => { setMonth(v); setEdit(null); } })),
            err && React.createElement("div", { className: "err", style: { marginBottom: 8 } }, err),
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Date"),
                        React.createElement("th", null, "Check-In"),
                        React.createElement("th", null, "Check-Out"),
                        React.createElement("th", null, "Method"),
                        React.createElement("th", null, "Status"),
                        React.createElement("th", null))),
                React.createElement("tbody", null, days.slice().reverse().map(ds => {
                    const s = settingsOn(e, ds);
                    const rec = db.attendance.find(a => a.empId === e.id && a.date === ds && a.synced);
                    const off = s.off.includes(weekday(ds));
                    if (edit?.date === ds)
                        return (React.createElement("tr", { key: ds },
                            React.createElement("td", null, niceDate(ds)),
                            React.createElement("td", null,
                                React.createElement("input", { type: "time", value: edit.in, onChange: ev => setEdit({ ...edit, in: ev.target.value }) })),
                            React.createElement("td", null,
                                React.createElement("input", { type: "time", value: edit.out, onChange: ev => setEdit({ ...edit, out: ev.target.value }) })),
                            React.createElement("td", { colSpan: 2 },
                                React.createElement("input", { placeholder: "Reason for change", value: edit.reason, onChange: ev => setEdit({ ...edit, reason: ev.target.value }) })),
                            React.createElement("td", null,
                                React.createElement("div", { className: "row" },
                                    React.createElement("button", { className: "btn small primary", onClick: save }, "Save"),
                                    React.createElement("button", { className: "btn small", onClick: () => { setEdit(null); setErr(""); } }, "Cancel")))));
                    const lm = rec ? lateBeyond(rec, s) : 0;
                    const st = off ? React.createElement("span", { className: "tag grey" }, "Day Off") : !rec ? (ds === TODAY ? React.createElement("span", { className: "tag grey" }, "Today") : React.createElement("span", { className: "tag red" }, "Absent")) : !rec.out && ds < YEST ? React.createElement("span", { className: "tag red" }, "No Check-Out") : lm > 0 ? React.createElement("span", { className: "tag amber" },
                        "Late by ",
                        minText(lm)) : React.createElement("span", { className: "tag" }, "On Time");
                    return React.createElement("tr", { key: ds },
                        React.createElement("td", null, niceDate(ds)),
                        React.createElement("td", null, rec ? timeText(rec.in, s) : "—"),
                        React.createElement("td", null, rec ? timeText(rec.out, s) : "—"),
                        React.createElement("td", null, rec?.method || "—"),
                        React.createElement("td", null, st),
                        React.createElement("td", null,
                            React.createElement("button", { className: "btn small", onClick: () => { setErr(""); setEdit({ date: ds, in: rec?.in || s.start, out: rec?.out || "", reason: "" }); } }, rec ? "Correct" : "Add Entry")));
                }))))));
}
const blankForm = () => ({ name: "", role: "", pin: "", joined: TODAY, left: "", salary: 30000, start: "09:00", end: "17:00", hours: 8, monthMode: "auto", monthHours: "", off: [], leaves: 4, grace: 10, from: TODAY });
const monthText = v => v === -1 ? "Automatic" : v ? `${v} hrs/month` : "No limit";
function Employees({ db, act }) {
    const [form, setForm] = useState(null);
    const [err, setErr] = useState("");
    const f = (k, v) => setForm({ ...form, [k]: v });
    const openEdit = e => { const s = settingsOn(e, TODAY) || e.history[e.history.length - 1]; setErr(""); setForm({ editId: e.id, name: e.name, role: e.role, pin: "", joined: e.joined, left: e.left || "", ...s, monthMode: s.monthHours === -1 ? "auto" : s.monthHours ? "fixed" : "none", monthHours: s.monthHours > 0 ? s.monthHours : "", monthHours: s.monthHours ?? "", off: [...s.off], from: TODAY }); };
    const save = async () => {
        const n = ["salary", "hours", "leaves", "grace"];
        const vals = Object.fromEntries(n.map(k => [k, Number(form[k])]));
        if (!form.name.trim())
            return setErr("Please enter the employee's name.");
        if (form.editId ? form.pin && !/^\d{4}$/.test(form.pin) : !/^\d{4}$/.test(form.pin))
            return setErr(form.editId ? "A new PIN must be 4 digits, or leave it blank to keep the current PIN." : "PIN must be 4 digits.");
        if (!form.joined)
            return setErr("Please enter the joining date.");
        if (form.monthMode === "fixed" && !(Number(form.monthHours) > 0))
            return setErr("Enter the allowed hours per month, or choose Automatic or No limit.");
        if (form.left && form.left < form.joined)
            return setErr("The resign date cannot be earlier than the joining date.");
        if (n.some(k => isNaN(vals[k]) || vals[k] < 0) || vals.salary <= 0 || vals.hours <= 0)
            return setErr("Please check the salary, hours, leaves and grace period.");
        const r = await act("/api/employees/save", { ...form, monthHours: form.monthMode === "auto" ? -1 : form.monthMode === "fixed" ? Number(form.monthHours) : "" }, setErr);
        if (r) {
            setForm(null);
            setErr("");
        }
    };
    const editing = form?.editId && db.employees.find(e => e.id === form.editId);
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Employees"),
        React.createElement("p", { className: "sub" }, "Setting changes take effect from the date you choose, so earlier payroll stays accurate. A resign date ends app access after the last working day, and salary is paid up to that day."),
        form ? (React.createElement("div", { className: "panel" },
            React.createElement("h2", null, form.editId ? `Edit Employee: ${editing.name}` : "New Employee"),
            React.createElement("div", { className: "fields" },
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Name"),
                    React.createElement("input", { value: form.name, onChange: e => f("name", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Designation"),
                    React.createElement("input", { value: form.role, onChange: e => f("role", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, form.editId ? "New PIN (optional)" : "PIN (4 digits)"),
                    React.createElement("input", { type: "password", inputMode: "numeric", autoComplete: "new-password", placeholder: form.editId ? "Keep current PIN" : "", value: form.pin, maxLength: 4, onChange: e => f("pin", e.target.value.replace(/\D/g, "")) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Joining date"),
                    React.createElement("input", { type: "date", value: form.joined, onChange: e => f("joined", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Resign date (last working day)"),
                    React.createElement("input", { type: "date", value: form.left, min: form.joined, onChange: e => f("left", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Monthly salary (Rs)"),
                    React.createElement("input", { type: "number", value: form.salary, onChange: e => f("salary", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Shift start"),
                    React.createElement("input", { type: "time", value: form.start, onChange: e => f("start", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Shift end"),
                    React.createElement("input", { type: "time", value: form.end, onChange: e => f("end", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Daily working hours"),
                    React.createElement("input", { type: "number", step: "0.5", value: form.hours, onChange: e => f("hours", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Allowed hours per month"),
                    React.createElement("select", { value: form.monthMode, onChange: e => f("monthMode", e.target.value) },
                        React.createElement("option", { value: "auto" }, "Automatic"),
                        React.createElement("option", { value: "fixed" }, "Fixed number"),
                        React.createElement("option", { value: "none" }, "No limit"))),
                form.monthMode === "fixed" && React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Hours per month"),
                    React.createElement("input", { type: "number", step: "1", value: form.monthHours, onChange: e => f("monthHours", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Paid leaves per month"),
                    React.createElement("input", { type: "number", value: form.leaves, onChange: e => f("leaves", e.target.value) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Grace period (minutes)"),
                    React.createElement("input", { type: "number", value: form.grace, onChange: e => f("grace", e.target.value) })),
                form.editId && React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Effective from"),
                    React.createElement("input", { type: "date", value: form.from, onChange: e => f("from", e.target.value) }))),
            form.monthMode === "auto" && React.createElement("p", { className: "muted", style: { margin: "0 0 12px", fontSize: 13 } }, "Automatic allowed hours = daily working hours \u00D7 (days in the month \u2212 weekly days off). For example, 10 hours a day with no weekly day off gives 280 hours in a 28-day month, 300 in a 30-day month and 310 in a 31-day month. Paid leaves not taken are paid extra in Payroll."),
            form.start && form.end && overnight(form) && React.createElement("div", { className: "notice", style: { marginBottom: 12 } }, "Night shift: ends the following morning. Attendance is recorded under the shift's start date, and the weekly day off refers to the night the shift would begin."),
            React.createElement("span", { className: "lbl" }, "Weekly day off"),
            React.createElement("div", { className: "chips", style: { marginBottom: 14 } }, DAYS.map((d, i) => React.createElement("button", { key: d, className: form.off.includes(i) ? "on" : "", onClick: () => f("off", form.off.includes(i) ? form.off.filter(x => x !== i) : [...form.off, i]) }, d))),
            React.createElement("div", { className: "row" },
                React.createElement("button", { className: "btn primary", onClick: save }, form.editId ? "Save Changes" : "Add Employee"),
                React.createElement("button", { className: "btn", onClick: () => setForm(null) }, "Cancel")),
            err && React.createElement("div", { className: "err" }, err),
            editing && React.createElement(React.Fragment, null,
                React.createElement("h2", { style: { marginTop: 20 } }, "Settings History"),
                React.createElement("table", { className: "t" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Effective From"),
                            React.createElement("th", null, "Salary"),
                            React.createElement("th", null, "Shift"),
                            React.createElement("th", null, "Hours/Day"),
                            React.createElement("th", null, "Hours/Month"),
                            React.createElement("th", null, "Paid Leaves"),
                            React.createElement("th", null, "Grace"))),
                    React.createElement("tbody", null, editing.history.slice().reverse().map(h => React.createElement("tr", { key: h.from },
                        React.createElement("td", null, niceDate(h.from)),
                        React.createElement("td", null, rs(h.salary)),
                        React.createElement("td", null, shiftText(h)),
                        React.createElement("td", null, h.hours),
                        React.createElement("td", null, monthText(h.monthHours)),
                        React.createElement("td", null, h.leaves),
                        React.createElement("td", null,
                            h.grace,
                            " min")))))))) : React.createElement("div", { style: { marginBottom: 18 } },
            React.createElement("button", { className: "btn primary", onClick: () => { setErr(""); setForm(blankForm()); } }, "Add Employee")),
        React.createElement("div", { className: "panel" },
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Employee"),
                        React.createElement("th", null, "Employment"),
                        React.createElement("th", null, "Salary"),
                        React.createElement("th", null, "Shift"),
                        React.createElement("th", null, "Hours"),
                        React.createElement("th", null, "Day Off"),
                        React.createElement("th", null, "Paid Leaves"),
                        React.createElement("th", null, "Grace"),
                        React.createElement("th", null))),
                React.createElement("tbody", null, [...db.employees].sort((a, b) => isGone(a) - isGone(b)).map(e => {
                    const s = settingsOn(e, TODAY) || e.history[e.history.length - 1];
                    return (React.createElement("tr", { key: e.id },
                        React.createElement("td", null,
                            React.createElement("b", null, e.name),
                            React.createElement("div", { className: "muted" }, e.role),
                            React.createElement("div", { className: "muted" }, e.id)),
                        React.createElement("td", { className: "nw" },
                            "Joined ",
                            longDate(e.joined),
                            e.left && React.createElement("div", { style: { marginTop: 4 } },
                                isGone(e) ? React.createElement("span", { className: "tag grey" }, "Resigned") : React.createElement("span", { className: "tag amber" }, "Leaving"),
                                " ",
                                React.createElement("span", { className: "muted" }, longDate(e.left)))),
                        React.createElement("td", { className: "nw" }, rs(s.salary)),
                        React.createElement("td", { className: "nw" },
                            fmt(s.start),
                            " \u2013 ",
                            fmt(s.end),
                            overnight(s) && React.createElement("div", { className: "muted" }, "Night shift")),
                        React.createElement("td", { className: "nw" },
                            s.hours,
                            " hrs/day",
                            React.createElement("div", { className: "muted" }, s.monthHours === -1 ? "Automatic monthly hours" : s.monthHours ? `${s.monthHours} hrs/month` : "No monthly limit")),
                        React.createElement("td", null, s.off.map(i => DAYS[i]).join(", ") || "None"),
                        React.createElement("td", { className: "nw" },
                            s.leaves,
                            " / month"),
                        React.createElement("td", { className: "nw" },
                            s.grace,
                            " min"),
                        React.createElement("td", null,
                            React.createElement("button", { className: "btn small", onClick: () => openEdit(e) }, "Edit"))));
                }))))));
}
function Phones({ db, act }) {
    const label = id => db.phones.find(p => p.id === id)?.label || "Unknown phone";
    const name = id => db.employees.find(e => e.id === id)?.name;
    const approve = r => act("/api/devices/decide", { phoneId: r.phoneId, approve: true });
    const reject = r => act("/api/devices/decide", { phoneId: r.phoneId, approve: false });
    const remove = e => { if (confirm(`Remove ${label(e.phone)} from ${e.name}? They will need to register a phone again.`))
        act("/api/devices/remove", { empId: e.id }); };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Registered Phones"),
        React.createElement("p", { className: "sub" }, "Each employee records attendance from one approved phone. Registration from any other phone requires approval here."),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Pending Approval"),
            db.requests.length === 0 ? React.createElement("p", { className: "muted" }, "No pending registrations.") :
                React.createElement("table", { className: "t" },
                    React.createElement("tbody", null, db.requests.map(r => (React.createElement("tr", { key: r.phoneId + r.empId },
                        React.createElement("td", null,
                            React.createElement("b", null, name(r.empId)),
                            " (",
                            r.empId,
                            ")",
                            React.createElement("div", { className: "muted" },
                                label(r.phoneId),
                                ", requested ",
                                r.at)),
                        React.createElement("td", null, r.change ? React.createElement("span", { className: "tag amber" }, "Phone Change") : React.createElement("span", { className: "tag grey" }, "New Registration")),
                        React.createElement("td", null,
                            React.createElement("div", { className: "row", style: { justifyContent: "flex-end" } },
                                React.createElement("button", { className: "btn small primary", onClick: () => approve(r) }, "Approve"),
                                React.createElement("button", { className: "btn small danger", onClick: () => reject(r) }, "Reject"))))))))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Approved Phones"),
            React.createElement("table", { className: "t" },
                React.createElement("tbody", null, db.employees.map(e => (React.createElement("tr", { key: e.id },
                    React.createElement("td", null,
                        React.createElement("b", null, e.name),
                        " (",
                        e.id,
                        ")"),
                    React.createElement("td", null, isGone(e) ? React.createElement("span", { className: "tag grey" }, "Resigned") : e.phone ? label(e.phone) : React.createElement("span", { className: "muted" }, "Not registered")),
                    React.createElement("td", { className: "r" }, e.phone && !isGone(e) && React.createElement("button", { className: "btn small danger", onClick: () => remove(e) }, "Remove Phone"))))))))));
}
function OvertimeInner({ db, act, me }) {
    const [month, setMonth] = useState(TODAY.slice(0, 7));
    const [draft, setDraft] = useState({});
    const [pre, setPre] = useState({ empId: db.employees[0].id, date: TODAY, hours: 1, rate: 1 });
    const name = id => db.employees.find(e => e.id === id)?.name;
    const has = (empId, date) => db.overtime.some(o => o.empId === empId && o.date === date);
    const detected = db.attendance.filter(a => a.synced && a.out && a.date.startsWith(month) && db.employees.some(e => e.id === a.empId)).map(a => {
        const e = db.employees.find(x => x.id === a.empId);
        const s = settingsOn(e, a.date);
        return { a, s, extra: extraAfterShift(a, s) };
    }).filter(x => x.extra >= 15 && !has(x.a.empId, x.a.date)).reverse();
    const approve = (empId, date, hours, rate) => act("/api/overtime/approve", { empId, date, hours: Number(hours), rate: Number(rate) });
    const remove = o => act("/api/overtime/cancel", { empId: o.empId, date: o.date });
    const approved = db.overtime.filter(o => o.date.startsWith(month));
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Overtime"),
        React.createElement("p", { className: "sub" }, "Time worked beyond a shift is paid only when approved. Approve it afterwards, or authorise it in advance for a specific date."),
        React.createElement("div", { className: "row", style: { marginBottom: 14 } },
            React.createElement(MonthPick, { value: month, onChange: setMonth })),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Pre-Approve Overtime"),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Employee"),
                    React.createElement("select", { value: pre.empId, onChange: e => setPre({ ...pre, empId: e.target.value }) }, db.employees.map(e => React.createElement("option", { key: e.id, value: e.id }, e.name)))),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Date"),
                    React.createElement("input", { type: "date", value: pre.date, onChange: e => setPre({ ...pre, date: e.target.value }) })),
                React.createElement("div", { className: "field", style: { width: 90 } },
                    React.createElement("label", null, "Hours"),
                    React.createElement("input", { type: "number", step: "0.5", value: pre.hours, onChange: e => setPre({ ...pre, hours: e.target.value }) })),
                React.createElement("div", { className: "field", style: { width: 100 } },
                    React.createElement("label", null, "Rate"),
                    React.createElement("select", { value: pre.rate, onChange: e => setPre({ ...pre, rate: e.target.value }) },
                        React.createElement("option", { value: 1 }, "1\u00D7"),
                        React.createElement("option", { value: 1.5 }, "1.5\u00D7"),
                        React.createElement("option", { value: 2 }, "2\u00D7"))),
                React.createElement("button", { className: "btn primary", onClick: () => approve(pre.empId, pre.date, pre.hours, pre.rate) }, "Approve Overtime"))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Unapproved Extra Time"),
            detected.length === 0 ? React.createElement("p", { className: "muted" },
                "No unapproved extra time in ",
                monthName(month),
                ".") :
                React.createElement("table", { className: "t" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Employee"),
                            React.createElement("th", null, "Date"),
                            React.createElement("th", null, "Shift End"),
                            React.createElement("th", null, "Check-Out"),
                            React.createElement("th", null, "Extra Time"),
                            React.createElement("th", null, "Payable Hours"),
                            React.createElement("th", null, "Rate"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, detected.map(({ a, s, extra }) => {
                        const dr = draft[a.id] || { hours: Math.round(extra / 15) / 4, rate: 1 };
                        const set = v => setDraft({ ...draft, [a.id]: { ...dr, ...v } });
                        return (React.createElement("tr", { key: a.id },
                            React.createElement("td", null, name(a.empId)),
                            React.createElement("td", null, niceDate(a.date)),
                            React.createElement("td", null, fmt(s.end)),
                            React.createElement("td", null, timeText(a.out, s)),
                            React.createElement("td", null,
                                extra,
                                " min"),
                            React.createElement("td", { style: { width: 90 } },
                                React.createElement("input", { type: "number", step: "0.25", value: dr.hours, onChange: e => set({ hours: e.target.value }) })),
                            React.createElement("td", { style: { width: 90 } },
                                React.createElement("select", { value: dr.rate, onChange: e => set({ rate: e.target.value }) },
                                    React.createElement("option", { value: 1 }, "1\u00D7"),
                                    React.createElement("option", { value: 1.5 }, "1.5\u00D7"),
                                    React.createElement("option", { value: 2 }, "2\u00D7"))),
                            React.createElement("td", null,
                                React.createElement("button", { className: "btn small primary", onClick: () => approve(a.empId, a.date, dr.hours, dr.rate) }, "Approve"))));
                    })))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null,
                "Approved in ",
                monthName(month)),
            approved.length === 0 ? React.createElement("p", { className: "muted" }, "No overtime approved this month.") :
                React.createElement("table", { className: "t" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Employee"),
                            React.createElement("th", null, "Date"),
                            React.createElement("th", null, "Hours"),
                            React.createElement("th", null, "Rate"),
                            React.createElement("th", null, "Approved By"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, approved.map(o => React.createElement("tr", { key: o.empId + o.date },
                        React.createElement("td", null, name(o.empId)),
                        React.createElement("td", null, niceDate(o.date)),
                        React.createElement("td", null, o.hours),
                        React.createElement("td", null,
                            o.rate,
                            "\u00D7"),
                        React.createElement("td", null, o.by),
                        React.createElement("td", { className: "r" },
                            React.createElement("button", { className: "btn small danger", onClick: () => remove(o) }, "Cancel")))))))));
}
function ExportButtons({ onExcel }) {
    const [msg, setMsg] = useState("");
    const excel = async () => { setMsg(""); try {
        await onExcel();
    }
    catch (e) {
        setMsg(e.message);
    } };
    return (React.createElement("span", { className: "row noprint", style: { alignItems: "center", marginLeft: "auto" } },
        React.createElement("button", { className: "btn", onClick: excel },
            React.createElement(Download, { size: 16 }),
            " Download Excel"),
        !inAndroidApp() && React.createElement("button", { className: "btn", onClick: () => window.print() }, "Print or Save as PDF"),
        msg && React.createElement("span", { className: "err", style: { marginTop: 0 } }, msg)));
}
const r2 = n => Math.round(n * 100) / 100;
function Salary({ db }) {
    const [month, setMonth] = useState(TODAY.slice(0, 7));
    const [open, setOpen] = useState(null);
    const rows = db.employees.map(e => ({ e, c: calcSalary(e, month, db.attendance, db.overtime) })).filter(r => r.c.base > 0);
    const total = rows.reduce((t, r) => t + r.c.payable, 0);
    const inProgress = rows[0]?.c.inProgress;
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Payroll"),
        React.createElement("p", { className: "sub" }, "Daily rate is the monthly salary divided by the days in the month. Absences beyond the paid leaves and late minutes beyond the grace period are deducted. Paid leaves not taken are paid extra at the daily rate when the month ends, and approved overtime is added. Select an employee to view the full calculation."),
        React.createElement("div", { className: "printhead" },
            "Haazir, eco Pharmacy: Payroll for ",
            monthName(month),
            inProgress ? " (in progress, calculated to yesterday)" : "",
            ". Printed ",
            longDate(TODAY),
            "."),
        React.createElement("div", { className: "row", style: { marginBottom: 14, alignItems: "center" } },
            React.createElement(MonthPick, { value: month, onChange: v => { setMonth(v); setOpen(null); } }),
            inProgress && React.createElement("span", { className: "tag amber" }, "In Progress: Calculated to Yesterday"),
            React.createElement(ExportButtons, { onExcel: () => saveBlob(makeXlsx("Payroll " + month, [
                    ["Employee ID", "Name", "Month", "Salary for Month", "Daily Rate", "Days Present", "Absences", "Covered by Paid Leave", "Unpaid Absences", "Absence Deduction", "Times Late", "Minutes Late (beyond grace)", "Late Deduction", "Unused Paid Leaves", "Unused Leave Pay", "Approved Overtime (hrs)", "Overtime Pay", "Net Payable"],
                    ...rows.map(({ e, c }) => [e.id, e.name, monthName(month), r2(c.base), r2(c.daily), c.present, c.absences, c.covered, c.unpaid, r2(c.absDed), c.lateCount, c.lateMins, r2(c.lateDed), c.inProgress ? "At month end" : c.unusedLeaves, r2(c.leavePay), c.otHours, r2(c.otPay), r2(c.payable)]),
                    ["", "Total", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", r2(total)],
                ]), `Haazir Payroll ${month}.xlsx`) })),
        React.createElement("div", { className: "panel" },
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Employee"),
                        React.createElement("th", { className: "r" }, "Salary"),
                        React.createElement("th", { className: "r" }, "Absences"),
                        React.createElement("th", { className: "r" }, "Late"),
                        React.createElement("th", { className: "r" }, "Unused Leave"),
                        React.createElement("th", { className: "r" }, "Overtime"),
                        React.createElement("th", { className: "r" }, "Net Payable"))),
                React.createElement("tbody", null,
                    rows.map(({ e, c }) => [
                        React.createElement("tr", { key: e.id, className: "click", onClick: () => setOpen(open === e.id ? null : e.id) },
                            React.createElement("td", null,
                                React.createElement("b", null, e.name),
                                React.createElement("div", { className: "muted" }, e.id)),
                            React.createElement("td", { className: "r" }, rs(c.base)),
                            React.createElement("td", { className: "r" }, c.absDed ? "− " + rs(c.absDed) : "—"),
                            React.createElement("td", { className: "r" }, c.lateDed ? "− " + rs(c.lateDed) : "—"),
                            React.createElement("td", { className: "r" }, c.leavePay ? "+ " + rs(c.leavePay) : c.inProgress ? React.createElement("span", { className: "muted" }, "Month end") : "—"),
                            React.createElement("td", { className: "r" }, c.otPay ? "+ " + rs(c.otPay) : "—"),
                            React.createElement("td", { className: "r" },
                                React.createElement("b", null, rs(c.payable)))),
                        open === e.id && React.createElement("tr", { key: e.id + "x" },
                            React.createElement("td", { colSpan: 7 },
                                React.createElement("div", { className: "breakdown" },
                                    React.createElement("div", null,
                                        React.createElement("span", null,
                                            "Salary for ",
                                            monthName(month),
                                            e.history.length > 1 || e.joined.startsWith(month) || e.left?.startsWith(month) ? " (adjusted for changes, joining or resign date)" : ""),
                                        React.createElement("span", null, rs(c.base))),
                                    React.createElement("div", null,
                                        React.createElement("span", null, "Daily rate"),
                                        React.createElement("span", null, rs(c.daily))),
                                    React.createElement("div", null,
                                        React.createElement("span", null, "Days present"),
                                        React.createElement("span", null, c.present)),
                                    React.createElement("div", null,
                                        React.createElement("span", null,
                                            "Absences: ",
                                            c.absences,
                                            ", covered by paid leave: ",
                                            c.covered,
                                            " of ",
                                            c.leaves,
                                            ", unpaid: ",
                                            c.unpaid),
                                        React.createElement("span", null, c.absDed ? "− " + rs(c.absDed) : "Rs 0")),
                                    React.createElement("div", null,
                                        React.createElement("span", null, c.inProgress ? `Unused paid leaves: calculated when the month ends (${Math.max(0, c.leaves - c.absences)} unused so far)` : `Unused paid leaves: ${c.unusedLeaves} × daily rate`),
                                        React.createElement("span", null, c.leavePay ? "+ " + rs(c.leavePay) : "Rs 0")),
                                    React.createElement("div", null,
                                        React.createElement("span", null,
                                            "Late ",
                                            c.lateCount,
                                            " times, ",
                                            c.lateMins,
                                            " min beyond grace"),
                                        React.createElement("span", null, c.lateDed ? "− " + rs(c.lateDed) : "Rs 0")),
                                    React.createElement("div", null,
                                        React.createElement("span", null,
                                            "Approved overtime: ",
                                            c.otHours,
                                            " hrs"),
                                        React.createElement("span", null, c.otPay ? "+ " + rs(c.otPay) : "Rs 0")),
                                    React.createElement("div", { className: "pay" },
                                        React.createElement("span", null, "Net payable"),
                                        React.createElement("span", null, rs(c.payable)))))),
                    ]),
                    React.createElement("tr", { className: "total" },
                        React.createElement("td", { colSpan: 6 }, "Total Payable"),
                        React.createElement("td", { className: "r" }, rs(total))))))));
}
function NetworkTab({ db, act }) {
    const [name, setName] = useState("");
    const recognised = db.atShop;
    const setNet = async () => { if (await act("/api/networks/add", { name }))
        setName(""); };
    const remove = n => { if (confirm(`Remove "${n.name}"? Staff on that connection will no longer be able to check in.`))
        act("/api/networks/remove", { id: n.id }); };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Pharmacy Network"),
        React.createElement("p", { className: "sub" }, "Haazir recognises the pharmacy by its internet address. Register it while this device is connected to the pharmacy Wi-Fi. If your internet provider changes the address, staff can use the counter code until you register it again."),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Your Current Connection"),
            React.createElement("div", { className: "row", style: { alignItems: "center", marginBottom: 12 } },
                React.createElement("span", { className: "num" },
                    "Detected internet address: ",
                    db.shopIP || "unknown"),
                recognised ? React.createElement("span", { className: "tag" }, "Recognised") : React.createElement("span", { className: "tag red" }, "Not Recognised")),
            !recognised && React.createElement("p", null, "If you are at the pharmacy now, register this connection so staff on this Wi-Fi can check in. If you are elsewhere, do this the next time you are at the pharmacy."),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "field", style: { flex: 1, minWidth: 200 } },
                    React.createElement("label", null, "Connection name"),
                    React.createElement("input", { placeholder: "e.g. Nayatel Fiber", value: name, onChange: e => setName(e.target.value) })),
                React.createElement("button", { className: "btn primary", onClick: setNet, disabled: recognised }, "Set as Pharmacy Network"))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Counter Code"),
            React.createElement("p", null, "When a phone is not on the pharmacy Wi-Fi, for example during an internet outage, staff check in with a 6-digit code that changes every 30 seconds. Show it on a spare phone or tablet kept plugged in at the counter."),
            React.createElement("ol", { style: { margin: "0 0 12px", paddingLeft: 20, fontSize: 14 } },
                React.createElement("li", null,
                    "On the spare phone, open ",
                    React.createElement("b", null, new URL("../counter/", location.href).href),
                    " in Chrome."),
                React.createElement("li", null, "Sign in once as a super admin. The code then keeps working even without internet."),
                React.createElement("li", null, "Keep the screen on: in the phone's display settings, set the screen timeout to the longest option.")),
            React.createElement("div", { className: "row" },
                React.createElement("a", { className: "btn", href: "../counter/", target: "_blank", rel: "noopener" }, "Open Counter Display"),
                React.createElement("button", { className: "btn danger", onClick: () => { if (confirm("Reset the counter code? Every counter display will need to be set up again."))
                        act("/api/counter/reset", {}); } }, "Reset Counter Code"))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Registered Networks"),
            db.networks.length === 0 ? React.createElement("p", { className: "muted" }, "No networks registered yet. Staff cannot check in until one is added.") :
                React.createElement("table", { className: "t" },
                    React.createElement("tbody", null, db.networks.map(n => React.createElement("tr", { key: n.id },
                        React.createElement("td", null,
                            React.createElement("b", null, n.name)),
                        React.createElement("td", { className: "num" }, n.ip.endsWith(".") ? n.ip + "x (local network)" : n.ip.endsWith(":") ? n.ip + "… (IPv6 network)" : n.ip),
                        React.createElement("td", { className: "r" },
                            React.createElement("button", { className: "btn small danger", onClick: () => remove(n) }, "Remove")))))))));
}
function Access({ db, act }) {
    const [form, setForm] = useState({ name: "", username: "", role: "Admin", password: "" });
    const [err, setErr] = useState("");
    const modes = [["both", "Biometric and PIN", "Both are required for every check-in. Recommended."],
        ["either", "Biometric, with PIN as backup", "Faster. The PIN is requested only if biometric verification fails."]];
    const add = async () => {
        if (!form.name.trim() || !form.username.trim())
            return setErr("Please enter a name and username.");
        if (await act("/api/admins/add", form, setErr)) {
            setForm({ name: "", username: "", role: "Admin", password: "" });
            setErr("");
        }
    };
    const reset = a => { const pw = prompt(`New password for ${a.name} (at least 8 characters):`); if (pw)
        act("/api/admins/reset", { username: a.username, password: pw }); };
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Admins & Security"),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Check-In Verification"),
            React.createElement("p", { className: "muted" }, "Fingerprint and face unlock work in the Haazir Android app. If a phone has no fingerprint or face unlock set up, the PIN is used instead. In a phone browser, such as Safari on iPhone, the PIN is used until Haazir is online with a secure address."),
            modes.map(([k, t, d]) => React.createElement("label", { key: k, className: "radio" + (db.mode === k ? " on" : "") },
                React.createElement("input", { type: "radio", name: "mode", checked: db.mode === k, onChange: () => act("/api/settings/mode", { mode: k }) }),
                React.createElement("span", null,
                    React.createElement("b", null, t),
                    React.createElement("br", null),
                    React.createElement("span", { className: "muted" }, d))))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Administrators"),
            React.createElement("p", { className: "muted" }, "Admins and super admins sign in with a username and password from any device or network to manage Haazir, and the one-phone rule does not apply to them. Admins may record their own attendance only on the pharmacy network; super admins may do so from anywhere."),
            React.createElement("table", { className: "t" },
                React.createElement("tbody", null, db.admins.map(a => React.createElement("tr", { key: a.username },
                    React.createElement("td", null,
                        React.createElement("b", null, a.name)),
                    React.createElement("td", null, a.username),
                    React.createElement("td", null,
                        React.createElement("span", { className: "tag" + (a.role === "Admin" ? " grey" : "") }, a.role)),
                    React.createElement("td", { className: "r" }, a.username !== db.me.username && React.createElement("div", { className: "row", style: { justifyContent: "flex-end" } },
                        React.createElement("button", { className: "btn small", onClick: () => reset(a) }, "Reset Password"),
                        React.createElement("button", { className: "btn small danger", onClick: () => { if (confirm(`Remove ${a.name}?`))
                                act("/api/admins/remove", { username: a.username }); } }, "Remove"))))))),
            React.createElement("div", { className: "row", style: { marginTop: 14 } },
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Name"),
                    React.createElement("input", { value: form.name, onChange: e => setForm({ ...form, name: e.target.value }) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Username"),
                    React.createElement("input", { value: form.username, onChange: e => setForm({ ...form, username: e.target.value }) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Temporary password"),
                    React.createElement("input", { type: "password", autoComplete: "new-password", value: form.password, onChange: e => setForm({ ...form, password: e.target.value }) })),
                React.createElement("div", { className: "field" },
                    React.createElement("label", null, "Role"),
                    React.createElement("select", { value: form.role, onChange: e => setForm({ ...form, role: e.target.value }) },
                        React.createElement("option", null, "Admin"),
                        React.createElement("option", null, "Super Admin"))),
                React.createElement("button", { className: "btn primary", onClick: add }, "Add Admin")),
            err && React.createElement("div", { className: "err" }, err))));
}
function Log({ db }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Audit Log"),
        React.createElement("p", { className: "sub" }, "A permanent record of every manual entry, correction, approval and settings change. Entries cannot be edited or deleted."),
        React.createElement("div", { className: "panel" },
            React.createElement("table", { className: "t" },
                React.createElement("thead", null,
                    React.createElement("tr", null,
                        React.createElement("th", null, "Date & Time"),
                        React.createElement("th", null, "User"),
                        React.createElement("th", null, "Activity"))),
                React.createElement("tbody", null, db.audit.map((a, i) => React.createElement("tr", { key: i },
                    React.createElement("td", { style: { whiteSpace: "nowrap" } }, a.at),
                    React.createElement("td", { style: { whiteSpace: "nowrap" } }, a.by),
                    React.createElement("td", null, a.what))))))));
}
function NoStaff({ title }) {
    return React.createElement(React.Fragment, null,
        React.createElement("h1", null, title),
        React.createElement("div", { className: "panel" },
            React.createElement("p", { className: "muted" }, "No employees yet. Add your staff on the Employees page first.")));
}
function Records(p) { return p.db.employees.length ? React.createElement(RecordsInner, { ...p }) : React.createElement(NoStaff, { title: "Attendance Records" }); }
function WorkHours(p) { return p.db.employees.length ? React.createElement(WorkHoursInner, { ...p }) : React.createElement(NoStaff, { title: "Work Hours" }); }
function Overtime(p) { return p.db.employees.length ? React.createElement(OvertimeInner, { ...p }) : React.createElement(NoStaff, { title: "Overtime" }); }
/* ---------- notifications ---------- */
const NOTE_TYPES = [
    ["checkin", "Check-In", "When an employee checks in.", ""],
    ["checkout", "Check-Out", "When an employee checks out.", " grey"],
    ["late", "Late Arrival", "When an employee arrives after the grace period.", " amber"],
    ["absent", "Not Checked In", "When an employee has not checked in by shift start plus grace period.", " red"],
    ["overleave", "Beyond Allowed Leaves", "When an absent employee has already used all paid leaves for the month.", " red"],
    ["pinreset", "PIN Reset Request", "When an employee forgets their PIN and asks for a new one.", " amber"],
];
const noteLabel = t => (NOTE_TYPES.find(n => n[0] === t) || [t, t])[1];
const noteTag = t => (NOTE_TYPES.find(n => n[0] === t) || [, , , ""])[3];
const deviceNotesSupported = () => "Notification" in window && window.isSecureContext;
// Keeps the notification list up to date, shows pop-ups and, if allowed, device notifications.
function useNotifications(db, setPhase, onNew) {
    const [events, setEvents] = useState([]);
    const [popups, setPopups] = useState([]);
    const [lastSeen, setLastSeen] = useState(0);
    const [settings, setSettings] = useState(false);
    const cursor = useRef(null);
    const prefsRef = useRef({});
    prefsRef.current = db ? db.me.notify : {};
    const poll = async () => {
        if (!db)
            return;
        try {
            const first = cursor.current === null;
            const r = await api("/api/events?after=" + (first ? 0 : cursor.current));
            setLastSeen(r.lastSeen);
            if (first) {
                setEvents(r.events.slice(0, 30));
                cursor.current = r.latestId;
                return;
            }
            cursor.current = Math.max(cursor.current, r.latestId);
            if (!r.events.length)
                return;
            setEvents(ev => [...r.events, ...ev].slice(0, 30));
            const fresh = r.events.slice(0, 4).reverse();
            setPopups(pp => [...pp, ...fresh].slice(-4));
            for (const e of fresh)
                setTimeout(() => setPopups(pp => pp.filter(x => x.id !== e.id)), 10000);
            if (prefsRef.current.device && deviceNotesSupported() && Notification.permission === "granted" && document.visibilityState !== "visible") {
                for (const e of fresh) {
                    try {
                        new Notification("Haazir: " + noteLabel(e.type), { body: e.text, icon: "/icon-192.png", tag: "hz" + e.id });
                    }
                    catch { /* not allowed */ }
                }
            }
            if (prefsRef.current.sound !== false)
                playChime();
            onNew();
        }
        catch (e) {
            if (e.status === 401)
                setPhase("login");
        }
    };
    useEffect(() => { if (!db)
        return; poll(); const t = setInterval(poll, 15000); return () => clearInterval(t); }, [!!db]);
    const reset = () => { cursor.current = null; poll(); };
    const markRead = async () => { const top = events[0] ? events[0].id : 0; setLastSeen(top); try {
        await api("/api/events/seen", { id: top });
    }
    catch { /* ignore */ } };
    return { events, popups, lastSeen, markRead, closePopup: id => setPopups(pp => pp.filter(x => x.id !== id)), settings, openSettings: () => setSettings(true), closeSettings: () => setSettings(false), reset };
}
function BellMenu({ notif }) {
    const [open, setOpen] = useState(false);
    const unread = notif.events.filter(e => e.id > notif.lastSeen).length;
    return (React.createElement("div", { className: "acct" },
        React.createElement("button", { className: "bell", onClick: () => setOpen(!open), "aria-label": `Notifications, ${unread} unread`, "aria-expanded": open },
            React.createElement(Bell, { size: 19 }),
            unread > 0 && React.createElement("span", { className: "dot" }, unread > 9 ? "9+" : unread)),
        open && React.createElement("div", { className: "menu notes" },
            React.createElement("div", { className: "noteshead" },
                React.createElement("b", null, "Notifications"),
                unread > 0 && React.createElement("button", { className: "btn small", onClick: notif.markRead }, "Mark All as Read")),
            notif.events.length === 0 ? React.createElement("p", { className: "muted", style: { padding: "8px 12px", margin: 0 } }, "No notifications yet. Choose which ones you receive in Notification Settings.") :
                notif.events.map(e => React.createElement("div", { key: e.id, className: "note" + (e.id > notif.lastSeen ? " unread" : "") },
                    React.createElement("span", { className: "tag" + noteTag(e.type) }, noteLabel(e.type)),
                    React.createElement("div", null, e.text),
                    React.createElement("small", null, e.at))),
            React.createElement("button", { onClick: () => { setOpen(false); notif.openSettings(); } },
                React.createElement(Bell, { size: 16 }),
                " Notification Settings"))));
}
function Popups({ notif }) {
    return React.createElement("div", { className: "popups", "aria-live": "polite" }, notif.popups.map(e => (React.createElement("div", { key: e.id, className: "popup pop" + noteTag(e.type) },
        React.createElement("div", { className: "row", style: { justifyContent: "space-between", alignItems: "center" } },
            React.createElement("span", { className: "tag" + noteTag(e.type) }, noteLabel(e.type)),
            React.createElement("button", { className: "x", onClick: () => notif.closePopup(e.id), "aria-label": "Dismiss" },
                React.createElement(X, { size: 16 }))),
        React.createElement("div", { className: "ptext" }, e.text),
        React.createElement("small", null, e.at)))));
}
function NotifySettings({ db, act, notif }) {
    const [p, setP] = useState({ ...db.me.notify });
    const [msg, setMsg] = useState("");
    const toggle = k => setP({ ...p, [k]: !p[k] });
    const toggleDevice = async () => {
        if (p.device)
            return setP({ ...p, device: false });
        if (!deviceNotesSupported())
            return setMsg("This browser can only show pop-ups inside Haazir. Device notifications need the secure online version of Haazir, which comes with the online setup, or Haazir opened on this computer at localhost.");
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
            setP({ ...p, device: true });
            setMsg("");
        }
        else
            setMsg("Notifications are blocked for Haazir in this browser. Allow them in the browser's site settings, then try again.");
    };
    const save = async () => { if (await act("/api/notify/prefs", { ...p, sound: p.sound !== false }, setMsg)) {
        notif.closeSettings();
        notif.reset();
    } };
    return (React.createElement("div", { className: "modalwrap", role: "dialog", "aria-modal": "true", "aria-labelledby": "nstitle", onClick: e => { if (e.target === e.currentTarget)
            notif.closeSettings(); } },
        React.createElement("div", { className: "modal" },
            React.createElement("h2", { id: "nstitle" }, "Notification Settings"),
            React.createElement("p", { className: "muted" }, "Choose which pop-ups you receive. These settings apply to your account only."),
            NOTE_TYPES.map(([k, t, d]) => React.createElement("label", { key: k, className: "switchrow" },
                React.createElement("span", null,
                    React.createElement("b", null, t),
                    React.createElement("small", null, d)),
                React.createElement("input", { type: "checkbox", className: "switch", checked: p[k] !== false && (p[k] !== undefined || k === "pinreset"), onChange: () => setP({ ...p, [k]: !(p[k] !== false && (p[k] !== undefined || k === "pinreset")) }) }))),
            React.createElement("label", { className: "switchrow" },
                React.createElement("span", null,
                    React.createElement("b", null, "Notification Tone"),
                    React.createElement("small", null, "Play a short tone when a new notification arrives.")),
                React.createElement("input", { type: "checkbox", className: "switch", checked: p.sound !== false, onChange: () => setP({ ...p, sound: p.sound === false }) })),
            React.createElement("label", { className: "switchrow" },
                React.createElement("span", null,
                    React.createElement("b", null, "Device Notifications"),
                    React.createElement("small", null, "Also show notifications on this device while Haazir is open in the background.")),
                React.createElement("input", { type: "checkbox", className: "switch", checked: !!p.device, onChange: toggleDevice })),
            msg && React.createElement("div", { className: "notice", style: { marginTop: 10 } }, msg),
            React.createElement("div", { className: "row", style: { marginTop: 16, justifyContent: "flex-end" } },
                React.createElement("button", { className: "btn", onClick: notif.closeSettings }, "Cancel"),
                React.createElement("button", { className: "btn primary", onClick: save }, "Save Settings")))));
}
/* ---------- backup and restore ---------- */
async function pickFromApp() {
    const [name, data, err] = await askApp({ type: "pick" }, "hzAppPicked");
    if (err)
        throw new Error(err);
    return name ? { name, blob: base64ToBlob(data) } : null;
}
const sizeText = n => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
function BackupPage() {
    const [list, setList] = useState(null);
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [file, setFile] = useState(null);
    const [note, setNote] = useState("");
    const app = inAndroidApp();
    const load = async () => { try {
        setList(await api("/api/backups"));
    }
    catch (e) {
        setErr(e.message);
    } };
    useEffect(() => { load(); }, []);
    const download = async (path) => {
        setErr("");
        setNote("");
        try {
            if (await downloadFile(path, "haazir-backup.json"))
                setNote(app ? "Backup saved on this phone." : "Backup downloaded. Keep the file somewhere safe.");
            load();
        }
        catch (e) {
            setErr(e.message);
        }
    };
    const choose = async () => { setErr(""); try {
        const f = await pickFromApp();
        if (f)
            setFile(f);
    }
    catch (e) {
        setErr(e.message);
    } };
    const warning = "All current Haazir data will be replaced by this backup. A \"Before restore\" copy of the current data is saved first, so this can be undone. Everyone will need to sign in again.";
    const finish = () => { setBusy(false); alert("The backup has been restored. Please sign in again."); location.reload(); };
    const restoreFile = async () => {
        if (!file)
            return setErr("Choose a backup file first.");
        if (!confirm(`Restore "${file.name}"?\n\n${warning}`))
            return;
        setBusy(true);
        setErr("");
        try {
            await apiUpload("/api/backup/restore", file.blob || file);
            finish();
        }
        catch (e) {
            setErr(e.message);
            setBusy(false);
        }
    };
    const restoreSaved = async (b) => {
        if (!confirm(`Restore the ${b.kind.toLowerCase()} backup from ${b.at}?\n\n${warning}`))
            return;
        setBusy(true);
        setErr("");
        try {
            await api("/api/backup/restore-saved", { name: b.name });
            finish();
        }
        catch (e) {
            setErr(e.message);
            setBusy(false);
        }
    };
    if (busy)
        return (React.createElement(React.Fragment, null,
            React.createElement("h1", null, "Backup & Restore"),
            React.createElement("div", { className: "panel" },
                React.createElement("h2", null, "Restoring Backup"),
                React.createElement("p", null, "Haazir is restoring the backup. Please wait and keep this page open."))));
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "Backup & Restore"),
        React.createElement("p", { className: "sub" }, "Haazir saves a backup automatically every day. Download a copy regularly and keep it somewhere safe, such as Google Drive or a USB drive."),
        err && React.createElement("div", { className: "notice", style: { marginBottom: 16 } }, err),
        note && React.createElement("div", { className: "sheet ok", style: { marginBottom: 16, flexDirection: "row", textAlign: "left" } },
            React.createElement(Check, { size: 18, color: "#00661A" }),
            note),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Download a Backup"),
            React.createElement("p", null, "Saves a complete copy of all Haazir data: employees, attendance, payroll settings, admins and the audit log. Ideally do this once a week."),
            React.createElement("button", { className: "btn primary", onClick: () => download("/api/backup/download") },
                React.createElement(Download, { size: 16 }),
                " Download Backup"),
            app && React.createElement("p", { className: "muted", style: { marginTop: 10, fontSize: 13 } }, "Your phone asks where to save it. Choose Google Drive or a folder such as Downloads.")),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Restore from a File"),
            React.createElement("p", null, "Choose a backup file you downloaded earlier."),
            React.createElement("div", { className: "row", style: { alignItems: "center" } },
                app ? React.createElement(React.Fragment, null,
                    React.createElement("button", { className: "btn", onClick: choose },
                        React.createElement(Upload, { size: 16 }),
                        " Choose Backup File"),
                    React.createElement("span", { className: "muted" }, file ? file.name : "No file chosen"))
                    : React.createElement("input", { type: "file", accept: ".json,application/json", onChange: e => { setFile(e.target.files[0] || null); setErr(""); }, style: { maxWidth: 360 } }),
                React.createElement("button", { className: "btn danger", onClick: restoreFile, disabled: !file },
                    React.createElement(Upload, { size: 16 }),
                    " Restore This Backup")),
            React.createElement("div", { className: "notice", style: { marginTop: 12 } }, "Restoring replaces all current data with the backup. A safety copy of the current data is saved first.")),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "Saved Backups"),
            list === null ? React.createElement("p", { className: "muted" }, "Loading\u2026") : list.length === 0 ? React.createElement("p", { className: "muted" }, "No saved backups yet. The first one is made automatically today.") :
                React.createElement("table", { className: "t" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "Date"),
                            React.createElement("th", null, "Type"),
                            React.createElement("th", { className: "r" }, "Size"),
                            React.createElement("th", null))),
                    React.createElement("tbody", null, list.map(b => React.createElement("tr", { key: b.name },
                        React.createElement("td", { className: "nw" }, b.at),
                        React.createElement("td", null,
                            React.createElement("span", { className: "tag" + (b.kind === "Daily" ? " grey" : " amber") }, b.kind)),
                        React.createElement("td", { className: "r nw" }, sizeText(b.size)),
                        React.createElement("td", { className: "r" },
                            React.createElement("div", { className: "row", style: { justifyContent: "flex-end" } },
                                React.createElement("button", { className: "btn small", onClick: () => download("/api/backups/file?name=" + encodeURIComponent(b.name)) },
                                    React.createElement(Download, { size: 14 }),
                                    " Download"),
                                React.createElement("button", { className: "btn small danger", onClick: () => restoreSaved(b) }, "Restore"))))))),
            React.createElement("p", { className: "muted", style: { marginTop: 12, fontSize: 13 } }, "Daily backups are kept for 30 days. \"Before restore\" copies are kept until you restore over them."))));
}
function Updates({ db }) {
    const cronOk = db.cron === "ok";
    return (React.createElement(React.Fragment, null,
        React.createElement("h1", null, "App Updates"),
        React.createElement("p", { className: "sub" }, "Haazir runs online on Supabase and GitHub Pages. New versions are installed automatically when they are published to Haazir's GitHub repository."),
        React.createElement("div", { className: "stats" },
            React.createElement("div", { className: "stat" },
                React.createElement("span", null, "Installed version"),
                React.createElement("b", null, db.version),
                React.createElement("small", null, "Haazir for eco Pharmacy")),
            React.createElement("div", { className: "stat" },
                React.createElement("span", null, "Automatic checks"),
                React.createElement("b", null, cronOk ? "Running" : "Limited"),
                React.createElement("small", null, cronOk ? "Absence alerts and daily backups run every minute." : "They run whenever Haazir is in use."))),
        React.createElement("div", { className: "panel" },
            React.createElement("h2", null, "How to Install an Update"),
            React.createElement("ol", { style: { margin: 0, paddingLeft: 20 } },
                React.createElement("li", null, "You receive the new Haazir files."),
                React.createElement("li", null,
                    "On GitHub, open the ",
                    React.createElement("b", null, "haazir-online"),
                    " repository, choose ",
                    React.createElement("b", null, "Add file \u2192 Upload files"),
                    ", drag the new files in, and click ",
                    React.createElement("b", null, "Commit changes"),
                    "."),
                React.createElement("li", null,
                    "GitHub updates Haazir automatically within about 3 minutes. Open pages show a ",
                    React.createElement("b", null, "Reload"),
                    " button when the new version is ready.")),
            !cronOk && db.cron && React.createElement("p", { className: "muted", style: { marginTop: 12, fontSize: 13 } },
                "Automatic checks could not be switched on: ",
                db.cron))));
}
/* ---------- account, sign-in and app root ---------- */
function AccountMenu({ db, act, onSignOut, onSettings }) {
    const [open, setOpen] = useState(false);
    const initials = db.me.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    const changePassword = async () => {
        setOpen(false);
        const current = prompt("Current password:");
        if (!current)
            return;
        const next = prompt("New password (at least 8 characters):");
        if (!next)
            return;
        if (await act("/api/password", { current, next }))
            alert("Your password has been changed.");
    };
    return (React.createElement("div", { className: "acct" },
        React.createElement("button", { className: "userchip", onClick: () => setOpen(!open), "aria-expanded": open },
            React.createElement("span", { className: "avatar" }, initials),
            React.createElement("span", null,
                React.createElement("b", null, db.me.name),
                React.createElement("small", null, db.me.role))),
        open && React.createElement("div", { className: "menu" },
            React.createElement("button", { onClick: () => { setOpen(false); onSettings(); } },
                React.createElement(Bell, { size: 16 }),
                " Notification Settings"),
            React.createElement("button", { onClick: changePassword },
                React.createElement(KeyRound, { size: 16 }),
                " Change Password"),
            React.createElement("button", { onClick: onSignOut },
                React.createElement(LogOut, { size: 16 }),
                " Sign Out"))));
}
function AuthCard({ title, text, children }) {
    return (React.createElement("div", { className: "pa authwrap" },
        React.createElement("div", { className: "authcard" },
            React.createElement("div", { className: "brand" },
                React.createElement("img", { src: LOGO, alt: "" }),
                React.createElement("span", { className: "wordmark" },
                    React.createElement("b", null, "Haazir"),
                    React.createElement("small", null,
                        React.createElement("span", { className: "eco" }, "eco"),
                        " Pharmacy Staff Attendance"))),
            React.createElement("h1", null, title),
            text && React.createElement("p", null, text),
            children,
            React.createElement(Copyright, null))));
}
function Setup({ onDone }) {
    const [f, setF] = useState({ name: "", username: "", password: "", confirm: "" });
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        if (f.password !== f.confirm)
            return setErr("The passwords do not match.");
        setBusy(true);
        try {
            const r = await api("/api/setup", { name: f.name, username: f.username, password: f.password });
            localStorage.setItem("hz_token", r.token);
            onDone();
        }
        catch (x) {
            setErr(x.message);
            setBusy(false);
        }
    };
    return (React.createElement(AuthCard, { title: "Welcome to Haazir", text: "Create the owner account. This account is the super admin and can manage everything, including other admins." },
        React.createElement("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: 12 } },
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Your name"),
                React.createElement("input", { value: f.name, onChange: e => setF({ ...f, name: e.target.value }), autoComplete: "name" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Username"),
                React.createElement("input", { value: f.username, onChange: e => setF({ ...f, username: e.target.value }), autoComplete: "username", autoCapitalize: "none" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Password (at least 8 characters)"),
                React.createElement("input", { type: "password", value: f.password, onChange: e => setF({ ...f, password: e.target.value }), autoComplete: "new-password" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Confirm password"),
                React.createElement("input", { type: "password", value: f.confirm, onChange: e => setF({ ...f, confirm: e.target.value }), autoComplete: "new-password" })),
            err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err),
            React.createElement("button", { className: "btn primary block", disabled: busy }, "Create Owner Account"))));
}
function Login({ onDone }) {
    const [f, setF] = useState({ username: "", password: "" });
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const submit = async (e) => {
        e.preventDefault();
        setBusy(true);
        try {
            const r = await api("/api/login", f);
            localStorage.setItem("hz_token", r.token);
            onDone();
        }
        catch (x) {
            setErr(x.message);
            setBusy(false);
        }
    };
    return (React.createElement(AuthCard, { title: "Sign In", text: "For admins and super admins." },
        React.createElement("form", { onSubmit: submit, style: { display: "flex", flexDirection: "column", gap: 12 } },
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Username"),
                React.createElement("input", { value: f.username, onChange: e => setF({ ...f, username: e.target.value }), autoComplete: "username", autoCapitalize: "none" })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Password"),
                React.createElement("input", { type: "password", value: f.password, onChange: e => setF({ ...f, password: e.target.value }), autoComplete: "current-password" })),
            err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err),
            React.createElement("button", { className: "btn primary block", disabled: busy }, "Sign In"))));
}
function AdminApp() {
    const [phase, setPhase] = useState("loading"); // loading | setup | login | ready
    const [db, setDb] = useState(null);
    const [toast, showToast] = useToast();
    const load = async () => {
        try {
            const data = await api("/api/state");
            const first = data.employees.map(e => e.joined).sort()[0];
            setClock(data.today, first);
            setDb(data);
            setPhase("ready");
        }
        catch (e) {
            if (e.status === 401) {
                try {
                    const s = await api("/api/setup");
                    setPhase(s.needsSetup ? "setup" : "login");
                }
                catch (x) {
                    showToast(x.message, true);
                    setPhase("login");
                }
            }
            else {
                showToast(e.message, true);
                if (!db)
                    setPhase("login");
            }
        }
    };
    useEffect(() => { load(); const t = setInterval(() => { if (document.visibilityState === "visible")
        load(); }, 60000); return () => clearInterval(t); }, []);
    // Run a change on the server, then reload. Errors go to the form (setErr) or a message at the bottom.
    const act = async (path, body, setErr) => {
        try {
            await api(path, body);
            await load();
            return true;
        }
        catch (e) {
            if (e.status === 401) {
                setPhase("login");
                return false;
            }
            if (setErr)
                setErr(e.message);
            else
                showToast(e.message, true);
            return false;
        }
    };
    const signOut = async () => { try {
        await api("/api/logout", {});
    }
    catch { /* ignore */ } localStorage.removeItem("hz_token"); setDb(null); setPhase("login"); };
    const notif = useNotifications(phase === "ready" ? db : null, setPhase, () => load());
    const serverVersion = useServerVersion();
    return (React.createElement(React.Fragment, null,
        React.createElement("style", null, CSS),
        phase === "loading" && React.createElement("div", { className: "pa loading" }, "Loading Haazir\u2026"),
        phase === "setup" && React.createElement(Setup, { onDone: load }),
        phase === "login" && React.createElement(Login, { onDone: load }),
        phase === "ready" && db && React.createElement("div", { className: "pa" },
            React.createElement(AdminView, { db: db, act: act, reload: load, onSignOut: signOut, notif: notif, serverVersion: serverVersion }),
            React.createElement(Popups, { notif: notif }),
            notif.settings && React.createElement(NotifySettings, { db: db, act: act, notif: notif })),
        React.createElement(Toast, { toast: toast })));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(AdminApp, null));
