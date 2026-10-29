"use strict";
/* Haazir counter display (eco Pharmacy). Shows a 6-digit code that changes every 30 seconds.
   After it is set up once by a super admin, it works without internet. */

// --- SHA-1 and HMAC (plain JavaScript, so it works on any phone browser) ---
function sha1(bytes) {
  const ml = bytes.length, withPad = ((ml + 9 + 63) >> 6) << 6, m = new Uint8Array(withPad);
  m.set(bytes); m[ml] = 0x80;
  const bits = ml * 8, dv = new DataView(m.buffer);
  dv.setUint32(withPad - 4, bits >>> 0); dv.setUint32(withPad - 8, Math.floor(bits / 4294967296));
  let h0 = 0x67452301, h1 = 0xefcdab89, h2 = 0x98badcfe, h3 = 0x10325476, h4 = 0xc3d2e1f0;
  const w = new Uint32Array(80), rotl = (x, n) => (x << n) | (x >>> (32 - n));
  for (let i = 0; i < withPad; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4);
    for (let t = 16; t < 80; t++) w[t] = rotl(w[t - 3] ^ w[t - 8] ^ w[t - 14] ^ w[t - 16], 1);
    let a = h0, b = h1, c = h2, d = h3, e = h4;
    for (let t = 0; t < 80; t++) {
      const f = t < 20 ? (b & c) | (~b & d) : t < 40 ? b ^ c ^ d : t < 60 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d;
      const k = t < 20 ? 0x5a827999 : t < 40 ? 0x6ed9eba1 : t < 60 ? 0x8f1bbcdc : 0xca62c1d6;
      const tmp = (rotl(a, 5) + f + e + k + w[t]) >>> 0;
      e = d; d = c; c = rotl(b, 30) >>> 0; b = a; a = tmp;
    }
    h0 = (h0 + a) >>> 0; h1 = (h1 + b) >>> 0; h2 = (h2 + c) >>> 0; h3 = (h3 + d) >>> 0; h4 = (h4 + e) >>> 0;
  }
  const out = new Uint8Array(20), ov = new DataView(out.buffer);
  [h0, h1, h2, h3, h4].forEach((h, i) => ov.setUint32(i * 4, h));
  return out;
}
function hmacSha1(key, msg) {
  if (key.length > 64) key = sha1(key);
  const k = new Uint8Array(64); k.set(key);
  const ipad = k.map(x => x ^ 0x36), opad = k.map(x => x ^ 0x5c);
  const inner = new Uint8Array(64 + msg.length); inner.set(ipad); inner.set(msg, 64);
  const outer = new Uint8Array(84); outer.set(opad); outer.set(sha1(inner), 64);
  return sha1(outer);
}
function hexToBytes(hex) { const b = new Uint8Array(hex.length / 2); for (let i = 0; i < b.length; i++) b[i] = parseInt(hex.substr(i * 2, 2), 16); return b; }
function codeFor(slot, secretHex) {
  const msg = new Uint8Array(8), dv = new DataView(msg.buffer);
  dv.setUint32(0, Math.floor(slot / 4294967296)); dv.setUint32(4, slot >>> 0);
  const h = hmacSha1(hexToBytes(secretHex), msg), o = h[19] & 15;
  const n = (((h[o] & 0x7f) << 24) | (h[o + 1] << 16) | (h[o + 2] << 8) | h[o + 3]) >>> 0;
  return String(n % 1000000).padStart(6, "0");
}
if (typeof module !== "undefined") module.exports = { codeFor };

// --- the display ---
if (typeof document !== "undefined") {
  const $ = id => document.getElementById(id);
  const show = id => { for (const s of ["setup", "display", "msg"]) $(s).hidden = s !== id; };
  const now = () => Date.now() + Number(localStorage.getItem("hz_counter_offset") || 0);
  const API = (window.HAAZIR_API || "").replace(/\/$/, "");
  const auth = () => { const t = localStorage.getItem("hz_token"); return t ? { Authorization: "Bearer " + t } : {}; };

  async function getSecret() {
    const r = await fetch(API + "/api/counter/secret", { headers: auth(), cache: "no-store" });
    if (r.status === 401) return "login";
    if (r.status === 403) return "notsuper";
    if (!r.ok) throw new Error("Could not reach Haazir.");
    const d = await r.json();
    localStorage.setItem("hz_counter_secret", d.secret);
    localStorage.setItem("hz_counter_offset", String(d.serverTime - Date.now()));
    return "ok";
  }
  function tick() {
    const secret = localStorage.getItem("hz_counter_secret"); if (!secret) return;
    const t = now(), slot = Math.floor(t / 30000), left = 30 - Math.floor((t / 1000) % 30);
    const code = codeFor(slot, secret);
    $("code").textContent = code.slice(0, 3) + " " + code.slice(3);
    $("left").textContent = `Changes in ${left} second${left === 1 ? "" : "s"}`;
    $("bar").style.width = (left / 30 * 100) + "%";
  }
  async function start() {
    if (localStorage.getItem("hz_counter_secret")) {
      show("display"); tick(); setInterval(tick, 1000);
      getSecret().catch(() => {}); // refresh the clock correction when online
      try { if (navigator.wakeLock) await navigator.wakeLock.request("screen"); } catch { /* not available */ }
      return;
    }
    try {
      const r = await getSecret();
      if (r === "ok") return start();
      if (r === "notsuper") { $("msgtext").textContent = "Only a super admin can set up the counter display. Sign out of Haazir in this browser and sign in as a super admin."; show("msg"); return; }
      show("setup");
    } catch { $("msgtext").textContent = "Could not reach Haazir. Check the internet connection and reload the page."; show("msg"); }
  }
  $("loginform").addEventListener("submit", async e => {
    e.preventDefault(); $("err").textContent = "";
    try {
      const r = await fetch(API + "/api/login", { method: "POST", headers: { "Content-Type": "application/json", "X-Haazir": "1" }, body: JSON.stringify({ username: $("u").value, password: $("p").value }) });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { $("err").textContent = d.error || "Sign-in failed."; return; }
      localStorage.setItem("hz_token", d.token);
      const s = await getSecret();
      if (s === "notsuper") { $("err").textContent = "Only a super admin can set up the counter display."; return; }
      start();
    } catch { $("err").textContent = "Could not reach Haazir."; }
  });
  $("reset").addEventListener("click", () => {
    if (!confirm("Set up this counter display again? You will need to sign in as a super admin.")) return;
    localStorage.removeItem("hz_counter_secret"); localStorage.removeItem("hz_counter_offset"); location.reload();
  });
  $("yr").textContent = new Date().getFullYear();
  start();
}
