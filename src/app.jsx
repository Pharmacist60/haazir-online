/* ---------- employee app ---------- */
// Each phone gets a random secret the first time it opens Haazir. The server only keeps its fingerprint.
(function initDevice() {
  let t = localStorage.getItem("hz_device");
  if (!t) {
    const b = new Uint8Array(32); crypto.getRandomValues(b);
    t = Array.from(b, x => x.toString(16).padStart(2, "0")).join("");
    localStorage.setItem("hz_device", t);
  }
  window.HZ_DEVICE = t;
})();

function phoneLabel() {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return "iPhone";
  if (/iPad/.test(ua)) return "iPad";
  if (/Android/.test(ua)) { const m = ua.match(/Android[^;]*;\s*([^;)]+?)(\s+Build|\))/); return m && m[1] && !/^wv$|^K$/.test(m[1]) ? m[1].trim() : "Android phone"; }
  return "Browser";
}

function openRecordClient(emp, records, nowM) {
  return records.find(a => {
    if (a.out || (a.date !== TODAY && a.date !== YEST)) return false;
    const sa = settingsOn(emp, a.date); if (!sa) return false;
    const since = nowM - (rel(a.in, sa) - (a.date === YEST ? 1440 : 0));
    return since >= -60 && since <= 16 * 60;
  }) || null;
}

function Brand() {
  return <div className="phonebrand"><img src={LOGO} alt="" /><span className="wordmark"><b>Haazir</b><small><span className="eco">eco</span> Pharmacy</small></span></div>;
}

function Register({ st, reload }) {
  const [empId, setEmpId] = useState(""); const [pin, setPin] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const send = async () => {
    setBusy(true); setErr("");
    try { await api("/api/device/register", { empId, pin, label: phoneLabel() }); await reload(); }
    catch (e) { setErr(e.message); }
    setBusy(false);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="hello"><h2>Register This Phone</h2><p>Each employee records attendance from one approved phone. Registration requires admin approval.</p></div>
      {st.rejected && <div className="notice">Your previous request was not approved. Please speak to your admin before trying again.</div>}
      <div className="field"><label>Employee ID</label><input value={empId} onChange={e => setEmpId(e.target.value)} placeholder="e.g. E004" autoCapitalize="characters" /></div>
      <div className="field"><label>PIN</label><input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, ""))} /></div>
      <button className="btn primary block" onClick={send} disabled={busy}>Send for Approval</button>
      {err && <div className="err">{err}</div>}
      <p className="muted" style={{ fontSize: 13, margin: 0 }}>Don't know your PIN? Your admin sets it when adding you under Employees.</p>
    </div>
  );
}

function PinPad({ title, msg, onDone, onCancel, busy, onForgot }) {
  const [pin, setPin] = useState("");
  const press = k => {
    if (busy) return;
    if (k === "del") return setPin(pin.slice(0, -1));
    const np = (pin + k).slice(0, 4); setPin(np);
    if (np.length === 4) { onDone(np); setPin(""); }
  };
  return (
    <div className="sheet pop">
      <h3>{title}</h3>
      {msg && <div className="err" style={{ marginTop: 0 }}>{msg}</div>}
      <div className="dots">{[0, 1, 2, 3].map(i => <span key={i} className={i < pin.length ? "f" : ""} />)}</div>
      <div className="pinpad">{["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
        k === "" ? <span key={i} /> : <button key={i} onClick={() => press(k)} aria-label={k === "del" ? "Delete" : k}>{k === "del" ? "⌫" : k}</button>)}</div>
      <button className="btn block" onClick={onCancel}>Cancel</button>
      {onForgot && <button className="linkish" onClick={onForgot}>Forgot your PIN?</button>}
    </div>
  );
}

