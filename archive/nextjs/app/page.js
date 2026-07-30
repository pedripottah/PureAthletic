"use client";

import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "pureathletic-prototype-v1";

const initialPlan = [
  { id: "tue", day: "TODAY · TUE 28", type: "Strength", title: "Lower-body foundation", duration: 45, intensity: "Moderate", status: "Planned", fixed: false },
  { id: "wed", day: "WED 29", type: "Rest", title: "Full rest", duration: 0, intensity: "Easy", status: "Rest", fixed: false },
  { id: "thu", day: "THU 30", type: "Team practice", title: "Team training", duration: 90, intensity: "Team-led", status: "Fixed", fixed: true, time: "19:00" },
  { id: "fri", day: "FRI 31", type: "Recovery", title: "Mobility reset", duration: 20, intensity: "Easy", status: "Recovery", fixed: false },
  { id: "sat", day: "SAT 1", type: "Match", title: "League match", duration: 90, intensity: "Match", status: "Fixed", fixed: true, time: "15:00" },
  { id: "sun", day: "SUN 2", type: "Recovery", title: "Post-match recovery", duration: 25, intensity: "Easy", status: "Recovery", fixed: false },
  { id: "mon", day: "MON 3", type: "Speed", title: "Acceleration quality", duration: 35, intensity: "Moderate", status: "Planned", fixed: false },
];

const demoState = {
  onboarded: true,
  user: {
    name: "Sam",
    ageConfirmed: true,
    disclaimerAccepted: true,
    position: "Midfielder",
    experience: "Intermediate",
    goal: "Match readiness",
    availability: ["Monday", "Wednesday", "Friday", "Sunday"],
    equipment: ["Bodyweight", "Resistance bands", "Field or open space"],
  },
  checkInDone: false,
  recommendation: {
    id: "tue",
    type: "Strength",
    title: "Lower-body foundation",
    duration: 45,
    intensity: "Moderate",
    status: "Planned",
    purpose: "Build useful lower-body strength with enough recovery before Saturday’s match.",
  },
  plan: initialPlan,
  activities: [
    { id: 1, title: "Speed mechanics", status: "Completed", duration: 35, effort: 6, date: "Mon 27" },
    { id: 2, title: "Mobility reset", status: "Modified", duration: 18, effort: 3, date: "Sun 26" },
  ],
  adjustments: [],
  schedule: {
    practiceDay: "Thursday",
    practiceTime: "19:00",
    matchDay: "Saturday",
    matchTime: "15:00",
  },
};

const onboardingSeed = {
  onboarded: false,
  user: {
    name: "",
    ageConfirmed: false,
    disclaimerAccepted: false,
    position: "Midfielder",
    experience: "Beginner",
    goal: "Match readiness",
    availability: ["Monday", "Wednesday", "Friday"],
    equipment: ["Bodyweight"],
  },
  checkInDone: false,
  recommendation: demoState.recommendation,
  plan: initialPlan,
  activities: [],
  adjustments: [],
  schedule: demoState.schedule,
};

