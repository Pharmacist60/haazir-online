"use strict";
"use strict";
const APP_VERSION = "1.9.0";
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
@media(max-width:760px){.menu.notes{position:fixed;left:8px;right:8px;top:62px;width:auto;max-width:none;max-height:75vh}.menu{max-width:calc(100vw - 16px)}.popups{left:10px;right:10px;bottom:10px;width:auto;max-width:none}.topright{gap:8px}}
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
.pa textarea{font:inherit;color:var(--ink);background:#fff;border:1px solid var(--line);border-radius:8px;padding:8px 10px;width:100%;resize:vertical}
.remark{margin-top:4px;font-size:12px;color:#7A4E05;background:#FCF1DC;border-radius:6px;padding:2px 8px;max-width:260px;white-space:normal}
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
// Attendance is only checked from the day Haazir started being used; earlier days are paid normally.
let TRACK_START = "0000-00-00";
function setClock(today, firstDate, trackStart) { TODAY = today; YEST = addDays(today, -1); if (firstDate)
    FIRST_MONTH = firstDate.slice(0, 7); if (trackStart)
    TRACK_START = trackStart; }
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
// Early leave rules (set by the super admin under Admins & Security).
let RULES = { earlyGrace: 15, halfPct: 50 };
function setRules(r) { if (r)
    RULES = { ...RULES, ...r }; }
// How a completed day counts: full day, half day (left early but worked at least the half-day share), or short day (counts as an absence).
function dayKind(rec, s) {
    if (!rec || !rec.out)
        return { kind: "full", early: 0, worked: null };
    const endAbs = toMin(s.end) + (overnight(s) ? 1440 : 0);
    const early = Math.max(0, endAbs - rel(rec.out, s));
    const worked = rel(rec.out, s) - rel(rec.in, s);
    if (early <= RULES.earlyGrace)
        return { kind: "full", early, worked };
    return { kind: worked >= s.hours * 60 * RULES.halfPct / 100 ? "half" : "short", early, worked };
}
function calcSalary(e, ym, attendance, overtime) {
    const [y, m] = ym.split("-").map(Number);
    const dim = daysIn(y, m);
    let base = 0, earnedBase = 0, doneDays = 0, remaining = 0, lateDed = 0, lateCount = 0, lateMins = 0, otPay = 0, otHours = 0, present = 0, untracked = 0, halfDays = 0, shortDays = 0;
    const missed = []; // days counted as absence: { ds, dp, units } (1 = full day, 0.5 = half day)
    let absentDays = 0;
    const lastS = settingsOn(e, `${ym}-${pad(dim)}`);
    for (let d = 1; d <= dim; d++) {
        const ds = `${ym}-${pad(d)}`;
        if (!employed(e, ds))
            continue;
        const s = settingsOn(e, ds);
        if (!s)
            continue;
        // Days before attendance tracking started are not part of Haazir's payroll.
        if (ds < TRACK_START) {
            untracked++;
            continue;
        }
        const dp = s.salary / dim;
        base += dp;
        const rec = attendance.find(a => a.synced && a.empId === e.id && a.date === ds);
        // Only completed days are paid: every day up to yesterday, plus today once today's check-out is done.
        if (ds < TODAY || (ds === TODAY && rec && rec.out)) {
            earnedBase += dp;
            doneDays++;
        }
        else {
            remaining++;
            continue;
        }
        if (s.off.includes(weekday(ds)))
            continue;
        if (!rec) {
            missed.push({ ds, dp, units: 1 });
            absentDays++;
            continue;
        }
        present++;
        const k = dayKind(rec, s);
        if (k.kind === "half") {
            halfDays++;
            missed.push({ ds, dp, units: 0.5 });
        }
        else if (k.kind === "short") {
            shortDays++;
            missed.push({ ds, dp, units: 1 });
            continue;
        }
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
    // Paid leaves (pro-rated to the tracked days of the month) cover absences, half days and short days in date order.
    let empDays = 0, firstDay = null, lastDay = null, trackedDays = 0;
    for (let d = 1; d <= dim; d++) {
        const ds = `${ym}-${pad(d)}`;
        if (employed(e, ds)) {
            empDays++;
            firstDay = firstDay || ds;
            lastDay = ds;
            if (ds >= TRACK_START)
                trackedDays++;
        }
    }
    const leaves = lastS ? Math.round(lastS.leaves * trackedDays / dim) : 0;
    let left = leaves, absDed = 0, covered = 0, unpaidUnits = 0;
    for (const mday of missed) {
        const c = Math.min(mday.units, left);
        left -= c;
        covered += c;
        unpaidUnits += mday.units - c;
        absDed += (mday.units - c) * mday.dp;
    }
    const usedUnits = missed.reduce((t, x) => t + x.units, 0);
    const inProgress = `${ym}-${pad(dim)}` >= TODAY;
    const daily = lastS ? lastS.salary / dim : 0;
    // Paid leaves not taken are paid extra at the daily rate, once the month is complete.
    const unusedLeaves = Math.max(0, leaves - usedUnits);
    const leavePay = inProgress ? 0 : unusedLeaves * daily;
    const earned = earnedBase - absDed - lateDed + otPay + leavePay;
    return { base, earnedBase, earned, present, absences: absentDays, halfDays, shortDays, usedUnits, leaves, covered, unpaid: unpaidUnits, absDed, unusedLeaves, leavePay, lateCount, lateMins, lateDed, otHours, otPay, payable: earned, inProgress, daily, empDays, dim, firstDay, lastDay, untracked, doneDays, remaining };
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
/* ---------- employee app ---------- */
// Each phone gets a random secret the first time it opens Haazir. The server only keeps its fingerprint.
(function initDevice() {
    let t = localStorage.getItem("hz_device");
    if (!t) {
        const b = new Uint8Array(32);
        crypto.getRandomValues(b);
        t = Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
        localStorage.setItem("hz_device", t);
    }
    window.HZ_DEVICE = t;
})();
function phoneLabel() {
    const ua = navigator.userAgent;
    if (/iPhone/.test(ua))
        return "iPhone";
    if (/iPad/.test(ua))
        return "iPad";
    if (/Android/.test(ua)) {
        const m = ua.match(/Android[^;]*;\s*([^;)]+?)(\s+Build|\))/);
        return m && m[1] && !/^wv$|^K$/.test(m[1]) ? m[1].trim() : "Android phone";
    }
    return "Browser";
}
function openRecordClient(emp, records, nowM) {
    return records.find(a => {
        if (a.out || (a.date !== TODAY && a.date !== YEST))
            return false;
        const sa = settingsOn(emp, a.date);
        if (!sa)
            return false;
        const since = nowM - (rel(a.in, sa) - (a.date === YEST ? 1440 : 0));
        return since >= -60 && since <= 16 * 60;
    }) || null;
}
function Brand() {
    return React.createElement("div", { className: "phonebrand" },
        React.createElement("img", { src: LOGO, alt: "" }),
        React.createElement("span", { className: "wordmark" },
            React.createElement("b", null, "Haazir"),
            React.createElement("small", null,
                React.createElement("span", { className: "eco" }, "eco"),
                " Pharmacy")));
}
function Register({ st, reload }) {
    const [empId, setEmpId] = useState("");
    const [pin, setPin] = useState("");
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const send = async () => {
        setBusy(true);
        setErr("");
        try {
            await api("/api/device/register", { empId, pin, label: phoneLabel() });
            await reload();
        }
        catch (e) {
            setErr(e.message);
        }
        setBusy(false);
    };
    return (React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } },
        React.createElement("div", { className: "hello" },
            React.createElement("h2", null, "Register This Phone"),
            React.createElement("p", null, "Each employee records attendance from one approved phone. Registration requires admin approval.")),
        st.rejected && React.createElement("div", { className: "notice" }, "Your previous request was not approved. Please speak to your admin before trying again."),
        React.createElement("div", { className: "field" },
            React.createElement("label", null, "Employee ID"),
            React.createElement("input", { value: empId, onChange: e => setEmpId(e.target.value), placeholder: "e.g. E004", autoCapitalize: "characters" })),
        React.createElement("div", { className: "field" },
            React.createElement("label", null, "PIN"),
            React.createElement("input", { type: "password", inputMode: "numeric", maxLength: 4, value: pin, onChange: e => setPin(e.target.value.replace(/\D/g, "")) })),
        React.createElement("button", { className: "btn primary block", onClick: send, disabled: busy }, "Send for Approval"),
        err && React.createElement("div", { className: "err" }, err),
        React.createElement("p", { className: "muted", style: { fontSize: 13, margin: 0 } }, "Don't know your PIN? Your admin sets it when adding you under Employees.")));
}
function PinPad({ title, msg, onDone, onCancel, busy, onForgot }) {
    const [pin, setPin] = useState("");
    const press = k => {
        if (busy)
            return;
        if (k === "del")
            return setPin(pin.slice(0, -1));
        const np = (pin + k).slice(0, 4);
        setPin(np);
        if (np.length === 4) {
            onDone(np);
            setPin("");
        }
    };
    return (React.createElement("div", { className: "sheet pop" },
        React.createElement("h3", null, title),
        msg && React.createElement("div", { className: "err", style: { marginTop: 0 } }, msg),
        React.createElement("div", { className: "dots" }, [0, 1, 2, 3].map(i => React.createElement("span", { key: i, className: i < pin.length ? "f" : "" }))),
        React.createElement("div", { className: "pinpad" }, ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) => k === "" ? React.createElement("span", { key: i }) : React.createElement("button", { key: i, onClick: () => press(k), "aria-label": k === "del" ? "Delete" : k }, k === "del" ? "⌫" : k))),
        React.createElement("button", { className: "btn block", onClick: onCancel }, "Cancel"),
        onForgot && React.createElement("button", { className: "linkish", onClick: onForgot }, "Forgot your PIN?")));
}
function ChangePin({ onClose }) {
    const [f, setF] = useState({ current: "", next: "", confirm: "" });
    const [err, setErr] = useState("");
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);
    const digits = v => v.replace(/\D/g, "").slice(0, 4);
    const save = async () => {
        if (f.next.length !== 4)
            return setErr("The new PIN must be 4 digits.");
        if (f.next !== f.confirm)
            return setErr("The new PINs do not match.");
        setBusy(true);
        setErr("");
        try {
            await api("/api/device/pin", { current: f.current, next: f.next });
            setDone(true);
        }
        catch (e) {
            setErr(e.message);
        }
        setBusy(false);
    };
    if (done)
        return React.createElement("div", { className: "sheet ok pop" },
            React.createElement(Check, { size: 28, color: "#00661A" }),
            React.createElement("h3", null, "PIN Changed"),
            React.createElement("p", null, "Use your new PIN from now on."),
            React.createElement("button", { className: "btn block", onClick: onClose }, "Done"));
    return (React.createElement("div", { className: "sheet pop" },
        React.createElement(KeyRound, { size: 30, color: "#0F1561" }),
        React.createElement("h3", null, "Change Your PIN"),
        React.createElement("div", { className: "lateform" },
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Current PIN"),
                React.createElement("input", { type: "password", inputMode: "numeric", maxLength: 4, value: f.current, onChange: e => setF({ ...f, current: digits(e.target.value) }) })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "New PIN (4 digits)"),
                React.createElement("input", { type: "password", inputMode: "numeric", maxLength: 4, value: f.next, onChange: e => setF({ ...f, next: digits(e.target.value) }) })),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Confirm new PIN"),
                React.createElement("input", { type: "password", inputMode: "numeric", maxLength: 4, value: f.confirm, onChange: e => setF({ ...f, confirm: digits(e.target.value) }) })),
            err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err),
            React.createElement("button", { className: "btn primary block", onClick: save, disabled: busy }, "Save New PIN"),
            React.createElement("button", { className: "btn block", onClick: onClose }, "Cancel"))));
}
function ForgotPin({ onClose }) {
    const [state, setState] = useState("ask");
    const [err, setErr] = useState("");
    const send = async () => { setErr(""); try {
        await api("/api/device/pin-forgot", {});
        setState("sent");
    }
    catch (e) {
        setErr(e.message);
    } };
    if (state === "sent")
        return React.createElement("div", { className: "sheet ok pop" },
            React.createElement(Check, { size: 28, color: "#00661A" }),
            React.createElement("h3", null, "Request Sent"),
            React.createElement("p", null,
                "Your admin has been notified and will set a new PIN for you. Ask them for it, then change it to your own PIN using ",
                React.createElement("b", null, "Change PIN"),
                "."),
            React.createElement("button", { className: "btn block", onClick: onClose }, "Done"));
    return (React.createElement("div", { className: "sheet pop" },
        React.createElement(KeyRound, { size: 30, color: "#0F1561" }),
        React.createElement("h3", null, "Forgot Your PIN?"),
        React.createElement("p", null, "For security, only an admin can set a new PIN. Send a request and your admin will be notified."),
        err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err),
        React.createElement("button", { className: "btn primary block", onClick: send }, "Ask Admin for a New PIN"),
        React.createElement("button", { className: "btn block", onClick: onClose }, "Cancel")));
}
function LateForm({ st, onClose, reload }) {
    const emp = st.employee;
    const dates = [];
    for (let i = 0; i <= 7; i++) {
        const ds = addDays(TODAY, -i);
        if (employed(emp, ds) && settingsOn(emp, ds))
            dates.push(ds);
    }
    const recOn = ds => st.attendance.find(a => a.date === ds);
    const init = ds => { const r = recOn(ds); return { date: ds, in: r?.in || "", out: r?.out || "", reason: "" }; };
    const [f, setF] = useState(() => init(dates[0] || TODAY));
    const [err, setErr] = useState("");
    const [sent, setSent] = useState(false);
    const [busy, setBusy] = useState(false);
    const existing = recOn(f.date);
    const s = settingsOn(emp, f.date);
    const send = async () => {
        if (!f.in)
            return setErr("Please enter the check-in time.");
        if (existing?.out)
            return setErr("Both times are already recorded for this date. Please contact your admin for corrections.");
        if (!f.reason.trim())
            return setErr("Please provide a reason.");
        setBusy(true);
        try {
            await api("/api/late/request", f);
            setSent(true);
            reload();
        }
        catch (e) {
            setErr(e.message);
        }
        setBusy(false);
    };
    if (sent)
        return (React.createElement("div", { className: "sheet ok pop" },
            React.createElement(Check, { size: 28, color: "#00661A" }),
            React.createElement("h3", null, "Request Submitted"),
            React.createElement("p", null, "It will be added to your attendance once an admin approves it."),
            React.createElement("button", { className: "btn block", onClick: onClose }, "Done")));
    return (React.createElement("div", { className: "sheet pop" },
        React.createElement("h3", null, "Request Late Entry"),
        React.createElement("p", null, "For shifts that could not be recorded because of a power or internet outage. Subject to admin approval."),
        React.createElement("div", { className: "lateform" },
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Shift date"),
                React.createElement("select", { value: f.date, onChange: e => { setErr(""); setF(init(e.target.value)); } }, dates.map(ds => React.createElement("option", { key: ds, value: ds }, niceDate(ds))))),
            s && overnight(s) && React.createElement("div", { className: "notice" }, "For night shifts, select the date the shift began."),
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "field", style: { flex: 1 } },
                    React.createElement("label", null, "Check-in time"),
                    React.createElement("input", { type: "time", value: f.in, disabled: !!existing, onChange: e => setF({ ...f, in: e.target.value }) })),
                React.createElement("div", { className: "field", style: { flex: 1 } },
                    React.createElement("label", null, "Check-out time"),
                    React.createElement("input", { type: "time", value: f.out, disabled: !!existing?.out, onChange: e => setF({ ...f, out: e.target.value }) }))),
            existing && !existing.out && React.createElement("p", { className: "muted", style: { margin: 0, fontSize: 13 } }, "Your check-in is already recorded. Please add the check-out time."),
            React.createElement("div", { className: "field" },
                React.createElement("label", null, "Reason"),
                React.createElement("input", { value: f.reason, placeholder: "e.g. Power and internet outage", onChange: e => setF({ ...f, reason: e.target.value }) })),
            err && React.createElement("div", { className: "err", style: { marginTop: 0 } }, err),
            React.createElement("button", { className: "btn primary block", onClick: send, disabled: busy }, "Submit Request"),
            React.createElement("button", { className: "btn block", onClick: onClose }, "Cancel"))));
}
function Home({ st, reload }) {
    const emp = st.employee;
    const [step, setStep] = useState(null);
    const [msg, setMsg] = useState("");
    const [done, setDone] = useState(null);
    const [busy, setBusy] = useState(false);
    const [code, setCode] = useState("");
    const [bioState, setBioState] = useState(null);
    const nowM = toMin(st.now);
    const open = openRecordClient(emp, st.attendance, nowM);
    const shiftDate = open ? open.date : pickShiftDate(emp, nowM);
    const s = settingsOn(emp, shiftDate);
    const rec = open || st.attendance.find(a => a.date === shiftDate);
    const action = !rec ? "in" : !rec.out ? "out" : null;
    const isOff = s && s.off.includes(weekday(shiftDate));
    const recent = st.attendance.filter(a => a.date < TODAY && a.id !== rec?.id).slice(-4).reverse();
    // Check-in flow: location (pharmacy Wi-Fi or counter code), then fingerprint and/or PIN.
    const start = async () => {
        setMsg("");
        setDone(null);
        setCode("");
        setBioState(null);
        const fresh = await reload();
        if (fresh && !fresh.atShop) {
            setStep("code");
            return;
        }
        verify("");
    };
    const verify = async (c) => {
        setMsg("");
        if (!inAndroidApp()) {
            setStep("pin");
            return;
        }
        setStep("bio");
        const [status] = await askApp({ type: "bio", reason: action === "out" ? "Confirm your check-out" : "Confirm your check-in" }, "hzAppBio");
        if (status === "ok") {
            setBioState("ok");
            if (st.mode === "either")
                return submit({ bio: true, code: c });
            setStep("pin");
            return;
        }
        if (status === "unavailable") {
            setBioState("unavailable");
            setStep("pin");
            return;
        }
        if (status === "cancelled") {
            setStep(null);
            return;
        }
        if (st.mode === "either") {
            setMsg("Fingerprint not recognised. Please enter your PIN instead.");
            setStep("pin");
            return;
        }
        setStep(null);
        setMsg("Fingerprint not recognised. Please try again.");
    };
    const submit = async (body) => {
        setBusy(true);
        try {
            const r = await api("/api/punch", { code, ...body });
            setStep(null);
            setDone(r);
            await reload();
        }
        catch (e) {
            setMsg(e.message);
            if (e.status === 403)
                setStep(null);
        }
        setBusy(false);
    };
    // The Android app's Back button closes an open form first.
    useEffect(() => {
        window.hzBack = () => { if (step && step !== "bio") {
            setStep(null);
            setMsg("");
            return true;
        } if (done || msg) {
            setDone(null);
            setMsg("");
            return true;
        } return false; };
        return () => { delete window.hzBack; };
    }, [step, done, msg]);
    const submitPin = pin => submit({ pin, code, bio: bioState === "ok", bioUnavailable: bioState === "unavailable" });
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "hello" },
            React.createElement("h2", null,
                "Assalam-o-Alaikum, ",
                emp.name.split(" ")[0]),
            React.createElement("p", null,
                "Employee ID ",
                emp.id),
            React.createElement("p", null, !s ? "Employment has not started yet" : isOff ? "Day off today" : `${shiftDate === YEST ? "Last night's shift" : "Today's shift"} ${shiftText(s)}`)),
        step === "code" && (React.createElement("div", { className: "sheet pop" },
            React.createElement(QrCode, { size: 34, color: "#0F1561" }),
            React.createElement("h3", null, "Enter Counter Code"),
            React.createElement("p", null, "You are not connected to the pharmacy Wi-Fi. Enter the 6-digit code shown on the phone at the pharmacy counter."),
            React.createElement("input", { className: "codein", inputMode: "numeric", autoComplete: "one-time-code", maxLength: 6, value: code, onChange: e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6)), "aria-label": "Counter code" }),
            msg && React.createElement("div", { className: "err", style: { marginTop: 0 } }, msg),
            React.createElement("button", { className: "btn primary block", disabled: code.length !== 6, onClick: () => { setCode(code); verify(code); } }, "Continue"),
            React.createElement("button", { className: "btn block", onClick: () => { setStep(null); setMsg(""); } }, "Cancel"))),
        step === "bio" && (React.createElement("div", { className: "sheet pop" },
            React.createElement(Fingerprint, { size: 56, color: "#007A1F" }),
            React.createElement("h3", null, "Verify Your Identity"),
            React.createElement("p", null, "Use your fingerprint or face unlock to continue."))),
        step === "pin" && React.createElement(PinPad, { title: "Enter Your PIN", msg: msg, busy: busy, onDone: submitPin, onCancel: () => { setStep(null); setMsg(""); }, onForgot: () => { setMsg(""); setStep("forgot"); } }),
        step === "changepin" && React.createElement(ChangePin, { onClose: () => setStep(null) }),
        step === "forgot" && React.createElement(ForgotPin, { onClose: () => setStep(null) }),
        step === "late" && React.createElement(LateForm, { st: st, reload: reload, onClose: () => setStep(null) }),
        !step && (React.createElement(React.Fragment, null,
            done && (React.createElement("div", { className: "sheet ok pop" },
                React.createElement(Check, { size: 28, color: "#00661A" }),
                React.createElement("h3", null, done.action === "in" ? "Check-In Recorded" : "Check-Out Recorded"),
                React.createElement("p", null, fmt(done.time)))),
            msg && React.createElement("div", { className: "notice" },
                React.createElement(Wifi, { size: 16 }),
                msg),
            action ? (React.createElement("button", { className: "punch" + (action === "out" ? " out" : ""), onClick: start },
                React.createElement("span", { className: "cross" }),
                action === "in" ? "Check In" : "Check Out")) : !done && React.createElement("div", { className: "sheet ok" },
                React.createElement("h3", null, "Shift Complete"),
                React.createElement("p", null,
                    "Check-in ",
                    fmt(rec.in),
                    ", check-out ",
                    fmt(rec.out))),
            rec && action === "out" && !done && React.createElement("p", { className: "muted", style: { textAlign: "center", margin: 0 } },
                "Checked in at ",
                fmt(rec.in),
                rec.date === YEST ? " last night" : ""),
            recent.length > 0 && React.createElement("div", null,
                React.createElement("span", { className: "lbl" }, "Recent attendance"),
                React.createElement("table", { className: "mini" },
                    React.createElement("tbody", null, recent.map(a => React.createElement("tr", { key: a.id },
                        React.createElement("td", null, niceDate(a.date)),
                        React.createElement("td", { className: "num" },
                            fmt(a.in),
                            " \u2013 ",
                            a.out ? fmt(a.out) : "…")))))),
            st.lateReqs.length > 0 && React.createElement("div", null,
                React.createElement("span", { className: "lbl" }, "Late entry requests"),
                React.createElement("table", { className: "mini" },
                    React.createElement("tbody", null, st.lateReqs.slice(0, 3).map(r => React.createElement("tr", { key: r.id },
                        React.createElement("td", null, niceDate(r.date)),
                        React.createElement("td", { className: "num" },
                            r.in ? fmt(r.in) : "—",
                            " \u2013 ",
                            r.out ? fmt(r.out) : "—"),
                        React.createElement("td", { style: { textAlign: "right" } },
                            React.createElement("span", { className: "tag" + (r.status === "pending" ? " amber" : r.status === "rejected" ? " red" : "") }, r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Rejected"))))))),
            React.createElement("div", { className: "row", style: { justifyContent: "center" } },
                React.createElement("button", { className: "btn small", onClick: () => { setDone(null); setMsg(""); setStep("changepin"); } },
                    React.createElement(KeyRound, { size: 14 }),
                    " Change PIN"),
                React.createElement("button", { className: "btn small", onClick: () => { setDone(null); setMsg(""); setStep("forgot"); } }, "Forgot PIN?")),
            React.createElement("button", { className: "latebanner", onClick: () => { setDone(null); setMsg(""); setStep("late"); } },
                React.createElement("span", { className: "ic" },
                    React.createElement(Clock, { size: 20 })),
                React.createElement("span", { className: "txt" },
                    React.createElement("b", null,
                        "Missed ",
                        React.createElement("span", { className: "nb" }, "Check-In"),
                        " or ",
                        React.createElement("span", { className: "nb" }, "Check-Out?")),
                    React.createElement("small", null, "Request Late Entry")),
                React.createElement("span", { className: "go" },
                    React.createElement(ChevronRight, { size: 16 })))))));
}
function EmployeeApp() {
    const [st, setSt] = useState(null);
    const [err, setErr] = useState("");
    const reload = async () => {
        try {
            const data = await api("/api/device/status");
            setClock(data.today);
            setSt(data);
            setErr("");
            return data;
        }
        catch (e) {
            setErr(e.message);
            return null;
        }
    };
    useEffect(() => {
        reload();
        const onVis = () => { if (document.visibilityState === "visible")
            reload(); };
        document.addEventListener("visibilitychange", onVis);
        const t = setInterval(onVis, 30000);
        return () => { document.removeEventListener("visibilitychange", onVis); clearInterval(t); };
    }, []);
    const NetIcon = st?.atShop ? Wifi : Signal;
    const serverVersion = useServerVersion();
    return (React.createElement("div", { className: "pa applayout" },
        React.createElement("style", null, CSS),
        React.createElement("div", { className: "appscreen" },
            React.createElement("div", { className: "status" },
                React.createElement("span", null, st ? fmt(st.now) : ""),
                st && React.createElement("span", null,
                    React.createElement(NetIcon, { size: 14 }),
                    " ",
                    st.atShop ? "Pharmacy Wi-Fi" : "Not on pharmacy Wi-Fi")),
            React.createElement(Brand, null),
            serverVersion && serverVersion !== APP_VERSION && React.createElement("div", { className: "updbar", style: { marginBottom: 0 } },
                React.createElement(RefreshCw, { size: 18 }),
                React.createElement("span", null, "Haazir has been updated."),
                React.createElement("button", { className: "btn small primary", onClick: () => location.reload() }, "Reload")),
            !st && !err && React.createElement("p", { className: "muted" }, "Loading\u2026"),
            err && !st && React.createElement("div", { className: "sheet" },
                React.createElement("h3", null, "Unable to Connect"),
                React.createElement("p", null, err),
                React.createElement("button", { className: "btn block", onClick: reload }, "Try Again")),
            st && st.status === "unregistered" && React.createElement(Register, { st: st, reload: reload }),
            st && st.status === "pending" && (React.createElement("div", { className: "sheet pop", style: { marginTop: 30 } },
                React.createElement(Smartphone, { size: 40 }),
                React.createElement("h3", null, "Awaiting Approval"),
                React.createElement("p", null,
                    "This phone has been registered for ",
                    st.name,
                    " (",
                    st.empId,
                    "). Attendance can be recorded once an admin approves it."),
                st.change && React.createElement("div", { className: "notice" }, "This ID is currently linked to another phone. Once approved, the previous phone will be deactivated."),
                React.createElement("button", { className: "btn block", onClick: reload }, "Check Again"))),
            st && st.status === "ended" && React.createElement("div", { className: "sheet pop", style: { marginTop: 30 } },
                React.createElement("h3", null, "Access Ended"),
                React.createElement("p", null,
                    st.name,
                    "'s last working day was ",
                    longDate(st.left),
                    ". Attendance can no longer be recorded from this phone.")),
            st && st.status === "approved" && React.createElement(Home, { st: st, reload: reload }),
            React.createElement(Copyright, null))));
}
ReactDOM.createRoot(document.getElementById("root")).render(React.createElement(EmployeeApp, null));
