// Developer tool: bundles React + ReactDOM (production builds) into one browser file.
// Not needed to run Haazir. Requires react and react-dom installed where Node can find them.
const fs = require('fs'), path = require('path');
const G = process.env.NODE_MODULES || path.join(require('os').homedir(), '.npm-global/lib/node_modules');
const alias = {
  'react': G + '/react/cjs/react.production.js',
  'react-dom': G + '/react-dom/cjs/react-dom.production.js',
  'react-dom/client': G + '/react-dom/cjs/react-dom-client.production.js',
  'scheduler': G + '/react-dom/node_modules/scheduler/cjs/scheduler.production.js',
};
const mods = {}; let n = 0; const ids = {};
function add(file) {
  if (ids[file] !== undefined) return ids[file];
  const id = n++; ids[file] = id;
  let src = fs.readFileSync(file, 'utf8');
  src = src.replace(/require\((['"])([^'"]+)\1\)/g, (m, q, name) => {
    const target = alias[name] || require.resolve(path.resolve(path.dirname(file), name));
    return `__req(${add(target)})`;
  });
  mods[id] = src; return id;
}
const reactId = add(alias['react']); const clientId = add(alias['react-dom/client']);
let out = `/* React ${require(G + '/react/package.json').version} production bundle, MIT License, (c) Meta Platforms, Inc. */\n(function(){var process={env:{NODE_ENV:"production"}};var __m={},__c={};function __req(i){if(__c[i])return __c[i].exports;var module=__c[i]={exports:{}};__m[i](module,module.exports);return module.exports;}\n`;
for (const id in mods) out += `__m[${id}]=function(module,exports){${mods[id]}\n};\n`;
out += `window.React=__req(${reactId});window.ReactDOM=__req(${clientId});})();\n`;
fs.writeFileSync(path.join(__dirname, '../public/vendor/react.js'), out);
console.log('vendor/react.js', (out.length / 1024).toFixed(0) + ' KB');