function ChangePin({ onClose }) {
  const [f, setF] = useState({ current: "", next: "", confirm: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false);
  const digits = v => v.replace(/\D/g, "").slice(0, 4);
  const save = async () => {
    if (f.next.length !== 4) return setErr("The new PIN must be 4 digits.");
    if (f.next !== f.confirm) return setErr("The new PINs do not match.");
    setBusy(true); setErr("");
    try { await api("/api/device/pin", { current: f.current, next: f.next }); setDone(true); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  if (done) return <div className="sheet ok pop"><Check size={28} color="#00661A" /><h3>PIN Changed</h3><p>Use your new PIN from now on.</p><button className="btn block" onClick={onClose}>Done</button></div>;
  return (
    <div className="sheet pop">
      <KeyRound size={30} color="#0F1561" />
      <h3>Change Your PIN</h3>
      <div className="lateform">
        <div className="field"><label>Current PIN</label><input type="password" inputMode="numeric" maxLength={4} value={f.current} onChange={e => setF({ ...f, current: digits(e.target.value) })} /></div>
        <div className="field"><label>New PIN (4 digits)</label><input type="password" inputMode="numeric" maxLength={4} value={f.next} onChange={e => setF({ ...f, next: digits(e.target.value) })} /></div>
        <div className="field"><label>Confirm new PIN</label><input type="password" inputMode="numeric" maxLength={4} value={f.confirm} onChange={e => setF({ ...f, confirm: digits(e.target.value) })} /></div>
        {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
        <button className="btn primary block" onClick={save} disabled={busy}>Save New PIN</button>
        <button className="btn block" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function ForgotPin({ onClose }) {
  const [state, setState] = useState("ask"); const [err, setErr] = useState("");
  const send = async () => { setErr(""); try { await api("/api/device/pin-forgot", {}); setState("sent"); } catch (e) { setErr(e.message); } };
  if (state === "sent") return <div className="sheet ok pop"><Check size={28} color="#00661A" /><h3>Request Sent</h3><p>Your admin has been notified and will set a new PIN for you. Ask them for it, then change it to your own PIN using <b>Change PIN</b>.</p><button className="btn block" onClick={onClose}>Done</button></div>;
  return (
    <div className="sheet pop">
      <KeyRound size={30} color="#0F1561" />
      <h3>Forgot Your PIN?</h3>
      <p>For security, only an admin can set a new PIN. Send a request and your admin will be notified.</p>
      {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
      <button className="btn primary block" onClick={send}>Ask Admin for a New PIN</button>
      <button className="btn block" onClick={onClose}>Cancel</button>
    </div>
  );
}

function LateForm({ st, onClose, reload }) {
  const emp = st.employee;
  const dates = []; for (let i = 0; i <= 7; i++) { const ds = addDays(TODAY, -i); if (employed(emp, ds) && settingsOn(emp, ds)) dates.push(ds); }
  const recOn = ds => st.attendance.find(a => a.date === ds);
  const init = ds => { const r = recOn(ds); return { date: ds, in: r?.in || "", out: r?.out || "", reason: "" }; };
  const [f, setF] = useState(() => init(dates[0] || TODAY)); const [err, setErr] = useState(""); const [sent, setSent] = useState(false); const [busy, setBusy] = useState(false);
  const existing = recOn(f.date);
  const s = settingsOn(emp, f.date);
  const send = async () => {
    if (!f.in) return setErr("Please enter the check-in time.");
    if (existing?.out) return setErr("Both times are already recorded for this date. Please contact your admin for corrections.");
    if (!f.reason.trim()) return setErr("Please provide a reason.");
    setBusy(true);
    try { await api("/api/late/request", f); setSent(true); reload(); } catch (e) { setErr(e.message); }
    setBusy(false);
  };
  if (sent) return (
    <div className="sheet ok pop"><Check size={28} color="#00661A" /><h3>Request Submitted</h3>
      <p>It will be added to your attendance once an admin approves it.</p>
      <button className="btn block" onClick={onClose}>Done</button></div>
  );
  return (
    <div className="sheet pop">
      <h3>Request Late Entry</h3>
      <p>For shifts that could not be recorded because of a power or internet outage. Subject to admin approval.</p>
      <div className="lateform">
        <div className="field"><label>Shift date</label>
          <select value={f.date} onChange={e => { setErr(""); setF(init(e.target.value)); }}>{dates.map(ds => <option key={ds} value={ds}>{niceDate(ds)}</option>)}</select></div>
        {s && overnight(s) && <div className="notice">For night shifts, select the date the shift began.</div>}
        <div className="row">
          <div className="field" style={{ flex: 1 }}><label>Check-in time</label><input type="time" value={f.in} disabled={!!existing} onChange={e => setF({ ...f, in: e.target.value })} /></div>
          <div className="field" style={{ flex: 1 }}><label>Check-out time</label><input type="time" value={f.out} disabled={!!existing?.out} onChange={e => setF({ ...f, out: e.target.value })} /></div>
        </div>
        {existing && !existing.out && <p className="muted" style={{ margin: 0, fontSize: 13 }}>Your check-in is already recorded. Please add the check-out time.</p>}
        <div className="field"><label>Reason</label><input value={f.reason} placeholder="e.g. Power and internet outage" onChange={e => setF({ ...f, reason: e.target.value })} /></div>
        {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
        <button className="btn primary block" onClick={send} disabled={busy}>Submit Request</button>
        <button className="btn block" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
}

function Home({ st, reload }) {
  const emp = st.employee;
  const [step, setStep] = useState(null); const [msg, setMsg] = useState(""); const [done, setDone] = useState(null); const [busy, setBusy] = useState(false);
  const [code, setCode] = useState(""); const [bioState, setBioState] = useState(null);
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
    setMsg(""); setDone(null); setCode(""); setBioState(null);
    const fresh = await reload();
    if (fresh && !fresh.atShop) { setStep("code"); return; }
    verify("");
  };
  const verify = async c => {
    setMsg("");
    if (!inAndroidApp()) { setStep("pin"); return; }
    setStep("bio");
    const [status] = await askApp({ type: "bio", reason: action === "out" ? "Confirm your check-out" : "Confirm your check-in" }, "hzAppBio");
    if (status === "ok") { setBioState("ok"); if (st.mode === "either") return submit({ bio: true, code: c }); setStep("pin"); return; }
    if (status === "unavailable") { setBioState("unavailable"); setStep("pin"); return; }
    if (status === "cancelled") { setStep(null); return; }
    if (st.mode === "either") { setMsg("Fingerprint not recognised. Please enter your PIN instead."); setStep("pin"); return; }
    setStep(null); setMsg("Fingerprint not recognised. Please try again.");
  };
  const submit = async body => {
    setBusy(true);
    try { const r = await api("/api/punch", { code, ...body }); setStep(null); setDone(r); await reload(); }
    catch (e) { setMsg(e.message); if (e.status === 403) setStep(null); }
    setBusy(false);
  };
  // The Android app's Back button closes an open form first.
  useEffect(() => {
    window.hzBack = () => { if (step && step !== "bio") { setStep(null); setMsg(""); return true; } if (done || msg) { setDone(null); setMsg(""); return true; } return false; };
    return () => { delete window.hzBack; };
  }, [step, done, msg]);
  const submitPin = pin => submit({ pin, code, bio: bioState === "ok", bioUnavailable: bioState === "unavailable" });

  return (
    <>
      <div className="hello">
        <h2>Assalam-o-Alaikum, {emp.name.split(" ")[0]}</h2>
        <p>Employee ID {emp.id}</p>
        <p>{!s ? "Employment has not started yet" : isOff ? "Day off today" : `${shiftDate === YEST ? "Last night's shift" : "Today's shift"} ${shiftText(s)}`}</p>
      </div>
      {step === "code" && (
        <div className="sheet pop">
          <QrCode size={34} color="#0F1561" />
          <h3>Enter Counter Code</h3>
          <p>You are not connected to the pharmacy Wi-Fi. Enter the 6-digit code shown on the phone at the pharmacy counter.</p>
          <input className="codein" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} aria-label="Counter code" />
          {msg && <div className="err" style={{ marginTop: 0 }}>{msg}</div>}
          <button className="btn primary block" disabled={code.length !== 6} onClick={() => { setCode(code); verify(code); }}>Continue</button>
          <button className="btn block" onClick={() => { setStep(null); setMsg(""); }}>Cancel</button>
        </div>
      )}
      {step === "bio" && (
        <div className="sheet pop"><Fingerprint size={56} color="#007A1F" /><h3>Verify Your Identity</h3><p>Use your fingerprint or face unlock to continue.</p></div>
      )}
      {step === "pin" && <PinPad title="Enter Your PIN" msg={msg} busy={busy} onDone={submitPin} onCancel={() => { setStep(null); setMsg(""); }} onForgot={() => { setMsg(""); setStep("forgot"); }} />}
      {step === "changepin" && <ChangePin onClose={() => setStep(null)} />}
      {step === "forgot" && <ForgotPin onClose={() => setStep(null)} />}
      {step === "late" && <LateForm st={st} reload={reload} onClose={() => setStep(null)} />}
      {!step && (
        <>
          {done && (
            <div className="sheet ok pop">
              <Check size={28} color="#00661A" />
              <h3>{done.action === "in" ? "Check-In Recorded" : "Check-Out Recorded"}</h3><p>{fmt(done.time)}</p>
            </div>
          )}
          {msg && <div className="notice"><Wifi size={16} />{msg}</div>}
          {action ? (
            <button className={"punch" + (action === "out" ? " out" : "")} onClick={start}>
              <span className="cross" />{action === "in" ? "Check In" : "Check Out"}
            </button>
          ) : !done && <div className="sheet ok"><h3>Shift Complete</h3><p>Check-in {fmt(rec.in)}, check-out {fmt(rec.out)}</p></div>}
          {rec && action === "out" && !done && <p className="muted" style={{ textAlign: "center", margin: 0 }}>Checked in at {fmt(rec.in)}{rec.date === YEST ? " last night" : ""}</p>}
          {recent.length > 0 && <div>
            <span className="lbl">Recent attendance</span>
            <table className="mini"><tbody>{recent.map(a => <tr key={a.id}><td>{niceDate(a.date)}</td><td className="num">{fmt(a.in)} – {a.out ? fmt(a.out) : "…"}</td></tr>)}</tbody></table>
          </div>}
          {st.lateReqs.length > 0 && <div>
            <span className="lbl">Late entry requests</span>
            <table className="mini"><tbody>{st.lateReqs.slice(0, 3).map(r => <tr key={r.id}><td>{niceDate(r.date)}</td><td className="num">{r.in ? fmt(r.in) : "—"} – {r.out ? fmt(r.out) : "—"}</td>
              <td style={{ textAlign: "right" }}><span className={"tag" + (r.status === "pending" ? " amber" : r.status === "rejected" ? " red" : "")}>{r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Rejected"}</span></td></tr>)}</tbody></table>
          </div>}
          <div className="row" style={{ justifyContent: "center" }}>
            <button className="btn small" onClick={() => { setDone(null); setMsg(""); setStep("changepin"); }}><KeyRound size={14} /> Change PIN</button>
            <button className="btn small" onClick={() => { setDone(null); setMsg(""); setStep("forgot"); }}>Forgot PIN?</button>
          </div>
          <button className="latebanner" onClick={() => { setDone(null); setMsg(""); setStep("late"); }}>
            <span className="ic"><Clock size={20} /></span>
            <span className="txt"><b>Missed <span className="nb">Check-In</span> or <span className="nb">Check-Out?</span></b><small>Request Late Entry</small></span>
            <span className="go"><ChevronRight size={16} /></span>
          </button>
        </>
      )}
    </>
  );
}

function EmployeeApp() {
  const [st, setSt] = useState(null); const [err, setErr] = useState("");
  const reload = async () => {
    try { const data = await api("/api/device/status"); setClock(data.today); setSt(data); setErr(""); return data; }
    catch (e) { setErr(e.message); return null; }
  };
  useEffect(() => {
    reload();
    const onVis = () => { if (document.visibilityState === "visible") reload(); };
    document.addEventListener("visibilitychange", onVis);
    const t = setInterval(onVis, 30000);
    return () => { document.removeEventListener("visibilitychange", onVis); clearInterval(t); };
  }, []);
  const NetIcon = st?.atShop ? Wifi : Signal;
  const serverVersion = useServerVersion();
  return (
    <div className="pa applayout">
      <style>{CSS}</style>
      <div className="appscreen">
        <div className="status"><span>{st ? fmt(st.now) : ""}</span>{st && <span><NetIcon size={14} /> {st.atShop ? "Pharmacy Wi-Fi" : "Not on pharmacy Wi-Fi"}</span>}</div>
        <Brand />
        {serverVersion && serverVersion !== APP_VERSION && <div className="updbar" style={{ marginBottom: 0 }}><RefreshCw size={18} /><span>Haazir has been updated.</span><button className="btn small primary" onClick={() => location.reload()}>Reload</button></div>}
        {!st && !err && <p className="muted">Loading…</p>}
        {err && !st && <div className="sheet"><h3>Unable to Connect</h3><p>{err}</p><button className="btn block" onClick={reload}>Try Again</button></div>}
        {st && st.status === "unregistered" && <Register st={st} reload={reload} />}
        {st && st.status === "pending" && (
          <div className="sheet pop" style={{ marginTop: 30 }}>
            <Smartphone size={40} />
            <h3>Awaiting Approval</h3>
            <p>This phone has been registered for {st.name} ({st.empId}). Attendance can be recorded once an admin approves it.</p>
            {st.change && <div className="notice">This ID is currently linked to another phone. Once approved, the previous phone will be deactivated.</div>}
            <button className="btn block" onClick={reload}>Check Again</button>
          </div>
        )}
        {st && st.status === "ended" && <div className="sheet pop" style={{ marginTop: 30 }}><h3>Access Ended</h3><p>{st.name}'s last working day was {longDate(st.left)}. Attendance can no longer be recorded from this phone.</p></div>}
        {st && st.status === "approved" && <Home st={st} reload={reload} />}
        <Copyright />
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<EmployeeApp />);
