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
      if (notif.settings) { notif.closeSettings(); return true; }
      if (tab !== "today") { setTab("today"); window.scrollTo(0, 0); return true; }
      return false;
    };
    return () => { delete window.hzBack; };
  }, [tab, notif.settings]);
  const p = { db, act, me, superAdmin };
  const badges = { phones: db.requests.length, late: db.lateReqs.filter(r => r.status === "pending").length, updates: db.update && db.update.available ? 1 : 0 };
  const Btn = ([k, l, I]) => <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}><span className="ico"><I size={16} /></span>{l}{badges[k] > 0 && <span className="tag amber">{badges[k]}</span>}</button>;
  return (
    <>
    <header className="topbar">
      <div className="brand"><img src={LOGO} alt="" /><span className="wordmark"><b>Haazir</b><small><span className="eco">eco</span> Pharmacy Staff Attendance</small></span></div>
      <div className="topright">
        <span className="topdate">{new Date(TODAY + "T00:00:00").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
        <button className="btn small" onClick={reload} title="Refresh data"><RefreshCw size={14} /> Refresh</button>
        <BellMenu notif={notif} />
        <AccountMenu db={db} act={act} onSignOut={onSignOut} onSettings={notif.openSettings} />
      </div>
    </header>
    <div className="admin">
      <nav className="side">
        {groups.map(([g, items]) => <div key={g} className="navgroup"><div className="group">{g}</div>{items.map(Btn)}</div>)}
      </nav>
      <main className="main">
        {serverVersion && serverVersion !== APP_VERSION && <div className="updbar"><RefreshCw size={18} /><span>Haazir has been updated to version {serverVersion}. Reload to use the new version.</span><button className="btn small primary" onClick={() => location.reload()}>Reload</button></div>}
        {superAdmin && db.update && db.update.available && tab !== "updates" && serverVersion === APP_VERSION && <div className="updbar"><Download size={18} /><span>Haazir {db.update.latest} is available. You are using version {db.update.current}.</span><button className="btn small primary" onClick={() => setTab("updates")}>View Update</button></div>}
        {tab === "today" && <Today {...p} />}
        {tab === "records" && <Records {...p} />}
        {tab === "employees" && <Employees {...p} />}
        {tab === "phones" && <Phones {...p} />}
        {tab === "overtime" && <Overtime {...p} />}
        {tab === "salary" && <Salary {...p} />}
        {tab === "network" && <NetworkTab {...p} />}
        {tab === "access" && <Access {...p} />}
        {tab === "log" && <Log {...p} />}
        {tab === "late" && <LateRequests {...p} />}
        {tab === "hours" && <WorkHours {...p} />}
        {tab === "updates" && <Updates {...p} />}
        {tab === "backup" && <BackupPage {...p} />}
        <Copyright />
      </main>
    </div>
    </>
  );
}