function Icon({ name, size = 20 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  const icons = {
    bolt: <><path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" /></>,
    today: <><circle cx="12" cy="12" r="8" /><path d="m12 7 1.5 4 3.5 1.5-3.5 1.5-1.5 4-1.5-4L7 12.5l3.5-1.5L12 7Z" /></>,
    week: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    progress: <><path d="M4 19V9M10 19V5M16 19v-7M22 19H2" /></>,
    profile: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    arrow: <><path d="m9 18 6-6-6-6" /></>,
    back: <><path d="m15 18-6-6 6-6" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /><path d="m9 12 2 2 4-4" /></>,
    check: <><path d="m5 12 4 4L19 6" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    refresh: <><path d="M20 7h-6V1" /><path d="M20 7a9 9 0 1 0 1 8" /></>,
    alert: <><path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z" /><path d="M12 9v4M12 17h.01" /></>,
    download: <><path d="M12 3v12M7 10l5 5 5-5M5 21h14" /></>,
    trash: <><path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14" /></>,
  };
  return <svg {...common}>{icons[name] || icons.bolt}</svg>;
}

function Button({ children, variant = "primary", icon, className = "", ...props }) {
  return (
    <button className={`button button-${variant} ${className}`} {...props}>
      {icon && <Icon name={icon} size={18} />}
      <span>{children}</span>
    </button>
  );
}

function Brand() {
  return (
    <div className="brand">
      <span className="brand-mark"><Icon name="bolt" size={18} /></span>
      <span>PureAthletic</span>
    </div>
  );
}

function Pill({ children, tone = "neutral" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function Landing({ onStart, onDemo }) {
  return (
    <main className="landing">
      <header className="landing-header">
        <Brand />
        <button className="text-button" onClick={onDemo}>Explore demo</button>
      </header>
      <section className="hero">
        <div className="hero-copy">
          <Pill tone="lime">Built around your football week</Pill>
          <h1>Train for what<br />comes next.</h1>
          <p>Get a clear seven-day plan that adapts to your schedule, your activity, and how ready you feel today.</p>
          <div className="hero-actions">
            <Button onClick={onStart}>Create my plan <span aria-hidden="true">→</span></Button>
            <Button variant="secondary" onClick={onDemo}>View seeded demo</Button>
          </div>
          <div className="trust-row">
            <span><Icon name="check" size={16} /> Practices & matches stay fixed</span>
            <span><Icon name="check" size={16} /> Every change is explained</span>
          </div>
        </div>
        <div className="hero-preview" aria-label="Preview of today's recommendation">
          <div className="preview-top"><span>Today</span><span>Tue 28</span></div>
          <div className="preview-card">
            <span className="eyebrow">TODAY’S RECOMMENDATION</span>
            <div className="preview-icon"><Icon name="bolt" size={24} /></div>
            <Pill tone="lime">Strength</Pill>
            <h2>Lower-body<br />foundation</h2>
            <p>45 min · Moderate</p>
            <div className="preview-button">Complete check-in</div>
          </div>
          <div className="preview-next">
            <span className="eyebrow">UP NEXT</span>
            <strong>Team practice</strong>
            <span>Thursday · 19:00</span>
          </div>
        </div>
      </section>
      <footer className="landing-footer">
        <span>General training guidance for adults aged 18 or older.</span>
        <span>Prototype · No medical diagnosis</span>
      </footer>
    </main>
  );
}

function Onboarding({ onComplete, onExit }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(onboardingSeed.user);
  const [schedule, setSchedule] = useState(demoState.schedule);
  const total = 5;

  function next() {
    if (step < total) setStep(step + 1);
    else onComplete({ ...form, name: form.name.trim() || "Sam" }, schedule);
  }

  const canContinue = step !== 1 || (form.ageConfirmed && form.disclaimerAccepted);

  return (
    <main className="focused-page">
      <header className="focused-header">
        <button className="icon-button" onClick={step === 1 ? onExit : () => setStep(step - 1)} aria-label="Back"><Icon name="back" /></button>
        <Brand />
        <button className="text-button" onClick={onExit}>Exit</button>
      </header>
      <section className="form-shell">
        <div className="progress-meta"><span>STEP {step} OF {total}</span><span>{Math.round((step / total) * 100)}%</span></div>
        <div className="progress-track"><span style={{ width: `${(step / total) * 100}%` }} /></div>

        {step === 1 && (
          <div className="step-panel">
            <span className="section-kicker">BEFORE WE BEGIN</span>
            <h1>Let’s keep this useful and safe.</h1>
            <p className="lead">PureAthletic provides general training guidance. It does not diagnose injury, provide treatment, or replace a qualified professional.</p>
            <label className="check-card">
              <input type="checkbox" checked={form.ageConfirmed} onChange={(e) => setForm({ ...form, ageConfirmed: e.target.checked })} />
              <span><strong>I confirm I am 18 or older</strong><small>The first prototype is limited to adult athletes.</small></span>
            </label>
            <label className="check-card">
              <input type="checkbox" checked={form.disclaimerAccepted} onChange={(e) => setForm({ ...form, disclaimerAccepted: e.target.checked })} />
              <span><strong>I understand the guidance boundary</strong><small>Pain or injury concerns need qualified support.</small></span>
            </label>
          </div>
        )}

        {step === 2 && (
          <div className="step-panel">
            <span className="section-kicker">YOUR FOOTBALL</span>
            <h1>Tell us about your game.</h1>
            <div className="field"><label htmlFor="name">Preferred name</label><input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sam" /></div>
            <div className="field"><label htmlFor="position">Position</label><select id="position" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })}><option>Goalkeeper</option><option>Defender</option><option>Midfielder</option><option>Forward</option><option>Utility player</option></select></div>
            <div className="field"><label>Training experience</label><div className="choice-grid">{["Beginner", "Intermediate", "Advanced"].map((item) => <button key={item} className={`choice ${form.experience === item ? "selected" : ""}`} onClick={() => setForm({ ...form, experience: item })}>{item}</button>)}</div></div>
          </div>
        )}

        {step === 3 && (
          <div className="step-panel">
            <span className="section-kicker">PRIMARY GOAL</span>
            <h1>What matters most right now?</h1>
            <div className="stacked-choices">
              {[
                ["Match readiness", "Feel prepared around fixtures"],
                ["Strength", "Build force and robustness"],
                ["Speed", "Improve acceleration and pace"],
                ["Endurance", "Sustain repeated effort"],
                ["General fitness", "Build a balanced base"],
              ].map(([title, detail]) => (
                <button key={title} className={`radio-card ${form.goal === title ? "selected" : ""}`} onClick={() => setForm({ ...form, goal: title })}>
                  <span className="radio-dot" /><span><strong>{title}</strong><small>{detail}</small></span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-panel">
            <span className="section-kicker">YOUR WEEK</span>
            <h1>Add the commitments that stay fixed.</h1>
            <div className="schedule-card">
              <Pill tone="dark">TEAM PRACTICE</Pill>
              <div className="two-fields"><div className="field"><label>Day</label><select value={schedule.practiceDay} onChange={(e) => setSchedule({ ...schedule, practiceDay: e.target.value })}>{weekdays().map(day => <option key={day}>{day}</option>)}</select></div><div className="field"><label>Time</label><input type="time" value={schedule.practiceTime} onChange={(e) => setSchedule({ ...schedule, practiceTime: e.target.value })} /></div></div>
            </div>
            <div className="schedule-card">
              <Pill tone="dark">MATCH</Pill>
              <div className="two-fields"><div className="field"><label>Day</label><select value={schedule.matchDay} onChange={(e) => setSchedule({ ...schedule, matchDay: e.target.value })}>{weekdays().map(day => <option key={day}>{day}</option>)}</select></div><div className="field"><label>Time</label><input type="time" value={schedule.matchTime} onChange={(e) => setSchedule({ ...schedule, matchTime: e.target.value })} /></div></div>
            </div>
            <p className="hint"><Icon name="shield" size={17} /> These commitments will never be moved automatically.</p>
          </div>
        )}

        {step === 5 && (
          <div className="step-panel">
            <span className="section-kicker">REVIEW</span>
            <h1>Your first week is ready to build.</h1>
            <div className="review-list">
              <div><span>Athlete</span><strong>{form.name || "Sam"} · {form.position}</strong></div>
              <div><span>Primary goal</span><strong>{form.goal}</strong></div>
              <div><span>Team practice</span><strong>{schedule.practiceDay} · {schedule.practiceTime}</strong></div>
              <div><span>Match</span><strong>{schedule.matchDay} · {schedule.matchTime}</strong></div>
              <div><span>Plan shape</span><strong>2 sessions · 2 recovery/rest days</strong></div>
            </div>
            <div className="info-card"><Icon name="shield" /><div><strong>Match protection applied</strong><p>We will avoid hard lower-body work immediately before your match.</p></div></div>
          </div>
        )}

        <div className="form-actions">
          <Button onClick={next} disabled={!canContinue}>{step === total ? "Generate my plan" : "Continue"} <span aria-hidden="true">→</span></Button>
        </div>
      </section>
    </main>
  );
}

function AppShell({ children, screen, setScreen, user, onReset }) {
  const nav = [
    ["today", "today", "Today"],
    ["week", "week", "Week"],
    ["progress", "progress", "Progress"],
    ["profile", "profile", "Profile"],
  ];
  return (
    <div className="app-shell">
      <aside className="side-nav">
        <Brand />
        <nav>{nav.map(([id, icon, label]) => <button key={id} className={screen === id ? "active" : ""} onClick={() => setScreen(id)}><Icon name={icon} /><span>{label}</span></button>)}</nav>
        <div className="side-user"><span className="avatar">{user.name.slice(0, 1).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.position}</small></div><button onClick={onReset} aria-label="Reset demo"><Icon name="refresh" size={16} /></button></div>
      </aside>
      <div className="app-content">{children}</div>
      <nav className="bottom-nav">{nav.map(([id, icon, label]) => <button key={id} className={screen === id ? "active" : ""} onClick={() => setScreen(id)}><Icon name={icon} /><span>{label}</span></button>)}</nav>
    </div>
  );
}

function ScreenHeader({ eyebrow, title, action }) {
  return <header className="screen-header"><div><span className="screen-eyebrow">{eyebrow}</span><h1>{title}</h1></div>{action}</header>;
}

function Today({ data, setScreen, onOpenLog }) {
  const rec = data.recommendation;
  const safety = rec.status === "Safety";
  return (
    <main className="screen">
      <ScreenHeader eyebrow="TUESDAY, 28 JULY" title={`Good afternoon, ${data.user.name}.`} action={<span className="readiness-dot">{data.checkInDone ? "Check-in done" : "Check-in due"}</span>} />
      <div className="dashboard-grid">
        <section className={`recommendation-card ${safety ? "safety-card" : ""}`}>
          <div className="card-topline"><span className="eyebrow">{safety ? "SAFETY GUIDANCE" : "TODAY’S RECOMMENDATION"}</span><Pill tone={safety ? "warning" : "lime"}>{rec.status}</Pill></div>
          <div className="recommendation-icon"><Icon name={safety ? "alert" : rec.type === "Recovery" ? "shield" : "bolt"} size={28} /></div>
          <span className="session-type">{rec.type}</span>
          <h2>{rec.title}</h2>
          {!safety && <div className="session-meta"><span><Icon name="clock" size={17} /> {rec.duration} min</span><span>{rec.intensity}</span></div>}
          <p>{rec.purpose}</p>
          {!data.checkInDone && !safety ? (
            <Button onClick={() => setScreen("checkin")}>Complete check-in <span aria-hidden="true">→</span></Button>
          ) : safety ? (
            <Button variant="light" onClick={() => setScreen("safety")}>Review guidance</Button>
          ) : (
            <div className="button-row"><Button onClick={() => setScreen("workout")}>Start workout</Button><Button variant="light" onClick={() => setScreen("short-workout")}>25-min version</Button></div>
          )}
        </section>
        <div className="dashboard-side">
          <section className="plain-card explanation">
            <span className="eyebrow">WHY THIS TODAY?</span>
            <p>{safety ? "Safety rules take priority over the weekly goal and cannot be bypassed." : data.checkInDone ? "Your check-in supports this session, and it fits the clearest strength window before Saturday’s match." : "Check in first so the session can respond to today’s sleep, energy, soreness, stress, and pain."}</p>
          </section>
          <section className="plain-card next-card">
            <div><span className="eyebrow">NEXT FIXED COMMITMENT</span><h3>Team practice</h3><p>{data.schedule.practiceDay} · {data.schedule.practiceTime} · 90 min</p></div>
            <span className="round-icon"><Icon name="week" /></span>
          </section>
          <section className="plain-card progress-mini">
            <span className="eyebrow">THIS WEEK</span>
            <div className="big-number">{data.activities.length}<small> activities logged</small></div>
            <div className="mini-track"><span style={{ width: `${Math.min(100, data.activities.length * 24)}%` }} /></div>
          </section>
          <button className="log-another" onClick={onOpenLog}><Icon name="plus" /> Log another activity</button>
        </div>
      </div>
    </main>
  );
}

function CheckIn({ onBack, onSubmit }) {
  const [form, setForm] = useState({ sleep: 3, energy: 3, soreness: 2, stress: 2, pain: "None" });
  const scales = [["sleep", "Sleep quality", "Poor", "Great"], ["energy", "Energy", "Low", "High"], ["soreness", "Muscle soreness", "None", "Severe"], ["stress", "Stress", "Low", "High"]];
  return (
    <main className="focused-page checkin-page">
      <header className="focused-header"><button className="icon-button" onClick={onBack} aria-label="Back to Today"><Icon name="back" /></button><span className="focused-title">Daily check-in</span><span className="time-hint">~30 sec</span></header>
      <section className="checkin-shell">
        <div className="checkin-intro"><Pill tone="lime">TODAY</Pill><h1>How ready do you feel?</h1><p>There are no good or bad answers. This helps shape the most appropriate next step.</p></div>
        <div className="checkin-card">
          {scales.map(([key, label, low, high]) => (
            <div className="scale-field" key={key}>
              <div className="scale-label"><label>{label}</label><strong>{form[key]} / 5</strong></div>
              <div className="scale-buttons">{[1, 2, 3, 4, 5].map((value) => <button key={value} className={form[key] === value ? "selected" : ""} onClick={() => setForm({ ...form, [key]: value })}>{value}</button>)}</div>
              <div className="scale-ends"><span>{low}</span><span>{high}</span></div>
            </div>
          ))}
          <div className="pain-field">
            <div className="scale-label"><label>Pain today</label><Icon name="shield" size={18} /></div>
            <div className="pain-options">{["None", "Mild", "Moderate", "Severe"].map((pain) => <button key={pain} className={`${form.pain === pain ? "selected" : ""} ${pain === "Moderate" || pain === "Severe" ? "caution" : ""}`} onClick={() => setForm({ ...form, pain })}>{pain}</button>)}</div>
            {(form.pain === "Moderate" || form.pain === "Severe") && <p className="inline-warning"><Icon name="alert" size={17} /> This will replace intense optional training with conservative safety guidance.</p>}
          </div>
          <Button onClick={() => onSubmit(form)} className="full">Save check-in <span aria-hidden="true">→</span></Button>
        </div>
      </section>
    </main>
  );
}

function Outcome({ kind, data, onContinue }) {
  const pain = kind === "moderate" || kind === "severe";
  const copy = kind === "poor" ? {
    kicker: "RECOMMENDATION UPDATED", title: "A lighter day fits better.", body: "Today’s low sleep and energy make recovery the more appropriate choice before team practice.", before: "45-min strength", after: "20-min mobility + recovery",
  } : kind === "moderate" ? {
    kicker: "SAFETY ACTION", title: "Intense training removed.", body: "You reported moderate pain. PureAthletic cannot assess an injury or tell you when it is safe to return.", before: "45-min strength", after: "Conservative guidance",
  } : kind === "severe" ? {
    kicker: "STOP TRAINING", title: "Seek qualified advice.", body: "You reported severe pain. Stop training and seek advice from a qualified healthcare or sports professional.", before: "45-min strength", after: "No workout recommended",
  } : {
    kicker: "CHECK-IN SAVED", title: "Today’s plan still fits.", body: "Your readiness supports the planned session and no safety rule was triggered.", before: null, after: null,
  };
  return (
    <main className={`outcome-page ${pain ? "outcome-safety" : ""}`}>
      <div className="outcome-card">
        <span className={`outcome-icon ${pain ? "warning" : ""}`}><Icon name={pain ? "alert" : "check"} size={28} /></span>
        <span className="section-kicker">{copy.kicker}</span>
        <h1>{copy.title}</h1>
        <p>{copy.body}</p>
        {copy.before && <div className="change-block"><div><small>BEFORE</small><strong>{copy.before}</strong></div><span>↓</span><div><small>NOW</small><strong>{copy.after}</strong></div></div>}
        {pain && <div className="boundary-note"><Icon name="shield" /><p>Team commitments remain visible, but their presence is not clearance to participate. Safety actions cannot be directly undone.</p></div>}
        <Button onClick={onContinue}>{pain ? "Return to Today" : kind === "good" ? "View workout" : "View updated Today"}</Button>
      </div>
    </main>
  );
}

const exercises = [
  { name: "Dynamic movement series", detail: "8 min warm-up" },
  { name: "Split squat", detail: "3 × 8 each side" },
  { name: "Hip hinge", detail: "3 × 10" },
  { name: "Calf raise", detail: "3 × 12" },
  { name: "Trunk + mobility", detail: "9 min finish" },
];

function Workout({ short = false, onBack, onLog }) {
  const shown = short ? exercises.slice(0, 4) : exercises;
  const [done, setDone] = useState([]);
  return (
    <main className="focused-page workout-page">
      <header className="focused-header"><button className="icon-button" onClick={onBack} aria-label="Back"><Icon name="back" /></button><span className="focused-title">{short ? "Shorter workout" : "Workout detail"}</span><Pill>{short ? "25 MIN" : "45 MIN"}</Pill></header>
      <section className="workout-shell">
        <div className="workout-hero">
          <div><Pill tone="lime">STRENGTH</Pill><h1>{short ? "Lower-body essentials" : "Lower-body foundation"}</h1><p>{short ? "The essential work, kept focused for a tighter day." : "Build useful lower-body strength with enough recovery before Saturday’s match."}</p></div>
          <div className="difficulty"><span>DIFFICULTY</span><strong>Moderate</strong><div><i /><i /><i className="muted" /><i className="muted" /></div></div>
        </div>
        <div className="exercise-list">
          {shown.map((exercise, index) => (
            <button key={exercise.name} className={`exercise-row ${done.includes(index) ? "done" : ""}`} onClick={() => setDone(done.includes(index) ? done.filter(item => item !== index) : [...done, index])}>
              <span className="exercise-number">{done.includes(index) ? <Icon name="check" size={17} /> : String(index + 1).padStart(2, "0")}</span>
              <span><strong>{exercise.name}</strong><small>{exercise.detail}</small></span>
              <Icon name="arrow" />
            </button>
          ))}
        </div>
        <div className="workout-note"><Icon name="shield" /><p>Use controlled movement and stop if an exercise causes pain. Approved alternatives can be selected during the session.</p></div>
        <div className="sticky-actions"><Button onClick={() => onLog("Completed")}>Finish and log</Button><Button variant="secondary" onClick={() => onLog("Modified")}>Log modifications</Button><button className="text-button danger-text" onClick={() => onLog("Skipped")}>Skip session</button></div>
      </section>
    </main>
  );
}

function ActivityLog({ initialStatus = "Completed", unplanned = false, onBack, onSave }) {
  const [form, setForm] = useState({ type: unplanned ? "Team practice" : "Strength", status: unplanned ? "Completed" : initialStatus, duration: unplanned ? 75 : 42, effort: unplanned ? 8 : 6, pain: "None", notes: "" });
  return (
    <main className="focused-page log-page">
      <header className="focused-header"><button className="icon-button" onClick={onBack} aria-label="Back"><Icon name="back" /></button><span className="focused-title">{unplanned ? "Log another activity" : "Log your session"}</span><span /></header>
      <section className="log-shell">
        <div className="log-heading"><span className="section-kicker">{unplanned ? "UNPLANNED ACTIVITY" : "TODAY’S SESSION"}</span><h1>{unplanned ? "What did you do?" : "Lower-body foundation"}</h1></div>
        <div className="form-card">
          {unplanned && <div className="field"><label>Activity type</label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>Team practice</option><option>Match</option><option>Strength</option><option>Speed</option><option>Conditioning</option><option>Recovery</option></select></div>}
          {!unplanned && <div className="field"><label>Outcome</label><div className="segmented">{["Completed", "Modified", "Skipped"].map(status => <button key={status} className={form.status === status ? "selected" : ""} onClick={() => setForm({ ...form, status })}>{status}</button>)}</div></div>}
          {form.status !== "Skipped" && <><div className="two-fields"><div className="field"><label>Duration</label><div className="input-suffix"><input type="number" min="1" value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} /><span>min</span></div></div><div className="field"><label>Effort</label><div className="input-suffix"><input type="number" min="1" max="10" value={form.effort} onChange={(e) => setForm({ ...form, effort: Number(e.target.value) })} /><span>/ 10</span></div></div></div></>}
          <div className="field"><label>Pain during or after</label><div className="pain-options compact">{["None", "Mild", "Moderate", "Severe"].map(pain => <button key={pain} className={form.pain === pain ? "selected" : ""} onClick={() => setForm({ ...form, pain })}>{pain}</button>)}</div></div>
          <div className="field"><label htmlFor="notes">Notes <small>Optional</small></label><textarea id="notes" rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder={form.status === "Modified" ? "What did you change?" : "Anything useful to remember?"} /></div>
          {unplanned && <p className="hint"><Icon name="refresh" size={17} /> A high-load activity may change the next 24–48 hours.</p>}
          <Button className="full" onClick={() => onSave(form)}>Save activity <span aria-hidden="true">→</span></Button>
        </div>
      </section>
    </main>
  );
}

function AdjustmentPreview({ pending, onApply, onDismiss }) {
  const isSchedule = pending.kind === "schedule";
  return (
    <main className="outcome-page adjustment-page">
      <div className="adjustment-card">
        <span className="section-kicker">REVIEW PLAN CHANGES</span>
        <h1>{isSchedule ? "Your schedule changes the week." : "Recovery needs a little more room."}</h1>
        <p>{isSchedule ? `Your ${pending.schedule.matchDay} match stays fixed. We adjusted optional work around it.` : "The high-effort team session you logged increases today’s load. Fixed commitments remain unchanged."}</p>
        <div className="change-comparison">
          <div><small>{isSchedule ? "BEFORE" : "WED 29"}</small><Pill>{isSchedule ? "SATURDAY MATCH" : "PLANNED"}</Pill><h3>{isSchedule ? "Match · Saturday" : "Conditioning"}</h3><span>{isSchedule ? "15:00" : "35 min · Moderate"}</span></div>
          <span className="change-arrow">→</span>
          <div className="new"><small>{isSchedule ? "AFTER" : "WED 29"}</small><Pill tone="lime">{isSchedule ? `${pending.schedule.matchDay.toUpperCase()} MATCH` : "RECOVERY"}</Pill><h3>{isSchedule ? `Match · ${pending.schedule.matchDay}` : "Mobility reset"}</h3><span>{isSchedule ? pending.schedule.matchTime : "20 min · Easy"}</span></div>
        </div>
        <div className="reason-box"><span className="round-icon"><Icon name="shield" /></span><div><strong>Why this changed</strong><p>{isSchedule ? "Optional lower-body work is kept away from the updated match day." : "This avoids consecutive high-load days while preserving team practice and the match."}</p></div></div>
        <div className="button-row"><Button onClick={onApply}>Apply changes</Button><Button variant="secondary" onClick={onDismiss}>Keep current plan</Button></div>
      </div>
    </main>
  );
}

function Week({ plan, onOpenWorkout }) {
  return (
    <main className="screen">
      <ScreenHeader eyebrow="ROLLING PLAN" title="Your next 7 days" action={<button className="date-control">28 Jul — 3 Aug</button>} />
      <section className="week-card">
        <div className="week-summary"><div><span className="eyebrow">WEEK SHAPE</span><strong>2 focused sessions</strong><p>with protected recovery around your match</p></div><div className="load-bars" aria-label="Training load preview">{[2, 1, 4, 1, 5, 1, 3].map((height, i) => <span key={i} style={{ height: `${height * 11}px` }} className={i === 4 ? "match" : ""} />)}</div></div>
        <div className="plan-list">
          {plan.map((item) => (
            <button key={item.id} className="plan-row" onClick={() => !item.fixed && item.type !== "Rest" && onOpenWorkout(item)}>
              <span className={`day-dot ${item.fixed ? "fixed" : item.type.toLowerCase()}`} />
              <span className="plan-day">{item.day}</span>
              <span className="plan-main"><strong>{item.title}</strong><small>{item.time ? `${item.time} · ` : ""}{item.duration ? `${item.duration} min · ` : ""}{item.intensity}</small></span>
              <Pill tone={item.fixed ? "dark" : item.type === "Recovery" ? "lime" : "neutral"}>{item.fixed ? item.type.toUpperCase() : item.status.toUpperCase()}</Pill>
              {!item.fixed && item.type !== "Rest" && <Icon name="arrow" size={18} />}
            </button>
          ))}
        </div>
        <div className="week-legend"><span><i className="legend-fixed" /> Fixed team commitment</span><span><i className="legend-plan" /> PureAthletic recommendation</span></div>
      </section>
    </main>
  );
}

function Progress({ data }) {
  const completed = data.activities.filter(a => a.status === "Completed").length;
  const modified = data.activities.filter(a => a.status === "Modified").length;
  const minutes = data.activities.reduce((sum, a) => sum + Number(a.duration || 0), 0);
  const loads = data.activities.slice(-5).map(a => Math.min(100, Math.round((a.duration * a.effort) / 8)));
  return (
    <main className="screen">
      <ScreenHeader eyebrow="21 — 27 JULY" title="Your week, in context." action={<button className="date-control">Previous week</button>} />
      {data.activities.length === 0 ? (
        <section className="empty-state"><span className="empty-icon"><Icon name="progress" size={32} /></span><h2>Your first review is taking shape.</h2><p>Log a few sessions and check-ins. After seven days, useful patterns will appear here.</p></section>
      ) : (
        <div className="progress-layout">
          <section className="stat-card accent-stat"><span className="eyebrow">APPROPRIATE CONSISTENCY</span><div className="stat-main"><strong>{completed + modified}</strong><span>sessions completed<br />or modified</span></div><p>Rest and recovery count when they are the appropriate recommendation.</p></section>
          <section className="stat-card"><span className="eyebrow">TRAINING TIME</span><div className="stat-main"><strong>{minutes}</strong><span>minutes<br />logged</span></div><div className="trend-bars">{[34, 52, 46, 66, ...loads].slice(-7).map((h, i) => <i key={i} style={{ height: `${Math.max(12, h)}%` }} />)}</div></section>
          <section className="stat-card"><span className="eyebrow">SESSION OUTCOMES</span><div className="donut-row"><div className="donut" style={{ "--complete": `${Math.max(15, (completed / data.activities.length) * 100)}%` }}><span>{data.activities.length}</span></div><div className="donut-legend"><span><i className="complete" /> Completed <strong>{completed}</strong></span><span><i className="modified" /> Modified <strong>{modified}</strong></span><span><i className="other" /> Other <strong>{data.activities.length - completed - modified}</strong></span></div></div></section>
          <section className="stat-card wide-stat"><div><span className="eyebrow">NOTABLE THIS WEEK</span><h2>You made the plan fit real life.</h2><p>{data.adjustments.length ? "The week adapted after new activity while keeping your team commitments fixed." : "Your logged sessions are starting to create a clearer picture of the week."}</p></div><span className="achievement"><Icon name="bolt" size={28} /></span></section>
        </div>
      )}
    </main>
  );
}

function Profile({ data, onEditSchedule, onExport, onDelete, onReset }) {
  const [notifications, setNotifications] = useState(true);
  return (
    <main className="screen">
      <ScreenHeader eyebrow="ATHLETE PROFILE" title="Your setup" />
      <div className="profile-grid">
        <section className="profile-card">
          <div className="profile-identity"><span className="large-avatar">{data.user.name.slice(0, 1).toUpperCase()}</span><div><h2>{data.user.name}</h2><p>{data.user.position} · {data.user.experience}</p><Pill tone="lime">{data.user.goal.toUpperCase()}</Pill></div></div>
          <div className="profile-facts"><div><span>Availability</span><strong>{data.user.availability.length} days / week</strong></div><div><span>Equipment</span><strong>{data.user.equipment.length} options</strong></div></div>
        </section>
        <section className="settings-card">
          <span className="settings-label">TRAINING SETUP</span>
          <button><span className="settings-icon"><Icon name="profile" /></span><span><strong>Athlete details</strong><small>Position, experience, primary goal</small></span><Icon name="arrow" /></button>
          <button onClick={onEditSchedule}><span className="settings-icon"><Icon name="week" /></span><span><strong>Team schedule</strong><small>{data.schedule.practiceDay} practice · {data.schedule.matchDay} match</small></span><Icon name="arrow" /></button>
          <button><span className="settings-icon"><Icon name="bolt" /></span><span><strong>Equipment & availability</strong><small>What you can use and when</small></span><Icon name="arrow" /></button>
          <span className="settings-label">PREFERENCES & DATA</span>
          <button onClick={() => setNotifications(!notifications)}><span className="settings-icon"><Icon name="today" /></span><span><strong>Check-in reminders</strong><small>{notifications ? "On · before optional training" : "Off"}</small></span><span className={`toggle ${notifications ? "on" : ""}`}><i /></span></button>
          <button onClick={onExport}><span className="settings-icon"><Icon name="download" /></span><span><strong>Export my data</strong><small>Download this prototype’s local data</small></span><Icon name="arrow" /></button>
          <button onClick={onReset}><span className="settings-icon"><Icon name="refresh" /></span><span><strong>Restart demo</strong><small>Restore the seeded prototype</small></span><Icon name="arrow" /></button>
          <button className="danger-row" onClick={onDelete}><span className="settings-icon"><Icon name="trash" /></span><span><strong>Delete local account</strong><small>Clears all prototype data</small></span><Icon name="arrow" /></button>
        </section>
      </div>
    </main>
  );
}

function ScheduleEditor({ schedule, onBack, onPreview }) {
  const [form, setForm] = useState(schedule);
  return (
    <main className="focused-page">
      <header className="focused-header"><button className="icon-button" onClick={onBack} aria-label="Back"><Icon name="back" /></button><span className="focused-title">Team schedule</span><span /></header>
      <section className="form-shell schedule-editor">
        <span className="section-kicker">FIXED COMMITMENTS</span><h1>Keep the week accurate.</h1><p className="lead">Changes here may reshape optional sessions. You will review everything before it is applied.</p>
        <div className="schedule-card"><Pill tone="dark">TEAM PRACTICE</Pill><div className="two-fields"><div className="field"><label>Day</label><select value={form.practiceDay} onChange={(e) => setForm({ ...form, practiceDay: e.target.value })}>{weekdays().map(day => <option key={day}>{day}</option>)}</select></div><div className="field"><label>Time</label><input type="time" value={form.practiceTime} onChange={(e) => setForm({ ...form, practiceTime: e.target.value })} /></div></div></div>
        <div className="schedule-card"><Pill tone="dark">MATCH</Pill><div className="two-fields"><div className="field"><label>Day</label><select value={form.matchDay} onChange={(e) => setForm({ ...form, matchDay: e.target.value })}>{weekdays().map(day => <option key={day}>{day}</option>)}</select></div><div className="field"><label>Time</label><input type="time" value={form.matchTime} onChange={(e) => setForm({ ...form, matchTime: e.target.value })} /></div></div></div>
        <div className="info-card"><Icon name="shield" /><div><strong>Fixed means fixed</strong><p>PureAthletic can move optional sessions around these entries, but never moves team commitments automatically.</p></div></div>
        <Button onClick={() => onPreview(form)}>Review schedule changes</Button>
      </section>
    </main>
  );
}

function AdjustmentHistory({ adjustments, onUndo }) {
  if (!adjustments.length) return null;
  return (
    <aside className="history-toast">
      <div><span className="eyebrow">RECENT PLAN CHANGE</span><strong>{adjustments[0].title}</strong><small>{adjustments[0].reason}</small></div>
      {adjustments[0].undoable && <button onClick={() => onUndo(adjustments[0].id)}>Undo</button>}
    </aside>
  );
}

function weekdays() {
  return ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
}

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const [data, setData] = useState(onboardingSeed);
  const [screen, setScreen] = useState("landing");
  const [outcome, setOutcome] = useState("good");
  const [logConfig, setLogConfig] = useState({ unplanned: false, status: "Completed" });
  const [pending, setPending] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed);
        setScreen(parsed.onboarded ? "today" : "landing");
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, hydrated]);

  const highLoadCount = useMemo(() => data.activities.filter(a => a.duration >= 60 && a.effort >= 8).length, [data.activities]);

  function enterDemo() {
    setData(structuredClone(demoState));
    setScreen("today");
  }

  function finishOnboarding(user, schedule) {
    setData({ ...structuredClone(demoState), onboarded: true, user, schedule });
    setScreen("today");
  }

  function submitCheckIn(form) {
    let kind = "good";
    let recommendation = data.recommendation;
    let adjustment = null;
    if (form.pain === "Severe") {
      kind = "severe";
      recommendation = { ...recommendation, type: "Safety", title: "Stop training and seek advice", status: "Safety", duration: 0, purpose: "Severe pain was reported. No workout is recommended." };
      adjustment = { id: Date.now(), title: "Workout removed for severe pain", reason: "Safety rule · severe pain", undoable: false };
    } else if (form.pain === "Moderate") {
      kind = "moderate";
      recommendation = { ...recommendation, type: "Safety", title: "Intense training removed", status: "Safety", duration: 0, purpose: "Moderate pain was reported. Review conservative guidance before deciding what to do." };
      adjustment = { id: Date.now(), title: "Intense workout removed", reason: "Safety rule · moderate pain", undoable: false };
    } else if (form.sleep <= 2 && form.energy <= 2) {
      kind = "poor";
      recommendation = { ...recommendation, type: "Recovery", title: "Mobility + recovery", status: "Recovery", duration: 20, intensity: "Easy", purpose: "Low sleep and energy make a lighter recovery session the better fit today." };
      adjustment = { id: Date.now(), title: "Strength replaced with recovery", reason: "Very poor readiness", undoable: true, beforeRecommendation: data.recommendation };
    }
    setData({ ...data, checkInDone: true, checkIn: form, recommendation, adjustments: adjustment ? [adjustment, ...data.adjustments] : data.adjustments });
    setOutcome(kind);
    setScreen("outcome");
  }

  function openPlannedLog(status = "Completed") {
    setLogConfig({ unplanned: false, status });
    setScreen("log");
  }

  function openUnplannedLog() {
    setLogConfig({ unplanned: true, status: "Completed" });
    setScreen("log");
  }

  function saveActivity(form) {
    const activity = { ...form, id: Date.now(), title: logConfig.unplanned ? form.type : data.recommendation.title, date: "Tue 28" };
    const activities = [activity, ...data.activities];
    const plan = data.plan.map(item => item.id === "tue" && !logConfig.unplanned ? { ...item, status: form.status } : item);
    const nextData = { ...data, activities, plan };
    if (form.pain === "Moderate" || form.pain === "Severe") {
      const severe = form.pain === "Severe";
      nextData.recommendation = { ...data.recommendation, type: "Safety", title: severe ? "Stop training and seek advice" : "Intense training removed", status: "Safety", duration: 0, purpose: `${form.pain} pain was reported after activity. Review the safety guidance.` };
      nextData.adjustments = [{ id: Date.now() + 1, title: "Future intense work restricted", reason: `Safety rule · ${form.pain.toLowerCase()} pain`, undoable: false }, ...data.adjustments];
      setData(nextData);
      setOutcome(severe ? "severe" : "moderate");
      setScreen("outcome");
      return;
    }
    setData(nextData);
    if (form.duration >= 60 && form.effort >= 8) {
      setPending({ kind: "activity", originalPlan: data.plan });
      setScreen("adjustment");
    } else {
      setScreen("today");
    }
  }

  function applyPending() {
    if (pending.kind === "schedule") {
      const updatedPlan = data.plan.map(item => item.id === "sat" ? { ...item, day: `${pending.schedule.matchDay.slice(0, 3).toUpperCase()} · UPDATED`, time: pending.schedule.matchTime } : item);
      const adjustment = { id: Date.now(), title: `Match moved to ${pending.schedule.matchDay}`, reason: "Team schedule changed", undoable: true, beforePlan: data.plan, beforeSchedule: data.schedule };
      setData({ ...data, schedule: pending.schedule, plan: updatedPlan, adjustments: [adjustment, ...data.adjustments] });
    } else {
      const updatedPlan = data.plan.map(item => item.id === "wed" ? { ...item, type: "Recovery", title: "Mobility reset", duration: 20, intensity: "Easy", status: "Recovery" } : item);
      const adjustment = { id: Date.now(), title: "Recovery replaced conditioning", reason: "Consecutive high-load days avoided", undoable: true, beforePlan: pending.originalPlan };
      setData({ ...data, plan: updatedPlan, adjustments: [adjustment, ...data.adjustments] });
    }
    setPending(null);
    setScreen("week");
  }

  function undoAdjustment(id) {
    const adjustment = data.adjustments.find(item => item.id === id);
    if (!adjustment?.undoable) return;
    setData({
      ...data,
      plan: adjustment.beforePlan || data.plan,
      schedule: adjustment.beforeSchedule || data.schedule,
      recommendation: adjustment.beforeRecommendation || data.recommendation,
      adjustments: data.adjustments.filter(item => item.id !== id),
    });
  }

  function exportData() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "pureathletic-prototype-data.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function deleteData() {
    if (window.confirm("Delete all local prototype data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      setData(onboardingSeed);
      setScreen("landing");
    }
  }

  function resetDemo() {
    if (window.confirm("Restart with the original seeded demo data?")) enterDemo();
  }

  if (!hydrated) return <div className="loading-screen"><Brand /><span>Preparing your week…</span></div>;
  if (screen === "landing") return <Landing onStart={() => setScreen("onboarding")} onDemo={enterDemo} />;
  if (screen === "onboarding") return <Onboarding onComplete={finishOnboarding} onExit={() => setScreen("landing")} />;
  if (screen === "checkin") return <CheckIn onBack={() => setScreen("today")} onSubmit={submitCheckIn} />;
  if (screen === "outcome") return <Outcome kind={outcome} data={data} onContinue={() => setScreen(outcome === "good" ? "workout" : "today")} />;
  if (screen === "safety") return <Outcome kind={data.checkIn?.pain === "Severe" ? "severe" : "moderate"} data={data} onContinue={() => setScreen("today")} />;
  if (screen === "workout" || screen === "short-workout") return <Workout short={screen === "short-workout"} onBack={() => setScreen("today")} onLog={openPlannedLog} />;
  if (screen === "log") return <ActivityLog initialStatus={logConfig.status} unplanned={logConfig.unplanned} onBack={() => setScreen("today")} onSave={saveActivity} />;
  if (screen === "adjustment") return <AdjustmentPreview pending={pending} onApply={applyPending} onDismiss={() => { setPending(null); setScreen("today"); }} />;
  if (screen === "schedule") return <ScheduleEditor schedule={data.schedule} onBack={() => setScreen("profile")} onPreview={(schedule) => { setPending({ kind: "schedule", schedule }); setScreen("adjustment"); }} />;

  return (
    <AppShell screen={screen} setScreen={setScreen} user={data.user} onReset={resetDemo}>
      {screen === "today" && <Today data={data} setScreen={setScreen} onOpenLog={openUnplannedLog} />}
      {screen === "week" && <Week plan={data.plan} onOpenWorkout={() => setScreen("workout")} />}
      {screen === "progress" && <Progress data={data} highLoadCount={highLoadCount} />}
      {screen === "profile" && <Profile data={data} onEditSchedule={() => setScreen("schedule")} onExport={exportData} onDelete={deleteData} onReset={resetDemo} />}
      <AdjustmentHistory adjustments={data.adjustments} onUndo={undoAdjustment} />
    </AppShell>
  );
}
