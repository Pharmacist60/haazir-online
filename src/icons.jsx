/* Icons from Lucide (ISC License), https://lucide.dev */
const ICON_TREES = {
  Clock: [{"tag":"circle","attr":{"cx":"12","cy":"12","r":"10"},"child":[]},{"tag":"polyline","attr":{"points":"12 6 12 12 16 14"},"child":[]}],
  Fingerprint: [{"tag":"path","attr":{"d":"M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"},"child":[]},{"tag":"path","attr":{"d":"M14 13.12c0 2.38 0 6.38-1 8.88"},"child":[]},{"tag":"path","attr":{"d":"M17.29 21.02c.12-.6.43-2.3.5-3.02"},"child":[]},{"tag":"path","attr":{"d":"M2 12a10 10 0 0 1 18-6"},"child":[]},{"tag":"path","attr":{"d":"M2 16h.01"},"child":[]},{"tag":"path","attr":{"d":"M21.8 16c.2-2 .131-5.354 0-6"},"child":[]},{"tag":"path","attr":{"d":"M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"},"child":[]},{"tag":"path","attr":{"d":"M8.65 22c.21-.66.45-1.32.57-2"},"child":[]},{"tag":"path","attr":{"d":"M9 6.8a6 6 0 0 1 9 5.2v2"},"child":[]}],
  Wifi: [{"tag":"path","attr":{"d":"M12 20h.01"},"child":[]},{"tag":"path","attr":{"d":"M2 8.82a15 15 0 0 1 20 0"},"child":[]},{"tag":"path","attr":{"d":"M5 12.859a10 10 0 0 1 14 0"},"child":[]},{"tag":"path","attr":{"d":"M8.5 16.429a5 5 0 0 1 7 0"},"child":[]}],
  WifiOff: [{"tag":"path","attr":{"d":"M12 20h.01"},"child":[]},{"tag":"path","attr":{"d":"M8.5 16.429a5 5 0 0 1 7 0"},"child":[]},{"tag":"path","attr":{"d":"M5 12.859a10 10 0 0 1 5.17-2.69"},"child":[]},{"tag":"path","attr":{"d":"M19 12.859a10 10 0 0 0-2.007-1.523"},"child":[]},{"tag":"path","attr":{"d":"M2 8.82a15 15 0 0 1 4.177-2.643"},"child":[]},{"tag":"path","attr":{"d":"M22 8.82a15 15 0 0 0-11.288-3.764"},"child":[]},{"tag":"path","attr":{"d":"m2 2 20 20"},"child":[]}],
  Signal: [{"tag":"path","attr":{"d":"M2 20h.01"},"child":[]},{"tag":"path","attr":{"d":"M7 20v-4"},"child":[]},{"tag":"path","attr":{"d":"M12 20v-8"},"child":[]},{"tag":"path","attr":{"d":"M17 20V8"},"child":[]},{"tag":"path","attr":{"d":"M22 4v16"},"child":[]}],
  Smartphone: [{"tag":"rect","attr":{"width":"14","height":"20","x":"5","y":"2","rx":"2","ry":"2"},"child":[]},{"tag":"path","attr":{"d":"M12 18h.01"},"child":[]}],
  ShieldCheck: [{"tag":"path","attr":{"d":"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"},"child":[]},{"tag":"path","attr":{"d":"m9 12 2 2 4-4"},"child":[]}],
  Users: [{"tag":"path","attr":{"d":"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"},"child":[]},{"tag":"circle","attr":{"cx":"9","cy":"7","r":"4"},"child":[]},{"tag":"path","attr":{"d":"M22 21v-2a4 4 0 0 0-3-3.87"},"child":[]},{"tag":"path","attr":{"d":"M16 3.13a4 4 0 0 1 0 7.75"},"child":[]}],
  Wallet: [{"tag":"path","attr":{"d":"M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"},"child":[]},{"tag":"path","attr":{"d":"M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"},"child":[]}],
  Network: [{"tag":"rect","attr":{"x":"16","y":"16","width":"6","height":"6","rx":"1"},"child":[]},{"tag":"rect","attr":{"x":"2","y":"16","width":"6","height":"6","rx":"1"},"child":[]},{"tag":"rect","attr":{"x":"9","y":"2","width":"6","height":"6","rx":"1"},"child":[]},{"tag":"path","attr":{"d":"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"},"child":[]},{"tag":"path","attr":{"d":"M12 12V8"},"child":[]}],
  ScrollText: [{"tag":"path","attr":{"d":"M15 12h-5"},"child":[]},{"tag":"path","attr":{"d":"M15 8h-5"},"child":[]},{"tag":"path","attr":{"d":"M19 17V5a2 2 0 0 0-2-2H4"},"child":[]},{"tag":"path","attr":{"d":"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"},"child":[]}],
  Check: [{"tag":"path","attr":{"d":"M20 6 9 17l-5-5"},"child":[]}],
  Timer: [{"tag":"line","attr":{"x1":"10","x2":"14","y1":"2","y2":"2"},"child":[]},{"tag":"line","attr":{"x1":"12","x2":"15","y1":"14","y2":"11"},"child":[]},{"tag":"circle","attr":{"cx":"12","cy":"14","r":"8"},"child":[]}],
  CalendarDays: [{"tag":"path","attr":{"d":"M8 2v4"},"child":[]},{"tag":"path","attr":{"d":"M16 2v4"},"child":[]},{"tag":"rect","attr":{"width":"18","height":"18","x":"3","y":"4","rx":"2"},"child":[]},{"tag":"path","attr":{"d":"M3 10h18"},"child":[]},{"tag":"path","attr":{"d":"M8 14h.01"},"child":[]},{"tag":"path","attr":{"d":"M12 14h.01"},"child":[]},{"tag":"path","attr":{"d":"M16 14h.01"},"child":[]},{"tag":"path","attr":{"d":"M8 18h.01"},"child":[]},{"tag":"path","attr":{"d":"M12 18h.01"},"child":[]},{"tag":"path","attr":{"d":"M16 18h.01"},"child":[]}],
  CloudOff: [{"tag":"path","attr":{"d":"m2 2 20 20"},"child":[]},{"tag":"path","attr":{"d":"M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193"},"child":[]},{"tag":"path","attr":{"d":"M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07"},"child":[]}],
  QrCode: [{"tag":"rect","attr":{"width":"5","height":"5","x":"3","y":"3","rx":"1"},"child":[]},{"tag":"rect","attr":{"width":"5","height":"5","x":"16","y":"3","rx":"1"},"child":[]},{"tag":"rect","attr":{"width":"5","height":"5","x":"3","y":"16","rx":"1"},"child":[]},{"tag":"path","attr":{"d":"M21 16h-3a2 2 0 0 0-2 2v3"},"child":[]},{"tag":"path","attr":{"d":"M21 21v.01"},"child":[]},{"tag":"path","attr":{"d":"M12 7v3a2 2 0 0 1-2 2H7"},"child":[]},{"tag":"path","attr":{"d":"M3 12h.01"},"child":[]},{"tag":"path","attr":{"d":"M12 3h.01"},"child":[]},{"tag":"path","attr":{"d":"M12 16v.01"},"child":[]},{"tag":"path","attr":{"d":"M16 12h1"},"child":[]},{"tag":"path","attr":{"d":"M21 12v.01"},"child":[]},{"tag":"path","attr":{"d":"M12 21v-1"},"child":[]}],
  History: [{"tag":"path","attr":{"d":"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"},"child":[]},{"tag":"path","attr":{"d":"M3 3v5h5"},"child":[]},{"tag":"path","attr":{"d":"M12 7v5l4 2"},"child":[]}],
  ChevronRight: [{"tag":"path","attr":{"d":"m9 18 6-6-6-6"},"child":[]}],
  Hourglass: [{"tag":"path","attr":{"d":"M5 22h14"},"child":[]},{"tag":"path","attr":{"d":"M5 2h14"},"child":[]},{"tag":"path","attr":{"d":"M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"},"child":[]},{"tag":"path","attr":{"d":"M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"},"child":[]}],
  LogOut: [{"tag":"path","attr":{"d":"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"},"child":[]},{"tag":"polyline","attr":{"points":"16 17 21 12 16 7"},"child":[]},{"tag":"line","attr":{"x1":"21","x2":"9","y1":"12","y2":"12"},"child":[]}],
  KeyRound: [{"tag":"path","attr":{"d":"M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"},"child":[]},{"tag":"circle","attr":{"cx":"16.5","cy":"7.5","r":".5","fill":"currentColor"},"child":[]}],
  Download: [{"tag":"path","attr":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},"child":[]},{"tag":"polyline","attr":{"points":"7 10 12 15 17 10"},"child":[]},{"tag":"line","attr":{"x1":"12","x2":"12","y1":"15","y2":"3"},"child":[]}],
  Bell: [{"tag":"path","attr":{"d":"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"},"child":[]},{"tag":"path","attr":{"d":"M10.3 21a1.94 1.94 0 0 0 3.4 0"},"child":[]}],
  X: [{"tag":"path","attr":{"d":"M18 6 6 18"},"child":[]},{"tag":"path","attr":{"d":"m6 6 12 12"},"child":[]}],
  RefreshCw: [{"tag":"path","attr":{"d":"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"},"child":[]},{"tag":"path","attr":{"d":"M21 3v5h-5"},"child":[]},{"tag":"path","attr":{"d":"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"},"child":[]},{"tag":"path","attr":{"d":"M8 16H3v5"},"child":[]}],
  DatabaseBackup: [{"tag":"ellipse","attr":{"cx":"12","cy":"5","rx":"9","ry":"3"},"child":[]},{"tag":"path","attr":{"d":"M3 12a9 3 0 0 0 5 2.69"},"child":[]},{"tag":"path","attr":{"d":"M21 9.3V5"},"child":[]},{"tag":"path","attr":{"d":"M3 5v14a9 3 0 0 0 6.47 2.88"},"child":[]},{"tag":"path","attr":{"d":"M12 12v4h4"},"child":[]},{"tag":"path","attr":{"d":"M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16"},"child":[]}],
  Upload: [{"tag":"path","attr":{"d":"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"},"child":[]},{"tag":"polyline","attr":{"points":"17 8 12 3 7 8"},"child":[]},{"tag":"line","attr":{"x1":"12","x2":"12","y1":"3","y2":"15"},"child":[]}],
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
