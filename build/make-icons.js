// Developer tool: extracts the few Lucide icons Haazir uses (ISC License) into src/icons.jsx.
const fs = require('fs'), path = require('path');
const G = process.env.NODE_MODULES;
const src = fs.readFileSync(G + '/react-icons/lu/index.js', 'utf8');
const names = ['Clock','Fingerprint','Wifi','WifiOff','Signal','Smartphone','ShieldCheck','Users','Wallet','Network','ScrollText','Check','Timer','CalendarDays','CloudOff','QrCode','History','ChevronRight','Hourglass','LogOut','KeyRound','Download','Bell','X','RefreshCw','DatabaseBackup','Upload'];
let out = '/* Icons from Lucide (ISC License), https://lucide.dev */\nconst ICON_TREES = {\n';
for (const n of names) {
  const m = src.match(new RegExp('function Lu' + n + ' \\(props\\) \\{\\s*return GenIcon\\((\\{[\\s\\S]*?\\})\\)\\(props\\);'));
  if (!m) throw new Error('missing ' + n);
  out += `  ${n}: ${JSON.stringify(JSON.parse(m[1]).child)},\n`;
}
out += `};
function renderIconNode(n, i) { return React.createElement(n.tag, { key: i, ...n.attr }, (n.child || []).map(renderIconNode)); }
function makeIcon(name) {
  return function Icon({ size = 20, color = "currentColor", style }) {
    return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, ...style }, "aria-hidden": "true" }, ICON_TREES[name].map(renderIconNode));
  };
}
${names.map(n => `const ${n} = makeIcon("${n}");`).join('\n')}
`;
fs.writeFileSync(path.join(__dirname, '../src/icons.jsx'), out);
console.log('ok', names.length);
