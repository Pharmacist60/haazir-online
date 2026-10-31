// Developer tool: turns src/*.jsx into the browser files in web/. Needs the TypeScript compiler (only to convert JSX).
const fs = require('fs'), path = require('path');
const ts = require(process.env.TS_PATH || 'typescript');
const src = f => fs.readFileSync(path.join(__dirname, '../src', f), 'utf8');
const version = (fs.readFileSync(path.join(__dirname, '../supabase/functions/haazir/api.js'), 'utf8').match(/VERSION = '([^']+)'/) || [])[1];
function build(entry, out) {
  const code = `const APP_VERSION = ${JSON.stringify(version)};\n` + src('icons.jsx') + '\n' + src('shared.jsx') + '\n' + src(entry);
  const r = ts.transpileModule(code, { reportDiagnostics: true, fileName: entry, compilerOptions: { jsx: ts.JsxEmit.React, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext } });
  if (r.diagnostics.length) { for (const d of r.diagnostics) console.error(entry, d.messageText); process.exit(1); }
  fs.writeFileSync(path.join(__dirname, '../web', out), '"use strict";\n' + r.outputText);
  console.log('built', out, (r.outputText.length / 1024).toFixed(0) + ' KB', 'version', version);
}
build('admin.jsx', 'admin/admin.js');
build('app.jsx', 'app/app.js');
// The employee app's offline copy (service worker), named after the version.
fs.writeFileSync(path.join(__dirname, '../web/app/sw.js'), fs.readFileSync(path.join(__dirname, '../src/app-sw.js'), 'utf8').replace(/__VERSION__/g, version));
// Add ?v=<version> to the script addresses so browsers download the new files after every update.
for (const page of ['admin/index.html', 'app/index.html']) {
  const f = path.join(__dirname, '../web', page);
  const html = fs.readFileSync(f, 'utf8').replace(/(src="[^"?]+\.js)(\?v=[^"]*)?"/g, `$1?v=${version}"`);
  fs.writeFileSync(f, html);
}