function LateRequests({ db, act, me }) {
  const emp = id => db.employees.find(e => e.id === id);
  const pending = db.lateReqs.filter(r => r.status === "pending");
  const decided = db.lateReqs.filter(r => r.status !== "pending").slice(-10).reverse();
  const decide = (r, ok) => act("/api/late/decide", { id: r.id, approve: ok });
  const row = (r, actions) => {
    const e = emp(r.empId), s = settingsOn(e, r.date);
    const lm = r.in && s ? lateBeyond(r, s) : 0;
    return <tr key={r.id}><td><b>{e.name}</b><div className="muted">{e.id}</div></td><td>{niceDate(r.date)}<div className="muted">{s ? shiftText(s) : ""}</div></td>
      <td>{timeText(r.in, s)}<br />{timeText(r.out, s)}{lm > 0 && <div><span className="tag amber">Late by {minText(lm)}</span></div>}</td>
      <td style={{ maxWidth: 260 }}>{r.reason}<div className="muted">Submitted {r.at}</div></td><td>{actions}</td></tr>;
  };
  return (
    <>
      <h1>Late Entries</h1>
      <p className="sub">Requests from employees who could not record attendance during a power or internet outage. Entries are added only after approval by an admin or super admin.</p>
      <div className="panel">
        <h2>Pending Approval</h2>
        {pending.length === 0 ? <p className="muted">No pending requests.</p> :
          <table className="t"><thead><tr><th>Employee</th><th>Shift Date</th><th>Check-In / Out</th><th>Reason</th><th></th></tr></thead>
            <tbody>{pending.map(r => row(r, <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn small primary" onClick={() => decide(r, true)}>Approve</button><button className="btn small danger" onClick={() => decide(r, false)}>Reject</button></div>))}</tbody></table>}
      </div>
      {decided.length > 0 && <div className="panel">
        <h2>Recent Decisions</h2>
        <table className="t"><thead><tr><th>Employee</th><th>Shift Date</th><th>Check-In / Out</th><th>Reason</th><th>Decision</th></tr></thead>
          <tbody>{decided.map(r => row(r, <><span className={"tag" + (r.status === "rejected" ? " red" : "")}>{r.status === "approved" ? "Approved" : "Rejected"}</span><div className="muted">{r.by}</div></>))}</tbody></table>
      </div>}
    </>
  );
}

const hm = min => { const sgn = min < 0 ? "−" : ""; min = Math.abs(Math.round(min)); return `${sgn}${Math.floor(min / 60)}h ${pad(min % 60)}m`; };

// Day-by-day hours worked for one employee in a month, measured from check-in to check-out.
function workHours(e, ym, attendance, overtime) {
  const [y, m] = ym.split("-").map(Number); const dim = daysIn(y, m);
  const rows = []; let worked = 0, scheduled = 0, days = 0, missing = 0, otHours = 0;
  for (let d = 1; d <= dim; d++) {
    const ds = `${ym}-${pad(d)}`;
    if (ds > TODAY) break;
    if (!employed(e, ds) || ds < TRACK_START) continue;
    const s = settingsOn(e, ds); if (!s) continue;
    const rec = attendance.find(a => a.synced && a.empId === e.id && a.date === ds);
    const off = s.off.includes(weekday(ds));
    const sched = off ? 0 : s.hours * 60;
    const w = rec && rec.out ? rel(rec.out, s) - rel(rec.in, s) : null;
    if (ds < TODAY || w !== null) scheduled += sched;
    if (w !== null) { worked += w; days++; }
    if (rec && !rec.out && ds < TODAY) missing++;
    const ot = overtime.find(o => o.empId === e.id && o.date === ds); if (ot && rec) otHours += ot.hours;
    rows.push({ ds, s, rec, off, sched, w });
  }
  const lastS = settingsOn(e, `${ym}-${pad(dim)}`) || rows[rows.length - 1]?.s;
  // Allowed hours are pro-rated when the employee joins or leaves during the month.
  let empDays = 0; for (let d = 1; d <= dim; d++) if (employed(e, `${ym}-${pad(d)}`)) empDays++;
  // Automatic (-1): daily hours on every working day of this month (employees may work their paid leave days, which are paid extra).
  let allowed = null, autoDays = null;
  if (lastS && lastS.monthHours === -1) {
    let mins = 0, workDays = 0;
    for (let d = 1; d <= dim; d++) {
      const ds = `${ym}-${pad(d)}`; if (!employed(e, ds)) continue;
      const sd = settingsOn(e, ds); if (!sd || sd.off.includes(weekday(ds))) continue;
      mins += sd.hours * 60; workDays++;
    }
    allowed = mins;
    autoDays = workDays;
  } else if (lastS?.monthHours) allowed = lastS.monthHours * 60 * empDays / dim;
  return { rows, worked, scheduled, days, missing, otHours, allowed, autoDays, prorated: !!allowed && empDays < dim };
}

function WorkHoursInner({ db }) {
  const [mode, setMode] = useState("employee");
  const [empId, setEmpId] = useState(db.employees[0].id);
  const [month, setMonth] = useState(TODAY.slice(0, 7));
  const e = db.employees.find(x => x.id === empId);
  const allowedCell = r => {
    if (!r.allowed) return <span className="muted">No limit</span>;
    const left = r.allowed - r.worked;
    return left >= 0 ? <span className="pos">{hm(left)} remaining</span> : <span className="neg">{hm(-left)} over</span>;
  };
  return (
    <>
      <h1>Work Hours</h1>
      <p className="sub">Hours worked each day, measured from check-in to check-out, compared with scheduled hours and each employee's allowed hours per month. Night shifts are counted across midnight.</p>
      <div className="row" style={{ marginBottom: 16, alignItems: "center" }}>
        <div className="seg2" role="tablist">
          <button className={mode === "employee" ? "on" : ""} onClick={() => setMode("employee")}>By Employee</button>
          <button className={mode === "all" ? "on" : ""} onClick={() => setMode("all")}>All Staff</button>
        </div>
        {mode === "employee" && <select value={empId} onChange={ev => setEmpId(ev.target.value)} style={{ width: "auto" }}>{db.employees.map(x => <option key={x.id} value={x.id}>{x.name} ({x.id}){x.left ? ", Resigned" : ""}</option>)}</select>}
        <MonthPick value={month} onChange={setMonth} />
        <ExportButtons onExcel={() => {
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
        }} />
      </div>
      <div className="printhead">Haazir, eco Pharmacy: Work Hours for {mode === "employee" ? `${e.name} (${e.id}), ` : "all staff, "}{monthName(month)}. Printed {longDate(TODAY)}.</div>

      {mode === "employee" ? (() => {
        const r = workHours(e, month, db.attendance, db.overtime);
        if (r.rows.length === 0) return <div className="panel"><p className="muted">{e.name} was not employed in {monthName(month)}.</p></div>;
        const pct = r.allowed ? Math.min(100, (r.worked / r.allowed) * 100) : 0;
        const diff = r.worked - r.scheduled;
        return (
          <>
            <div className="stats">
              <div className="stat"><span>Hours worked</span><b>{hm(r.worked)}</b><small>{r.days} days with full records</small></div>
              <div className="stat"><span>Scheduled to date</span><b>{hm(r.scheduled)}</b><small className={diff >= 0 ? "pos" : "neg"}>{diff >= 0 ? `${hm(diff)} extra` : `${hm(-diff)} short`}</small></div>
              <div className="stat"><span>Allowed this month</span><b>{r.allowed ? hm(r.allowed) : "No limit"}</b>
                {r.allowed ? <><small>{allowedCell(r)}{r.autoDays !== null ? `, automatic (${r.autoDays} working days)` : r.prorated ? ", pro-rated" : ""}</small><div className="bar" aria-label={`${Math.round(pct)}% of allowed hours used`}><i className={r.worked > r.allowed ? "over" : ""} style={{ width: `${pct}%` }} /></div></> : <small>Set in Employees</small>}</div>
              <div className="stat"><span>Approved overtime</span><b>{r.otHours} hrs</b><small>{r.missing > 0 ? <span className="neg">{r.missing} day{r.missing > 1 ? "s" : ""} missing check-out</span> : "All records complete"}</small></div>
            </div>
            <div className="panel">
              <table className="t"><thead><tr><th>Date</th><th>Check-In</th><th>Check-Out</th><th className="r">Worked</th><th className="r">Scheduled</th><th className="r">Difference</th><th>Status</th></tr></thead>
                <tbody>{r.rows.slice().reverse().map(({ ds, s, rec, off, sched, w }) => {
                  const d = w !== null ? w - sched : null;
                  const st = rec && !rec.out ? (ds === TODAY || ds === YEST ? <span className="tag grey">In Progress</span> : <span className="tag red">No Check-Out</span>)
                    : off ? <span className="tag grey">{rec ? "Worked on Day Off" : "Day Off"}</span>
                    : !rec ? (ds === TODAY ? <span className="tag grey">Today</span> : <span className="tag red">Absent</span>)
                    : d < -15 ? <span className="tag amber">Short</span> : <span className="tag">Complete</span>;
                  return <tr key={ds}><td className="nw">{niceDate(ds)}</td><td className="nw">{rec ? timeText(rec.in, s) : "—"}</td><td className="nw">{rec ? timeText(rec.out, s) : "—"}</td>
                    <td className="r nw"><b>{w !== null ? hm(w) : "—"}</b></td><td className="r nw">{sched ? hm(sched) : "—"}</td>
                    <td className={"r nw " + (d === null ? "" : d >= 0 ? "pos" : "neg")}>{d === null ? "—" : (d > 0 ? "+" : "") + hm(d)}</td><td>{st}</td></tr>;
                })}
                  <tr className="total"><td colSpan={3}>Total for {monthName(month)}</td><td className="r nw">{hm(r.worked)}</td><td className="r nw">{hm(r.scheduled)}</td><td className={"r nw " + (diff >= 0 ? "pos" : "neg")}>{(diff > 0 ? "+" : "") + hm(diff)}</td><td /></tr></tbody></table>
            </div>
          </>
        );
      })() : (
        <div className="panel">
          <table className="t"><thead><tr><th>Employee</th><th className="r">Days Worked</th><th className="r">Hours Worked</th><th className="r">Scheduled</th><th className="r">Allowed</th><th>Against Allowed</th><th className="r">Approved OT</th></tr></thead>
            <tbody>{db.employees.map(x => ({ x, r: workHours(x, month, db.attendance, db.overtime) })).filter(({ r }) => r.rows.length > 0).map(({ x, r }) => (
              <tr key={x.id} className="click" onClick={() => { setEmpId(x.id); setMode("employee"); }}>
                <td><b>{x.name}</b><div className="muted">{x.id}</div></td><td className="r">{r.days}</td><td className="r nw"><b>{hm(r.worked)}</b></td><td className="r nw">{hm(r.scheduled)}</td>
                <td className="r nw">{r.allowed ? hm(r.allowed) : "—"}{r.prorated && <div className="muted">Pro-rated</div>}</td><td className="nw">{allowedCell(r)}{r.missing > 0 && <div><span className="tag red">{r.missing} No Check-Out</span></div>}</td><td className="r">{r.otHours} hrs</td></tr>))}</tbody></table>
          <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>Select an employee to see their day-by-day hours.</p>
        </div>
      )}
    </>
  );
}

function MonthPick({ value, onChange }) {
  return <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "auto" }}>{monthsList().map(m => <option key={m} value={m}>{monthName(m)}</option>)}</select>;
}

function AdminCodePunch({ act, label, out }) {
  const [code, setCode] = useState(""); const [err, setErr] = useState("");
  return (
    <div className="notice" style={{ marginTop: 12, flexDirection: "column", alignItems: "stretch", gap: 10 }}>
      <span>You are not on the pharmacy network. To record your attendance, enter the 6-digit code shown on the counter display.</span>
      <div className="row" style={{ alignItems: "center" }}>
        <input className="codein" style={{ maxWidth: 200, fontSize: "22px" }} inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} aria-label="Counter code" />
        <button className={"btn " + (out ? "out" : "in")} disabled={code.length !== 6} onClick={async () => { if (await act("/api/admin/punch", { code }, setErr)) setCode(""); }}>{label}</button>
      </div>
      {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
    </div>
  );
}

function Today({ db, act, superAdmin }) {
  const mine = db.attendance.find(a => a.empId === db.me.key && a.date === TODAY);
  const atShop = db.atShop;
  const canPunch = superAdmin || atShop;
  const open = !mine || !mine.out;
  return (
    <>
      <h1>Today's Attendance</h1>
      <p className="sub">Live status for {longDate(TODAY)}. Select Refresh at the top to load the latest check-ins.</p>
      <div className="panel">
        <h2>My Attendance</h2>
        <div className="row" style={{ alignItems: "center" }}>
          <span>{!mine ? "Not checked in yet." : mine.out ? `In ${fmt(mine.in)}, out ${fmt(mine.out)}.` : `Checked in at ${fmt(mine.in)}.`}{" "}
            {superAdmin ? "As super admin, you may record attendance from any network." : atShop ? "Connected to the pharmacy network." : ""}</span>
          {open && canPunch && <button className={"btn " + (mine ? "out" : "in")} onClick={() => act("/api/admin/punch", {})}>{mine ? "Check Out" : "Check In"}</button>}
        </div>
        {open && !canPunch && <AdminCodePunch act={act} label={mine ? "Check Out" : "Check In"} out={!!mine} />}
      </div>
      <div className="panel">
        <table className="t"><thead><tr><th>Employee</th><th>Shift</th><th>Check-In</th><th>Check-Out</th><th>Method</th><th>Status</th></tr></thead>
          <tbody>{db.employees.filter(e => !isGone(e)).map(e => {
            let s = settingsOn(e, TODAY);
            let rec = db.attendance.find(a => a.empId === e.id && a.date === TODAY && a.synced);
            const sy = settingsOn(e, YEST);
            const night = !rec && sy && overnight(sy) ? db.attendance.find(a => a.empId === e.id && a.date === YEST && a.synced && (!a.out || toMin(nowTime()) < toMin(sy.end) + 120)) : null;
            if (night) { rec = night; s = sy; }
            let st;
            if (night) st = night.out ? <span className="tag">Night Shift Complete</span> : <span className="tag">On Night Shift</span>;
            else if (!s) st = <span className="tag grey">Not Yet Joined</span>;
            else if (s.off.includes(weekday(TODAY))) st = <span className="tag grey">Day Off</span>;
            else if (!rec) st = toMin(nowTime()) > toMin(s.start) + s.grace ? <span className="tag red">Not Checked In</span> : <span className="tag grey">Shift Not Started</span>;
            else { const lm = lateBeyond(rec, s); st = rec.out ? <span className="tag">Checked Out</span> : lm > 0 ? <span className="tag amber">Late by {minText(lm)}</span> : <span className="tag">On Time</span>; }
            return <tr key={e.id}><td><b>{e.name}</b><div className="muted">{e.id}</div>{e.notes && <div className="remark">{e.notes}</div>}</td><td className="nw">{s ? <>{fmt(s.start)} – {fmt(s.end)}{overnight(s) && <div className="muted">Night shift</div>}</> : "—"}</td><td className="nw">{rec ? timeText(rec.in, s) : "—"}</td><td className="nw">{rec ? timeText(rec.out, s) : "—"}</td><td>{rec?.method || "—"}</td><td>{st}</td></tr>;
          })}</tbody></table>
      </div>
    </>
  );
}

function RecordsInner({ db, act }) {
  const [empId, setEmpId] = useState(db.employees[0].id);
  const [month, setMonth] = useState(TODAY.slice(0, 7));
  const [edit, setEdit] = useState(null); const [err, setErr] = useState("");
  const e = db.employees.find(x => x.id === empId);
  const [y, m] = month.split("-").map(Number);
  const days = [];
  for (let d = 1; d <= daysIn(y, m); d++) { const ds = `${month}-${pad(d)}`; if (ds > TODAY) break; if (employed(e, ds)) days.push(ds); }
  const remove = async ds => {
    const reason = prompt(`Delete ${e.name}'s attendance for ${niceDate(ds)}?\n\nThe day will count as an absence. Enter the reason for the audit log:`);
    if (reason === null) return;
    if (!reason.trim()) return setErr("A reason is required to delete an entry.");
    if (await act("/api/attendance/delete", { empId: e.id, date: ds, reason }, setErr)) setErr("");
  };
  const save = async () => {
    if (!edit.in) return setErr("Please enter a check-in time.");
    if (!edit.reason.trim()) return setErr("A reason is required for the audit log.");
    const r = await act("/api/attendance/save", { empId: e.id, date: edit.date, in: edit.in, out: edit.out, reason: edit.reason }, setErr);
    if (r) { setEdit(null); setErr(""); }
  };
  return (
    <>
      <h1>Attendance Records</h1>
      <TrackingStart db={db} act={act} />
      <p className="sub">Add missing entries, edit wrong times, or delete entries made by mistake. Every change is recorded in the audit log with its reason. Night shifts appear under the date they began.</p>
      <div className="panel">
        <div className="row" style={{ marginBottom: 12 }}>
          <select value={empId} onChange={ev => { setEmpId(ev.target.value); setEdit(null); }} style={{ width: "auto" }}>{db.employees.map(x => <option key={x.id} value={x.id}>{x.name} ({x.id}){x.left ? ", Resigned" : ""}</option>)}</select>
          <MonthPick value={month} onChange={v => { setMonth(v); setEdit(null); }} />
        </div>
        {err && <div className="err" style={{ marginBottom: 8 }}>{err}</div>}
        <table className="t"><thead><tr><th>Date</th><th>Check-In</th><th>Check-Out</th><th>Method</th><th>Status</th><th></th></tr></thead>
          <tbody>{days.slice().reverse().map(ds => {
            const s = settingsOn(e, ds); const rec = db.attendance.find(a => a.empId === e.id && a.date === ds && a.synced);
            const off = s.off.includes(weekday(ds));
            if (edit?.date === ds) return (
              <tr key={ds}><td>{niceDate(ds)}</td>
                <td><input type="time" value={edit.in} onChange={ev => setEdit({ ...edit, in: ev.target.value })} /></td>
                <td><input type="time" value={edit.out} onChange={ev => setEdit({ ...edit, out: ev.target.value })} /></td>
                <td colSpan={2}><input placeholder="Reason for change" value={edit.reason} onChange={ev => setEdit({ ...edit, reason: ev.target.value })} /></td>
                <td><div className="row"><button className="btn small primary" onClick={save}>Save</button><button className="btn small" onClick={() => { setEdit(null); setErr(""); }}>Cancel</button></div></td></tr>
            );
            const lm = rec ? lateBeyond(rec, s) : 0;
            const dk = rec ? dayKind(rec, s) : null;
            const st = off ? <span className="tag grey">Day Off</span> : !rec && ds < TRACK_START ? <span className="tag grey">Before Tracking</span> : !rec ? (ds === TODAY ? <span className="tag grey">Today</span> : <span className="tag red">Absent</span>) : dk.kind === "half" ? <span className="tag amber">Half Day (left {minText(dk.early)} early)</span> : dk.kind === "short" ? <span className="tag red">Short Day ({dk.early ? `left ${minText(dk.early)} early` : `worked ${minText(dk.worked)}`})</span> : !rec.out && ds < YEST ? <span className="tag red">No Check-Out</span> : lm > 0 ? <span className="tag amber">Late by {minText(lm)}</span> : <span className="tag">On Time</span>;
            return <tr key={ds}><td>{niceDate(ds)}</td><td>{rec ? timeText(rec.in, s) : "—"}</td><td>{rec ? timeText(rec.out, s) : "—"}</td><td>{rec?.method || "—"}</td><td>{st}</td>
              <td><div className="row" style={{ justifyContent: "flex-end", flexWrap: "nowrap" }}>
                <button className="btn small" onClick={() => { setErr(""); setEdit({ date: ds, in: rec?.in || s.start, out: rec?.out || "", reason: "" }); }}>{rec ? "Edit" : "Add Entry"}</button>
                {rec && <button className="btn small danger" onClick={() => remove(ds)}>Delete</button>}</div></td></tr>;
          })}</tbody></table>
      </div>
    </>
  );
}

const blankForm = () => ({ name: "", role: "", pin: "", notes: "", dayShifts: {}, joined: TODAY, left: "", salary: 30000, start: "09:00", end: "17:00", hours: 8, monthMode: "auto", monthHours: "", off: [], leaves: 0, grace: 10, from: TODAY });
// Different hours on particular weekdays (for example a Friday night shift).
function DayShifts({ form, f }) {
  const ds = form.dayShifts || {};
  const set = v => f("dayShifts", v);
  const unused = DAYS.map((d, i) => i).filter(i => !ds[i]);
  return (
    <div style={{ marginBottom: 14 }}>
      <span className="lbl">Different hours on some days (optional)</span>
      {Object.keys(ds).length === 0 ? <p className="muted" style={{ margin: "2px 0 8px", fontSize: 13 }}>Every working day uses the shift above. Add a day if that day's duty hours are different, for example Friday 11:00 PM to 7:00 AM.</p>
        : <p className="muted" style={{ margin: "2px 0 8px", fontSize: 13 }}>With <b>Flexible end time</b> ticked, the start time still counts for lateness, but staying later is not overtime and leaving earlier is not a half day. The day only counts as an absence if fewer than the half-day share of its hours are worked.</p>}
      {Object.entries(ds).sort((a, b) => a[0] - b[0]).map(([k, v]) => (
        <div className="row" key={k} style={{ alignItems: "end", marginBottom: 8 }}>
          <div style={{ width: 70, fontWeight: 700, paddingBottom: 9 }}>{DAYS[k]}</div>
          <div className="field"><label>Start</label><input type="time" value={v.start} onChange={e => set({ ...ds, [k]: { ...v, start: e.target.value } })} /></div>
          <div className="field"><label>End</label><input type="time" value={v.end} onChange={e => set({ ...ds, [k]: { ...v, end: e.target.value } })} /></div>
          <div className="field" style={{ width: 110 }}><label>Hours</label><input type="number" step="0.5" value={v.hours} onChange={e => set({ ...ds, [k]: { ...v, hours: e.target.value } })} /></div>
          <label style={{ display: "flex", gap: 6, alignItems: "center", paddingBottom: 9, fontSize: 13 }}><input type="checkbox" style={{ width: "auto" }} checked={v.flexible !== false} onChange={() => set({ ...ds, [k]: { ...v, flexible: v.flexible === false } })} /> Flexible end time</label>
          <button className="btn small danger" style={{ marginBottom: 3 }} onClick={() => { const n = { ...ds }; delete n[k]; set(n); }}>Remove</button>
          {v.start && v.end && toMin(v.end) <= toMin(v.start) && <span className="muted" style={{ fontSize: 12, paddingBottom: 9 }}>Ends the next morning</span>}
        </div>
      ))}
      {unused.length > 0 && <select style={{ width: "auto" }} value="" onChange={e => { if (e.target.value !== "") set({ ...ds, [e.target.value]: { start: form.start, end: form.end, hours: form.hours, flexible: true } }); }}>
        <option value="">+ Add a day with different hours</option>
        {unused.map(i => <option key={i} value={i}>{["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][i]}</option>)}
      </select>}
    </div>
  );
}
const monthText = v => v === -1 ? "Automatic" : v ? `${v} hrs/month` : "No limit";

function Employees({ db, act }) {
  const [form, setForm] = useState(null); const [err, setErr] = useState("");
  const f = (k, v) => setForm({ ...form, [k]: v });
  const openEdit = e => { const s = settingsOn(e, TODAY, true) || e.history[e.history.length - 1]; setErr(""); setForm({ editId: e.id, name: e.name, role: e.role, pin: "", joined: e.joined, left: e.left || "", notes: e.notes || "", ...s, monthMode: s.monthHours === -1 ? "auto" : s.monthHours ? "fixed" : "none", monthHours: s.monthHours > 0 ? s.monthHours : "", monthHours: s.monthHours ?? "", off: [...s.off], dayShifts: JSON.parse(JSON.stringify(s.dayShifts || {})), from: TODAY }); };
  const save = async () => {
    const n = ["salary", "hours", "leaves", "grace"]; const vals = Object.fromEntries(n.map(k => [k, Number(form[k])]));
    if (!form.name.trim()) return setErr("Please enter the employee's name.");
    if (form.editId ? form.pin && !/^\d{4}$/.test(form.pin) : !/^\d{4}$/.test(form.pin)) return setErr(form.editId ? "A new PIN must be 4 digits, or leave it blank to keep the current PIN." : "PIN must be 4 digits.");
    if (!form.joined) return setErr("Please enter the joining date.");
    if (form.monthMode === "fixed" && !(Number(form.monthHours) > 0)) return setErr("Enter the allowed hours per month, or choose Automatic or No limit.");
    for (const v of Object.values(form.dayShifts || {})) if (!v.start || !v.end || !(Number(v.hours) > 0)) return setErr("Please enter the start, end and hours for each day with different hours.");
    if (form.left && form.left < form.joined) return setErr("The resign date cannot be earlier than the joining date.");
    if (n.some(k => isNaN(vals[k]) || vals[k] < 0) || vals.salary <= 0 || vals.hours <= 0) return setErr("Please check the salary, hours, leaves and grace period.");
    const r = await act("/api/employees/save", { ...form, monthHours: form.monthMode === "auto" ? -1 : form.monthMode === "fixed" ? Number(form.monthHours) : "" }, setErr);
    if (r) { setForm(null); setErr(""); }
  };
  const editing = form?.editId && db.employees.find(e => e.id === form.editId);
  return (
    <>
      <h1>Employees</h1>
      <p className="sub">Setting changes take effect from the date you choose, so earlier payroll stays accurate. A resign date ends app access after the last working day, and salary is paid up to that day.</p>
      {form ? (
        <div className="panel">
          <h2>{form.editId ? `Edit Employee: ${editing.name}` : "New Employee"}</h2>
          <div className="fields">
            <div className="field"><label>Name</label><input value={form.name} onChange={e => f("name", e.target.value)} /></div>
            <div className="field"><label>Designation</label><input value={form.role} onChange={e => f("role", e.target.value)} /></div>
            <div className="field"><label>{form.editId ? "New PIN (optional)" : "PIN (4 digits)"}</label><input type="password" inputMode="numeric" autoComplete="new-password" placeholder={form.editId ? "Keep current PIN" : ""} value={form.pin} maxLength={4} onChange={e => f("pin", e.target.value.replace(/\D/g, ""))} /></div>
            <div className="field"><label>Joining date</label><input type="date" value={form.joined} onChange={e => f("joined", e.target.value)} /></div>
            <div className="field"><label>Resign date (last working day)</label><input type="date" value={form.left} min={form.joined} onChange={e => f("left", e.target.value)} /></div>
            <div className="field"><label>Monthly salary (Rs)</label><input type="number" value={form.salary} onChange={e => f("salary", e.target.value)} /></div>
            <div className="field"><label>Shift start</label><input type="time" value={form.start} onChange={e => f("start", e.target.value)} /></div>
            <div className="field"><label>Shift end</label><input type="time" value={form.end} onChange={e => f("end", e.target.value)} /></div>
            <div className="field"><label>Daily working hours</label><input type="number" step="0.5" value={form.hours} onChange={e => f("hours", e.target.value)} /></div>
            <div className="field"><label>Allowed hours per month</label>
              <select value={form.monthMode} onChange={e => f("monthMode", e.target.value)}>
                <option value="auto">Automatic</option><option value="fixed">Fixed number</option><option value="none">No limit</option></select></div>
            {form.monthMode === "fixed" && <div className="field"><label>Hours per month</label><input type="number" step="1" value={form.monthHours} onChange={e => f("monthHours", e.target.value)} /></div>}
            <div className="field"><label>Paid leaves per month</label><input type="number" value={form.leaves} onChange={e => f("leaves", e.target.value)} /></div>
            <div className="field"><label>Grace period (minutes)</label><input type="number" value={form.grace} onChange={e => f("grace", e.target.value)} /></div>
            {form.editId && <div className="field"><label>Effective from</label><input type="date" value={form.from} onChange={e => f("from", e.target.value)} /></div>}
          </div>
          <div className="field" style={{ marginBottom: 12 }}><label>Remarks (for admins only; not used in any calculation)</label>
            <textarea rows={2} maxLength={500} value={form.notes} placeholder="e.g. Usual day off: Sunday. Prefers evening shifts." onChange={e => f("notes", e.target.value)} /></div>
          {form.monthMode === "auto" && <p className="muted" style={{ margin: "0 0 12px", fontSize: 13 }}>Automatic allowed hours = daily working hours × (days in the month − weekly days off). For example, 10 hours a day with no weekly day off gives 280 hours in a 28-day month, 300 in a 30-day month and 310 in a 31-day month. Paid leaves not taken are paid extra in Payroll.</p>}
          {form.start && form.end && overnight(form) && <div className="notice" style={{ marginBottom: 12 }}>Night shift: ends the following morning. Attendance is recorded under the shift's start date, and the weekly day off refers to the night the shift would begin.</div>}
          <DayShifts form={form} f={f} />
          <span className="lbl">Weekly day off</span>
          <div className="chips" style={{ marginBottom: 14 }}>{DAYS.map((d, i) => <button key={d} className={form.off.includes(i) ? "on" : ""} onClick={() => f("off", form.off.includes(i) ? form.off.filter(x => x !== i) : [...form.off, i])}>{d}</button>)}</div>
          <div className="row"><button className="btn primary" onClick={save}>{form.editId ? "Save Changes" : "Add Employee"}</button><button className="btn" onClick={() => setForm(null)}>Cancel</button></div>
          {err && <div className="err">{err}</div>}
          {editing && <><h2 style={{ marginTop: 20 }}>Settings History</h2>
            <table className="t"><thead><tr><th>Effective From</th><th>Salary</th><th>Shift</th><th>Hours/Day</th><th>Hours/Month</th><th>Paid Leaves</th><th>Grace</th><th>Day Off</th><th>Changed By</th></tr></thead>
              <tbody>{editing.history.slice().reverse().map(h => <tr key={h.from}><td className="nw">{longDate(h.from)}</td><td>{rs(h.salary)}</td><td>{shiftText(h)}{Object.entries(h.dayShifts || {}).map(([k, v]) => <div key={k} className="muted">{DAYS[k]}: {shiftText(v)}, {v.hours} hrs{v.flexible !== false ? ", flexible" : ""}</div>)}</td><td>{h.hours}</td><td>{monthText(h.monthHours)}</td><td>{h.leaves}</td><td>{h.grace} min</td><td>{h.off.map(i => DAYS[i]).join(", ") || "None"}</td><td className="nw">{h.changedBy ? <>{h.changedBy}<div className="muted">{h.changedAt}</div></> : <span className="muted">Before records</span>}</td></tr>)}</tbody></table>
            <p className="muted" style={{ fontSize: 13, marginTop: 8 }}>Each row applies from its date until the next row. A pay raise or new duty hours appear here as a new row; earlier months keep the old figures.</p></>}
        </div>
      ) : <div style={{ marginBottom: 18 }}><button className="btn primary" onClick={() => { setErr(""); setForm(blankForm()); }}>Add Employee</button></div>}
      <div className="panel">
        <table className="t"><thead><tr><th>Employee</th><th>Employment</th><th>Salary</th><th>Shift</th><th>Hours</th><th>Day Off</th><th>Paid Leaves</th><th>Grace</th><th></th></tr></thead>
          <tbody>{[...db.employees].sort((a, b) => isGone(a) - isGone(b)).map(e => { const s = settingsOn(e, TODAY, true) || e.history[e.history.length - 1]; return (
            <tr key={e.id}><td><b>{e.name}</b><div className="muted">{e.role}</div><div className="muted">{e.id}</div>{e.notes && <div className="remark">{e.notes}</div>}</td>
              <td className="nw">Joined {longDate(e.joined)}{e.left && <div style={{ marginTop: 4 }}>{isGone(e) ? <span className="tag grey">Resigned</span> : <span className="tag amber">Leaving</span>} <span className="muted">{longDate(e.left)}</span></div>}</td>
              <td className="nw">{rs(s.salary)}</td><td className="nw">{fmt(s.start)} – {fmt(s.end)}{overnight(s) && <div className="muted">Night shift</div>}{Object.entries(s.dayShifts || {}).map(([k, v]) => <div key={k} className="muted">{DAYS[k]}: {fmt(v.start)} – {fmt(v.end)}{v.flexible !== false ? " (flexible)" : ""}</div>)}</td><td className="nw">{s.hours} hrs/day<div className="muted">{s.monthHours === -1 ? "Automatic monthly hours" : s.monthHours ? `${s.monthHours} hrs/month` : "No monthly limit"}</div></td><td>{s.off.map(i => DAYS[i]).join(", ") || "None"}</td><td className="nw">{s.leaves} / month</td><td className="nw">{s.grace} min</td>
              <td><button className="btn small" onClick={() => openEdit(e)}>Edit</button></td></tr>); })}</tbody></table>
      </div>
    </>
  );
}

function Phones({ db, act }) {
  const label = id => db.phones.find(p => p.id === id)?.label || "Unknown phone";
  const name = id => db.employees.find(e => e.id === id)?.name;
  const approve = r => act("/api/devices/decide", { phoneId: r.phoneId, approve: true });
  const reject = r => act("/api/devices/decide", { phoneId: r.phoneId, approve: false });
  const remove = e => { if (confirm(`Remove ${label(e.phone)} from ${e.name}? They will need to register a phone again.`)) act("/api/devices/remove", { empId: e.id }); };
  return (
    <>
      <h1>Registered Phones</h1>
      <p className="sub">Each employee records attendance from one approved phone. Registration from any other phone requires approval here.</p>
      <div className="panel">
        <h2>Pending Approval</h2>
        {db.requests.length === 0 ? <p className="muted">No pending registrations.</p> :
          <table className="t"><tbody>{db.requests.map(r => (
            <tr key={r.phoneId + r.empId}><td><b>{name(r.empId)}</b> ({r.empId})<div className="muted">{label(r.phoneId)}, requested {r.at}</div></td>
              <td>{r.change ? <span className="tag amber">Phone Change</span> : <span className="tag grey">New Registration</span>}</td>
              <td><div className="row" style={{ justifyContent: "flex-end" }}><button className="btn small primary" onClick={() => approve(r)}>Approve</button><button className="btn small danger" onClick={() => reject(r)}>Reject</button></div></td></tr>))}</tbody></table>}
      </div>
      <div className="panel">
        <h2>Approved Phones</h2>
        <table className="t"><tbody>{db.employees.map(e => (
          <tr key={e.id}><td><b>{e.name}</b> ({e.id})</td><td>{isGone(e) ? <span className="tag grey">Resigned</span> : e.phone ? label(e.phone) : <span className="muted">Not registered</span>}</td>
            <td className="r">{e.phone && !isGone(e) && <button className="btn small danger" onClick={() => remove(e)}>Remove Phone</button>}</td></tr>))}</tbody></table>
      </div>
    </>
  );
}

function OvertimeInner({ db, act, me }) {
  const [month, setMonth] = useState(TODAY.slice(0, 7));
  const [draft, setDraft] = useState({});
  const [pre, setPre] = useState({ empId: db.employees[0].id, date: TODAY, hours: 1, rate: 1 });
  const name = id => db.employees.find(e => e.id === id)?.name;
  const has = (empId, date) => db.overtime.some(o => o.empId === empId && o.date === date);
  const detected = db.attendance.filter(a => a.synced && a.out && a.date.startsWith(month) && db.employees.some(e => e.id === a.empId)).map(a => {
    const e = db.employees.find(x => x.id === a.empId); const s = settingsOn(e, a.date);
    return { a, s, extra: extraAfterShift(a, s) };
  }).filter(x => x.extra >= 15 && !x.s.flexible && !has(x.a.empId, x.a.date)).reverse();
  const approve = (empId, date, hours, rate) => act("/api/overtime/approve", { empId, date, hours: Number(hours), rate: Number(rate) });
  const remove = o => act("/api/overtime/cancel", { empId: o.empId, date: o.date });
  const approved = db.overtime.filter(o => o.date.startsWith(month));
  return (
    <>
      <h1>Overtime</h1>
      <p className="sub">Time worked beyond a shift is paid only when approved. Approve it afterwards, or authorise it in advance for a specific date.</p>
      <div className="row" style={{ marginBottom: 14 }}><MonthPick value={month} onChange={setMonth} /></div>
      <div className="panel">
        <h2>Pre-Approve Overtime</h2>
        <div className="row">
          <div className="field"><label>Employee</label><select value={pre.empId} onChange={e => setPre({ ...pre, empId: e.target.value })}>{db.employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
          <div className="field"><label>Date</label><input type="date" value={pre.date} onChange={e => setPre({ ...pre, date: e.target.value })} /></div>
          <div className="field" style={{ width: 90 }}><label>Hours</label><input type="number" step="0.5" value={pre.hours} onChange={e => setPre({ ...pre, hours: e.target.value })} /></div>
          <div className="field" style={{ width: 100 }}><label>Rate</label><select value={pre.rate} onChange={e => setPre({ ...pre, rate: e.target.value })}><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></div>
          <button className="btn primary" onClick={() => approve(pre.empId, pre.date, pre.hours, pre.rate)}>Approve Overtime</button>
        </div>
      </div>
      <div className="panel">
        <h2>Unapproved Extra Time</h2>
        {detected.length === 0 ? <p className="muted">No unapproved extra time in {monthName(month)}.</p> :
          <table className="t"><thead><tr><th>Employee</th><th>Date</th><th>Shift End</th><th>Check-Out</th><th>Extra Time</th><th>Payable Hours</th><th>Rate</th><th></th></tr></thead>
            <tbody>{detected.map(({ a, s, extra }) => { const dr = draft[a.id] || { hours: Math.round(extra / 15) / 4, rate: 1 }; const set = v => setDraft({ ...draft, [a.id]: { ...dr, ...v } }); return (
              <tr key={a.id}><td>{name(a.empId)}</td><td>{niceDate(a.date)}</td><td>{fmt(s.end)}</td><td>{timeText(a.out, s)}</td><td>{extra} min</td>
                <td style={{ width: 90 }}><input type="number" step="0.25" value={dr.hours} onChange={e => set({ hours: e.target.value })} /></td>
                <td style={{ width: 90 }}><select value={dr.rate} onChange={e => set({ rate: e.target.value })}><option value={1}>1×</option><option value={1.5}>1.5×</option><option value={2}>2×</option></select></td>
                <td><button className="btn small primary" onClick={() => approve(a.empId, a.date, dr.hours, dr.rate)}>Approve</button></td></tr>); })}</tbody></table>}
      </div>
      <div className="panel">
        <h2>Approved in {monthName(month)}</h2>
        {approved.length === 0 ? <p className="muted">No overtime approved this month.</p> :
          <table className="t"><thead><tr><th>Employee</th><th>Date</th><th>Hours</th><th>Rate</th><th>Approved By</th><th></th></tr></thead>
            <tbody>{approved.map(o => <tr key={o.empId + o.date}><td>{name(o.empId)}</td><td>{niceDate(o.date)}</td><td>{o.hours}</td><td>{o.rate}×</td><td>{o.by}</td><td className="r"><button className="btn small danger" onClick={() => remove(o)}>Cancel</button></td></tr>)}</tbody></table>}
      </div>
    </>
  );
}

function ExportButtons({ onExcel }) {
  const [msg, setMsg] = useState("");
  const excel = async () => { setMsg(""); try { await onExcel(); } catch (e) { setMsg(e.message); } };
  return (
    <span className="row noprint" style={{ alignItems: "center", marginLeft: "auto" }}>
      <button className="btn" onClick={excel}><Download size={16} /> Download Excel</button>
      {!inAndroidApp() && <button className="btn" onClick={() => window.print()}>Print or Save as PDF</button>}
      {msg && <span className="err" style={{ marginTop: 0 }}>{msg}</span>}
    </span>
  );
}
const r2 = n => Math.round(n * 100) / 100;

function Salary({ db }) {
  const [month, setMonth] = useState(TODAY.slice(0, 7)); const [open, setOpen] = useState(null);
  const rows = db.employees.map(e => ({ e, c: calcSalary(e, month, db.attendance, db.overtime) })).filter(r => r.c.base > 0 || r.c.untracked > 0);
  const total = rows.reduce((t, r) => t + r.c.payable, 0);
  const inProgress = rows[0]?.c.inProgress;
  return (
    <>
      <h1>Payroll</h1>
      <p className="sub">Daily rate is the monthly salary divided by the days in the month. Payroll counts only completed days: every day up to yesterday, plus today once the employee has checked out. Remaining days of the month are added as they are completed. Days before the attendance tracking start date are not included. Leaving early beyond the early leave grace counts as a half day or an absence (see Admins & Security). Absences beyond the paid leaves and late minutes beyond the grace period are deducted. Paid leaves not taken are paid extra at the daily rate when the month ends, and approved overtime is added. Select an employee to view the full calculation.</p>
      <div className="printhead">Haazir, eco Pharmacy: Payroll for {monthName(month)}{inProgress ? " (in progress, calculated to yesterday)" : ""}. Printed {longDate(TODAY)}.</div>
      <div className="row" style={{ marginBottom: 14, alignItems: "center" }}><MonthPick value={month} onChange={v => { setMonth(v); setOpen(null); }} />
        {inProgress && <span className="tag amber">In Progress: Completed Days Only</span>}
        <ExportButtons onExcel={() => saveBlob(makeXlsx("Payroll " + month, [
          ["Employee ID", "Name", "Month", "Days Counted", "Salary for Days Counted", "Daily Rate", "Days Present", "Absences", "Half Days", "Short Days", "Leave Days Covered", "Unpaid Days", "Absence Deduction", "Times Late", "Minutes Late (beyond grace)", "Late Deduction", "Unused Paid Leaves", "Unused Leave Pay", "Approved Overtime (hrs)", "Overtime Pay", "Net Payable"],
          ...rows.map(({ e, c }) => [e.id, e.name, monthName(month), c.doneDays, r2(c.earnedBase), r2(c.daily), c.present, c.absences, c.halfDays, c.shortDays, c.covered, c.unpaid, r2(c.absDed), c.lateCount, c.lateMins, r2(c.lateDed), c.inProgress ? "At month end" : c.unusedLeaves, r2(c.leavePay), c.otHours, r2(c.otPay), r2(c.payable)]),
          ["", "Total", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", r2(total)],
        ]), `Haazir Payroll ${month}.xlsx`)} />
      </div>
      <div className="panel">
        <table className="t"><thead><tr><th>Employee</th><th className="r">Salary Earned</th><th className="r">Absences</th><th className="r">Late</th><th className="r">Unused Leave</th><th className="r">Overtime</th><th className="r">Net Payable</th></tr></thead>
          <tbody>{rows.map(({ e, c }) => [
            <tr key={e.id} className="click" onClick={() => setOpen(open === e.id ? null : e.id)}>
              <td><b>{e.name}</b><div className="muted">{e.id}</div></td><td className="r">{rs(c.earnedBase)}<div className="muted">{c.doneDays} day{c.doneDays === 1 ? "" : "s"}</div></td>
              <td className="r">{c.absDed ? "− " + rs(c.absDed) : "—"}</td><td className="r">{c.lateDed ? "− " + rs(c.lateDed) : "—"}</td>
              <td className="r">{c.leavePay ? "+ " + rs(c.leavePay) : c.inProgress ? <span className="muted">Month end</span> : "—"}</td>
              <td className="r">{c.otPay ? "+ " + rs(c.otPay) : "—"}</td><td className="r"><b>{rs(c.payable)}</b></td></tr>,
            open === e.id && <tr key={e.id + "x"}><td colSpan={7}><div className="breakdown">
              <div><span>Monthly salary {rs(c.daily * c.dim)}, daily rate</span><span>{rs(c.daily)}</span></div>
              <div><span>Salary for {c.doneDays} completed day{c.doneDays === 1 ? "" : "s"} (days off included)</span><span>{rs(c.earnedBase)}</span></div>
              {c.untracked > 0 && <div><span>Not included: {c.untracked} day{c.untracked === 1 ? "" : "s"} before attendance tracking started ({longDate(TRACK_START)})</span><span>—</span></div>}
              {c.remaining > 0 && <div><span>Not yet counted: {c.remaining} remaining day{c.remaining === 1 ? "" : "s"} this month, added as they are completed</span><span>—</span></div>}
              <div><span>Days present</span><span>{c.present}</span></div>
              <div><span>Absences: {c.absences}{c.halfDays ? `, half days: ${c.halfDays}` : ""}{c.shortDays ? `, short days (counted as absent): ${c.shortDays}` : ""}. Paid leave used: {c.covered} of {c.leaves}; unpaid: {c.unpaid} day{c.unpaid === 1 ? "" : "s"}</span><span>{c.absDed ? "− " + rs(c.absDed) : "Rs 0"}</span></div>
              <div><span>{c.inProgress ? `Unused paid leaves: calculated when the month ends (${Math.max(0, c.leaves - c.usedUnits)} unused so far)` : `Unused paid leaves: ${c.unusedLeaves} × daily rate`}</span><span>{c.leavePay ? "+ " + rs(c.leavePay) : "Rs 0"}</span></div>
              <div><span>Late {c.lateCount} times, {c.lateMins} min beyond grace</span><span>{c.lateDed ? "− " + rs(c.lateDed) : "Rs 0"}</span></div>
              <div><span>Approved overtime: {c.otHours} hrs</span><span>{c.otPay ? "+ " + rs(c.otPay) : "Rs 0"}</span></div>
              <div className="pay"><span>Net payable{c.inProgress ? " so far" : ""}</span><span>{rs(c.payable)}</span></div>
            </div></td></tr>,
          ])}
            <tr className="total"><td colSpan={6}>Total</td><td className="r">{rs(total)}</td></tr></tbody></table>
      </div>
    </>
  );
}

function NetworkTab({ db, act }) {
  const [name, setName] = useState(""); const [range, setRange] = useState(true);
  const recognised = db.atShop;
  const v4 = /^\d+\.\d+\.\d+\.\d+$/.test(db.shopIP || "");
  const rangeText = v4 ? db.shopIP.split(".").slice(0, 3).join(".") + ".x" : "";
  const setNet = async () => { if (await act("/api/networks/add", { name, range })) setName(""); };
  const shown = ip => ip.endsWith(".") ? ip + "x (address range)" : ip.endsWith(":") ? ip + "… (IPv6 network)" : ip + " (exact address)";
  const remove = n => { if (confirm(`Remove "${n.name}"? Staff on that connection will no longer be able to check in.`)) act("/api/networks/remove", { id: n.id }); };
  return (
    <>
      <h1>Pharmacy Network</h1>
      <p className="sub">Haazir recognises the pharmacy by its internet address. Register it while this device is connected to the pharmacy Wi-Fi. If your internet provider changes the address, staff can use the counter code until you register it again.</p>
      <div className="panel">
        <h2>Your Current Connection</h2>
        <div className="row" style={{ alignItems: "center", marginBottom: 12 }}>
          <span className="num">Detected internet address: {db.shopIP || "unknown"}</span>
          {recognised ? <span className="tag">Recognised</span> : <span className="tag red">Not Recognised</span>}
        </div>
        {!recognised && <p>If you are at the pharmacy now, register this connection so staff on this Wi-Fi can check in. If you are elsewhere, do this the next time you are at the pharmacy.</p>}
        <div className="row">
          <div className="field" style={{ flex: 1, minWidth: 200 }}><label>Connection name</label><input placeholder="e.g. Nayatel Fiber" value={name} onChange={e => setName(e.target.value)} /></div>
          <button className="btn primary" onClick={setNet} disabled={recognised}>Set as Pharmacy Network</button>
        </div>
        {v4 && !recognised && <label className="radio on" style={{ marginTop: 12, marginBottom: 0 }}>
          <input type="checkbox" checked={range} onChange={() => setRange(!range)} />
          <span><b>Recognise the whole range {rangeText}</b><br /><span className="muted">Recommended. Internet providers often change the last part of the address. Keeping this on stops staff being asked for the counter code when that happens.</span></span></label>}
      </div>
      <div className="panel">
        <h2>Counter Code</h2>
        <p>When a phone is not on the pharmacy Wi-Fi, for example during an internet outage, staff check in with a 6-digit code that changes every 30 seconds. Show it on a spare phone or tablet kept plugged in at the counter.</p>
        <ol style={{ margin: "0 0 12px", paddingLeft: 20, fontSize: 14 }}>
          <li>On the spare phone, open <b>{new URL("../counter/", location.href).href}</b> in Chrome.</li>
          <li>Sign in once as a super admin. The code then keeps working even without internet.</li>
          <li>Keep the screen on: in the phone's display settings, set the screen timeout to the longest option.</li>
        </ol>
        <div className="row">
          <a className="btn" href="../counter/" target="_blank" rel="noopener">Open Counter Display</a>
          <button className="btn danger" onClick={() => { if (confirm("Reset the counter code? Every counter display will need to be set up again.")) act("/api/counter/reset", {}); }}>Reset Counter Code</button>
        </div>
      </div>
      <div className="panel">
        <h2>Registered Networks</h2>
        {db.networks.length === 0 ? <p className="muted">No networks registered yet. Staff cannot check in until one is added.</p> :
          <table className="t"><tbody>{db.networks.map(n => <tr key={n.id}><td><b>{n.name}</b></td><td className="num">{shown(n.ip)}</td><td className="r"><div className="row" style={{ justifyContent: "flex-end" }}>
            {/^\d+\.\d+\.\d+\.\d+$/.test(n.ip) && <button className="btn small" onClick={() => act("/api/networks/widen", { id: n.id })}>Use Whole Range</button>}
            <button className="btn small danger" onClick={() => remove(n)}>Remove</button></div></td></tr>)}</tbody></table>}
      </div>
    </>
  );
}

function TrackingStart({ db, act }) {
  const [d, setD] = useState(db.trackingStart || TODAY); const [err, setErr] = useState("");
  return (
    <div className="panel">
      <h2>Attendance Tracking Start</h2>
      <p>Haazir records attendance and calculates payroll from this date. Days before it are not included in attendance or payroll. Set it to the day your staff start checking in with Haazir; it can be a date in the future, and check-ins before then are kept but not counted.{db.trackingStart > TODAY ? ` Tracking starts on ${longDate(db.trackingStart)}.` : ""} Admins and super admins can change it; every change is recorded in the audit log.</p>
      <div className="row">
        <div className="field" style={{ width: 200 }}><label>Start date</label><input type="date" value={d} max={addDays(TODAY, 366)} onChange={e => setD(e.target.value)} /></div>
        <button className="btn primary" disabled={d === db.trackingStart} onClick={() => act("/api/settings/tracking", { date: d }, setErr)}>Save Date</button>
      </div>
      {err && <div className="err">{err}</div>}
    </div>
  );
}

function EarlyRules({ db, act }) {
  const r = db.rules || { earlyGrace: 15, halfPct: 50 };
  const [g, setG] = useState(r.earlyGrace); const [h, setH] = useState(r.halfPct); const [err, setErr] = useState("");
  return (
    <div className="panel">
      <h2>Early Leave Rules</h2>
      <p>When an employee checks out before the shift ends, by more than the early leave grace period, the day counts as a <b>half day</b> if they worked at least the half-day share of their daily hours, or as an <b>absence</b> if they worked less. Half days and absences are covered by paid leaves first; anything beyond is deducted.</p>
      <p className="muted" style={{ fontSize: 13 }}>Example with 10 daily hours, 15 minutes grace and a 50% half-day share: leaving 10 minutes early is a full day; working 6 hours is a half day; working 1 hour (for example 4 PM to 5 PM) counts as an absence.</p>
      <div className="row">
        <div className="field" style={{ width: 220 }}><label>Early leave grace (minutes)</label><input type="number" min={0} max={240} value={g} onChange={e => setG(e.target.value)} /></div>
        <div className="field" style={{ width: 260 }}><label>Half day needs at least (% of daily hours)</label><input type="number" min={10} max={90} value={h} onChange={e => setH(e.target.value)} /></div>
        <button className="btn primary" onClick={() => act("/api/settings/rules", { earlyGrace: Number(g), halfPct: Number(h) }, setErr)}>Save Rules</button>
      </div>
      {err && <div className="err">{err}</div>}
    </div>
  );
}

function Access({ db, act }) {
  const [form, setForm] = useState({ name: "", username: "", role: "Admin", password: "" }); const [err, setErr] = useState("");
  const modes = [["both", "Biometric and PIN", "Both are required for every check-in. Recommended."],
    ["either", "Biometric, with PIN as backup", "Faster. The PIN is requested only if biometric verification fails."]];
  const add = async () => {
    if (!form.name.trim() || !form.username.trim()) return setErr("Please enter a name and username.");
    if (await act("/api/admins/add", form, setErr)) { setForm({ name: "", username: "", role: "Admin", password: "" }); setErr(""); }
  };
  const reset = a => { const pw = prompt(`New password for ${a.name} (at least 8 characters):`); if (pw) act("/api/admins/reset", { username: a.username, password: pw }); };
  return (
    <>
      <h1>Admins & Security</h1>
      <EarlyRules db={db} act={act} />
      <div className="panel">
        <h2>Check-In Verification</h2>
        <p className="muted">Fingerprint and face unlock work in the Haazir Android app. If a phone has no fingerprint or face unlock set up, the PIN is used instead. In a phone browser, such as Safari on iPhone, the PIN is used until Haazir is online with a secure address.</p>
        {modes.map(([k, t, d]) => <label key={k} className={"radio" + (db.mode === k ? " on" : "")}>
          <input type="radio" name="mode" checked={db.mode === k} onChange={() => act("/api/settings/mode", { mode: k })} />
          <span><b>{t}</b><br /><span className="muted">{d}</span></span></label>)}
      </div>
      <div className="panel">
        <h2>Administrators</h2>
        <p className="muted">Admins and super admins sign in with a username and password from any device or network to manage Haazir, and the one-phone rule does not apply to them. Admins may record their own attendance only on the pharmacy network; super admins may do so from anywhere.</p>
        <table className="t"><tbody>{db.admins.map(a => <tr key={a.username}><td><b>{a.name}</b></td><td>{a.username}</td><td><span className={"tag" + (a.role === "Admin" ? " grey" : "")}>{a.role}</span></td>
          <td className="r">{a.username !== db.me.username && <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn small" onClick={() => reset(a)}>Reset Password</button><button className="btn small danger" onClick={() => { if (confirm(`Remove ${a.name}?`)) act("/api/admins/remove", { username: a.username }); }}>Remove</button></div>}</td></tr>)}</tbody></table>
        <div className="row" style={{ marginTop: 14 }}>
          <div className="field"><label>Name</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Username</label><input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
          <div className="field"><label>Temporary password</label><input type="password" autoComplete="new-password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <div className="field"><label>Role</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option>Admin</option><option>Super Admin</option></select></div>
          <button className="btn primary" onClick={add}>Add Admin</button>
        </div>
        {err && <div className="err">{err}</div>}
      </div>
    </>
  );
}

function Log({ db }) {
  return (
    <>
      <h1>Audit Log</h1>
      <p className="sub">A permanent record of every manual entry, correction, approval and settings change. Entries cannot be edited or deleted.</p>
      <div className="panel"><table className="t"><thead><tr><th>Date & Time</th><th>User</th><th>Activity</th></tr></thead>
        <tbody>{db.audit.map((a, i) => <tr key={i}><td style={{ whiteSpace: "nowrap" }}>{a.at}</td><td style={{ whiteSpace: "nowrap" }}>{a.by}</td><td>{a.what}</td></tr>)}</tbody></table></div>
    </>
  );
}


function NoStaff({ title }) {
  return <><h1>{title}</h1><div className="panel"><p className="muted">No employees yet. Add your staff on the Employees page first.</p></div></>;
}
function Records(p) { return p.db.employees.length ? <RecordsInner {...p} /> : <NoStaff title="Attendance Records" />; }
function WorkHours(p) { return p.db.employees.length ? <WorkHoursInner {...p} /> : <NoStaff title="Work Hours" />; }
function Overtime(p) { return p.db.employees.length ? <OvertimeInner {...p} /> : <NoStaff title="Overtime" />; }

/* ---------- notifications ---------- */
const NOTE_TYPES = [
  ["checkin", "Check-In", "When an employee checks in.", ""],
  ["checkout", "Check-Out", "When an employee checks out.", " grey"],
  ["late", "Late Arrival", "When an employee arrives after the grace period.", " amber"],
  ["absent", "Not Checked In", "When an employee has not checked in by shift start plus grace period.", " red"],
  ["overleave", "Beyond Allowed Leaves", "When an absent employee has already used all paid leaves for the month.", " red"],
  ["early", "Left Early", "When an employee checks out before the shift ends, beyond the early leave grace period.", " amber"],
  ["pinreset", "PIN Reset Request", "When an employee forgets their PIN and asks for a new one.", " amber"],
];
const noteLabel = t => (NOTE_TYPES.find(n => n[0] === t) || [t, t])[1];
const noteTag = t => (NOTE_TYPES.find(n => n[0] === t) || [, , , ""])[3];
const deviceNotesSupported = () => "Notification" in window && window.isSecureContext;

// Keeps the notification list up to date, shows pop-ups and, if allowed, device notifications.
function useNotifications(db, setPhase, onNew) {
  const [events, setEvents] = useState([]); const [popups, setPopups] = useState([]);
  const [lastSeen, setLastSeen] = useState(0); const [settings, setSettings] = useState(false);
  const cursor = useRef(null); const prefsRef = useRef({});
  prefsRef.current = db ? db.me.notify : {};
  const poll = async () => {
    if (!db) return;
    try {
      const first = cursor.current === null;
      const r = await api("/api/events?after=" + (first ? 0 : cursor.current));
      setLastSeen(r.lastSeen);
      if (first) { setEvents(r.events.slice(0, 30)); cursor.current = r.latestId; return; }
      cursor.current = Math.max(cursor.current, r.latestId);
      if (!r.events.length) return;
      setEvents(ev => [...r.events, ...ev].slice(0, 30));
      const fresh = r.events.slice(0, 4).reverse();
      setPopups(pp => [...pp, ...fresh].slice(-4));
      for (const e of fresh) setTimeout(() => setPopups(pp => pp.filter(x => x.id !== e.id)), 10000);
      if (prefsRef.current.device && deviceNotesSupported() && Notification.permission === "granted" && document.visibilityState !== "visible") {
        for (const e of fresh) { try { new Notification("Haazir: " + noteLabel(e.type), { body: e.text, icon: "/icon-192.png", tag: "hz" + e.id }); } catch { /* not allowed */ } }
      }
      if (prefsRef.current.sound !== false) playChime();
      onNew();
    } catch (e) { if (e.status === 401) setPhase("login"); }
  };
  useEffect(() => { if (!db) return; poll(); const t = setInterval(poll, 15000); return () => clearInterval(t); }, [!!db]);
  const reset = () => { cursor.current = null; poll(); };
  const markRead = async () => { const top = events[0] ? events[0].id : 0; setLastSeen(top); try { await api("/api/events/seen", { id: top }); } catch { /* ignore */ } };
  return { events, popups, lastSeen, markRead, closePopup: id => setPopups(pp => pp.filter(x => x.id !== id)), settings, openSettings: () => setSettings(true), closeSettings: () => setSettings(false), reset };
}

function BellMenu({ notif }) {
  const [open, setOpen] = useState(false);
  const unread = notif.events.filter(e => e.id > notif.lastSeen).length;
  return (
    <div className="acct">
      <button className="bell" onClick={() => setOpen(!open)} aria-label={`Notifications, ${unread} unread`} aria-expanded={open}>
        <Bell size={19} />{unread > 0 && <span className="dot">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && <div className="menu notes">
        <div className="noteshead"><b>Notifications</b>{unread > 0 && <button className="btn small" onClick={notif.markRead}>Mark All as Read</button>}</div>
        {notif.events.length === 0 ? <p className="muted" style={{ padding: "8px 12px", margin: 0 }}>No notifications yet. Choose which ones you receive in Notification Settings.</p> :
          notif.events.map(e => <div key={e.id} className={"note" + (e.id > notif.lastSeen ? " unread" : "")}>
            <span className={"tag" + noteTag(e.type)}>{noteLabel(e.type)}</span><div>{e.text}</div><small>{e.at}</small></div>)}
        <button onClick={() => { setOpen(false); notif.openSettings(); }}><Bell size={16} /> Notification Settings</button>
      </div>}
    </div>
  );
}

function Popups({ notif }) {
  return <div className="popups" aria-live="polite">{notif.popups.map(e => (
    <div key={e.id} className={"popup pop" + noteTag(e.type)}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}><span className={"tag" + noteTag(e.type)}>{noteLabel(e.type)}</span>
        <button className="x" onClick={() => notif.closePopup(e.id)} aria-label="Dismiss"><X size={16} /></button></div>
      <div className="ptext">{e.text}</div><small>{e.at}</small>
    </div>))}</div>;
}

function NotifySettings({ db, act, notif }) {
  const [p, setP] = useState({ ...db.me.notify }); const [msg, setMsg] = useState("");
  const toggle = k => setP({ ...p, [k]: !p[k] });
  const toggleDevice = async () => {
    if (p.device) return setP({ ...p, device: false });
    if (!deviceNotesSupported()) return setMsg("This browser can only show pop-ups inside Haazir. Device notifications need the secure online version of Haazir, which comes with the online setup, or Haazir opened on this computer at localhost.");
    const perm = await Notification.requestPermission();
    if (perm === "granted") { setP({ ...p, device: true }); setMsg(""); } else setMsg("Notifications are blocked for Haazir in this browser. Allow them in the browser's site settings, then try again.");
  };
  const save = async () => { if (await act("/api/notify/prefs", { ...p, sound: p.sound !== false }, setMsg)) { notif.closeSettings(); notif.reset(); } };
  return (
    <div className="modalwrap" role="dialog" aria-modal="true" aria-labelledby="nstitle" onClick={e => { if (e.target === e.currentTarget) notif.closeSettings(); }}>
      <div className="modal">
        <h2 id="nstitle">Notification Settings</h2>
        <p className="muted">Choose which pop-ups you receive. These settings apply to your account only.</p>
        {NOTE_TYPES.map(([k, t, d]) => <label key={k} className="switchrow"><span><b>{t}</b><small>{d}</small></span>
          <input type="checkbox" className="switch" checked={p[k] !== false && (p[k] !== undefined || k === "pinreset" || k === "early")} onChange={() => setP({ ...p, [k]: !(p[k] !== false && (p[k] !== undefined || k === "pinreset" || k === "early")) })} /></label>)}
        <label className="switchrow"><span><b>Notification Tone</b><small>Play a short tone when a new notification arrives.</small></span>
          <input type="checkbox" className="switch" checked={p.sound !== false} onChange={() => setP({ ...p, sound: p.sound === false })} /></label>
        <label className="switchrow"><span><b>Device Notifications</b><small>Also show notifications on this device while Haazir is open in the background.</small></span>
          <input type="checkbox" className="switch" checked={!!p.device} onChange={toggleDevice} /></label>
        {msg && <div className="notice" style={{ marginTop: 10 }}>{msg}</div>}
        <div className="row" style={{ marginTop: 16, justifyContent: "flex-end" }}><button className="btn" onClick={notif.closeSettings}>Cancel</button><button className="btn primary" onClick={save}>Save Settings</button></div>
      </div>
    </div>
  );
}

/* ---------- backup and restore ---------- */
async function pickFromApp() {
  const [name, data, err] = await askApp({ type: "pick" }, "hzAppPicked");
  if (err) throw new Error(err);
  return name ? { name, blob: base64ToBlob(data) } : null;
}
const sizeText = n => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;
function BackupPage() {
  const [list, setList] = useState(null); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false); const [file, setFile] = useState(null);
  const [note, setNote] = useState(""); const app = inAndroidApp();
  const load = async () => { try { setList(await api("/api/backups")); } catch (e) { setErr(e.message); } };
  useEffect(() => { load(); }, []);
  const download = async path => {
    setErr(""); setNote("");
    try { if (await downloadFile(path, "haazir-backup.json")) setNote(app ? "Backup saved on this phone." : "Backup downloaded. Keep the file somewhere safe."); load(); } catch (e) { setErr(e.message); }
  };
  const choose = async () => { setErr(""); try { const f = await pickFromApp(); if (f) setFile(f); } catch (e) { setErr(e.message); } };
  const warning = "All current Haazir data will be replaced by this backup. A \"Before restore\" copy of the current data is saved first, so this can be undone. Everyone will need to sign in again.";
  const finish = () => { setBusy(false); alert("The backup has been restored. Please sign in again."); location.reload(); };
  const restoreFile = async () => {
    if (!file) return setErr("Choose a backup file first.");
    if (!confirm(`Restore "${file.name}"?\n\n${warning}`)) return;
    setBusy(true); setErr("");
    try { await apiUpload("/api/backup/restore", file.blob || file); finish(); }
    catch (e) { setErr(e.message); setBusy(false); }
  };
  const restoreSaved = async b => {
    if (!confirm(`Restore the ${b.kind.toLowerCase()} backup from ${b.at}?\n\n${warning}`)) return;
    setBusy(true); setErr("");
    try { await api("/api/backup/restore-saved", { name: b.name }); finish(); } catch (e) { setErr(e.message); setBusy(false); }
  };
  if (busy) return (
    <>
      <h1>Backup & Restore</h1>
      <div className="panel"><h2>Restoring Backup</h2><p>Haazir is restoring the backup. Please wait and keep this page open.</p></div>
    </>
  );
  return (
    <>
      <h1>Backup & Restore</h1>
      <p className="sub">Haazir saves a backup automatically every day. Download a copy regularly and keep it somewhere safe, such as Google Drive or a USB drive.</p>
      {err && <div className="notice" style={{ marginBottom: 16 }}>{err}</div>}
      {note && <div className="sheet ok" style={{ marginBottom: 16, flexDirection: "row", textAlign: "left" }}><Check size={18} color="#00661A" />{note}</div>}
      <div className="panel">
        <h2>Download a Backup</h2>
        <p>Saves a complete copy of all Haazir data: employees, attendance, payroll settings, admins and the audit log. Ideally do this once a week.</p>
        <button className="btn primary" onClick={() => download("/api/backup/download")}><Download size={16} /> Download Backup</button>
        {app && <p className="muted" style={{ marginTop: 10, fontSize: 13 }}>Your phone asks where to save it. Choose Google Drive or a folder such as Downloads.</p>}
      </div>
      <div className="panel">
        <h2>Restore from a File</h2>
        <p>Choose a backup file you downloaded earlier.</p>
        <div className="row" style={{ alignItems: "center" }}>
          {app ? <><button className="btn" onClick={choose}><Upload size={16} /> Choose Backup File</button><span className="muted">{file ? file.name : "No file chosen"}</span></>
            : <input type="file" accept=".json,application/json" onChange={e => { setFile(e.target.files[0] || null); setErr(""); }} style={{ maxWidth: 360 }} />}
          <button className="btn danger" onClick={restoreFile} disabled={!file}><Upload size={16} /> Restore This Backup</button>
        </div>
        <div className="notice" style={{ marginTop: 12 }}>Restoring replaces all current data with the backup. A safety copy of the current data is saved first.</div>
      </div>
      <div className="panel">
        <h2>Saved Backups</h2>
        {list === null ? <p className="muted">Loading…</p> : list.length === 0 ? <p className="muted">No saved backups yet. The first one is made automatically today.</p> :
          <table className="t"><thead><tr><th>Date</th><th>Type</th><th className="r">Size</th><th></th></tr></thead>
            <tbody>{list.map(b => <tr key={b.name}><td className="nw">{b.at}</td><td><span className={"tag" + (b.kind === "Daily" ? " grey" : " amber")}>{b.kind}</span></td><td className="r nw">{sizeText(b.size)}</td>
              <td className="r"><div className="row" style={{ justifyContent: "flex-end" }}>
                <button className="btn small" onClick={() => download("/api/backups/file?name=" + encodeURIComponent(b.name))}><Download size={14} /> Download</button>
                <button className="btn small danger" onClick={() => restoreSaved(b)}>Restore</button></div></td></tr>)}</tbody></table>}
        <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>Daily backups are kept for 30 days. "Before restore" copies are kept until you restore over them.</p>
      </div>
    </>
  );
}

function Updates({ db }) {
  const cronOk = db.cron === "ok";
  return (
    <>
      <h1>App Updates</h1>
      <p className="sub">Haazir runs online on Supabase and GitHub Pages. New versions are installed automatically when they are published to Haazir's GitHub repository.</p>
      <div className="stats">
        <div className="stat"><span>Installed version</span><b>{db.version}</b><small>Haazir for eco Pharmacy</small></div>
        <div className="stat"><span>Automatic checks</span><b>{cronOk ? "Running" : "Limited"}</b><small>{cronOk ? "Absence alerts and daily backups run every minute." : "They run whenever Haazir is in use."}</small></div>
      </div>
      <div className="panel">
        <h2>How to Install an Update</h2>
        <ol style={{ margin: 0, paddingLeft: 20 }}>
          <li>You receive the new Haazir files.</li>
          <li>On GitHub, open the <b>haazir-online</b> repository, choose <b>Add file → Upload files</b>, drag the new files in, and click <b>Commit changes</b>.</li>
          <li>GitHub updates Haazir automatically within about 3 minutes. Open pages show a <b>Reload</b> button when the new version is ready.</li>
        </ol>
        {!cronOk && db.cron && <p className="muted" style={{ marginTop: 12, fontSize: 13 }}>Automatic checks could not be switched on: {db.cron}</p>}
      </div>
    </>
  );
}

/* ---------- account, sign-in and app root ---------- */
function AccountMenu({ db, act, onSignOut, onSettings }) {
  const [open, setOpen] = useState(false);
  const initials = db.me.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  const changePassword = async () => {
    setOpen(false);
    const current = prompt("Current password:"); if (!current) return;
    const next = prompt("New password (at least 8 characters):"); if (!next) return;
    if (await act("/api/password", { current, next })) alert("Your password has been changed.");
  };
  return (
    <div className="acct">
      <button className="userchip" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="avatar">{initials}</span><span><b>{db.me.name}</b><small>{db.me.role}</small></span>
      </button>
      {open && <div className="menu">
        <button onClick={() => { setOpen(false); onSettings(); }}><Bell size={16} /> Notification Settings</button>
        <button onClick={changePassword}><KeyRound size={16} /> Change Password</button>
        <button onClick={onSignOut}><LogOut size={16} /> Sign Out</button>
      </div>}
    </div>
  );
}

function AuthCard({ title, text, children }) {
  return (
    <div className="pa authwrap">
      <div className="authcard">
        <div className="brand"><img src={LOGO} alt="" /><span className="wordmark"><b>Haazir</b><small><span className="eco">eco</span> Pharmacy Staff Attendance</small></span></div>
        <h1>{title}</h1>{text && <p>{text}</p>}
        {children}
        <Copyright />
      </div>
    </div>
  );
}

function Setup({ onDone }) {
  const [f, setF] = useState({ name: "", username: "", password: "", confirm: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault();
    if (f.password !== f.confirm) return setErr("The passwords do not match.");
    setBusy(true);
    try { const r = await api("/api/setup", { name: f.name, username: f.username, password: f.password }); localStorage.setItem("hz_token", r.token); onDone(); }
    catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <AuthCard title="Welcome to Haazir" text="Create the owner account. This account is the super admin and can manage everything, including other admins.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="field"><label>Your name</label><input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} autoComplete="name" /></div>
        <div className="field"><label>Username</label><input value={f.username} onChange={e => setF({ ...f, username: e.target.value })} autoComplete="username" autoCapitalize="none" /></div>
        <div className="field"><label>Password (at least 8 characters)</label><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} autoComplete="new-password" /></div>
        <div className="field"><label>Confirm password</label><input type="password" value={f.confirm} onChange={e => setF({ ...f, confirm: e.target.value })} autoComplete="new-password" /></div>
        {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
        <button className="btn primary block" disabled={busy}>Create Owner Account</button>
      </form>
    </AuthCard>
  );
}

function Login({ onDone }) {
  const [f, setF] = useState({ username: "", password: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault(); setBusy(true);
    try { const r = await api("/api/login", f); localStorage.setItem("hz_token", r.token); onDone(); } catch (x) { setErr(x.message); setBusy(false); }
  };
  return (
    <AuthCard title="Sign In" text="For admins and super admins.">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="field"><label>Username</label><input value={f.username} onChange={e => setF({ ...f, username: e.target.value })} autoComplete="username" autoCapitalize="none" /></div>
        <div className="field"><label>Password</label><input type="password" value={f.password} onChange={e => setF({ ...f, password: e.target.value })} autoComplete="current-password" /></div>
        {err && <div className="err" style={{ marginTop: 0 }}>{err}</div>}
        <button className="btn primary block" disabled={busy}>Sign In</button>
      </form>
    </AuthCard>
  );
}

function AdminApp() {
  const [phase, setPhase] = useState("loading"); // loading | setup | login | ready
  const [db, setDb] = useState(null);
  const [toast, showToast] = useToast();
  const load = async () => {
    try {
      const data = await api("/api/state");
      const first = data.employees.map(e => e.joined).sort()[0];
      setClock(data.today, first, data.trackingStart); setRules(data.rules);
      setDb(data); setPhase("ready");
    } catch (e) {
      if (e.status === 401) {
        try { const s = await api("/api/setup"); setPhase(s.needsSetup ? "setup" : "login"); } catch (x) { showToast(x.message, true); setPhase("login"); }
      } else { showToast(e.message, true); if (!db) setPhase("login"); }
    }
  };
  useEffect(() => { load(); const t = setInterval(() => { if (document.visibilityState === "visible") load(); }, 60000); return () => clearInterval(t); }, []);
  // Run a change on the server, then reload. Errors go to the form (setErr) or a message at the bottom.
  const act = async (path, body, setErr) => {
    try { await api(path, body); await load(); return true; }
    catch (e) { if (e.status === 401) { setPhase("login"); return false; } if (setErr) setErr(e.message); else showToast(e.message, true); return false; }
  };
  const signOut = async () => { try { await api("/api/logout", {}); } catch { /* ignore */ } localStorage.removeItem("hz_token"); setDb(null); setPhase("login"); };
  const notif = useNotifications(phase === "ready" ? db : null, setPhase, () => load());
  const serverVersion = useServerVersion();
  return (
    <>
      <style>{CSS}</style>
      {phase === "loading" && <div className="pa loading">Loading Haazir…</div>}
      {phase === "setup" && <Setup onDone={load} />}
      {phase === "login" && <Login onDone={load} />}
      {phase === "ready" && db && <div className="pa"><AdminView db={db} act={act} reload={load} onSignOut={signOut} notif={notif} serverVersion={serverVersion} />
        <Popups notif={notif} />{notif.settings && <NotifySettings db={db} act={act} notif={notif} />}</div>}
      <Toast toast={toast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AdminApp />);
