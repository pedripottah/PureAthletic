"use strict";

/*
 * PureAthletic's browser application.
 *
 * There is no React, Next.js, build step, or package dependency here. Each
 * render function returns an HTML string, render() puts it in #app, and the
 * event listeners at the bottom handle interaction with normal DOM APIs.
 *
 * A useful mental model for reading this file:
 * 1. Constants describe the prototype's starting data.
 * 2. `data` stores the athlete information that should survive a page refresh.
 * 3. `ui` stores temporary information about what is currently on screen.
 * 4. Render functions turn that state into HTML.
 * 5. Event listeners react to the user, update state, and render again.
 *
 * This started as a vibe-coded prototype, but the comments below are here so
 * every section can also be used as a JavaScript learning exercise.
 */

// =============================================================================
// BROWSER CONNECTIONS
// =============================================================================

// This is the name used to save and retrieve the app's data in localStorage.
const STORAGE_KEY = "pureathletic-prototype-v1";

// querySelector() connects JavaScript to elements that already exist in index.html.
const app = document.querySelector("#app"); // The <div id="app"> where screens appear.
const landingTemplate = document.querySelector("#landing-view"); // Reusable landing-page HTML.

// =============================================================================
// STARTING AND DEMO DATA
// =============================================================================

/*
 * The initial seven-day plan.
 * This is an array: an ordered list surrounded by [].
 * Each item is an object: a group of related properties surrounded by {}.
 * Example: initialPlan[0].title gives "Lower-body foundation".
 */
const initialPlan = [
  { id: "tue", day: "TODAY · TUE 28", type: "Strength", title: "Lower-body foundation", duration: 45, intensity: "Moderate", status: "Planned", fixed: false },
  { id: "wed", day: "WED 29", type: "Rest", title: "Full rest", duration: 0, intensity: "Easy", status: "Rest", fixed: false },
  { id: "thu", day: "THU 30", type: "Team practice", title: "Team training", duration: 90, intensity: "Team-led", status: "Fixed", fixed: true, time: "19:00" },
  { id: "fri", day: "FRI 31", type: "Recovery", title: "Mobility reset", duration: 20, intensity: "Easy", status: "Recovery", fixed: false },
  { id: "sat", day: "SAT 1", type: "Match", title: "League match", duration: 90, intensity: "Match", status: "Fixed", fixed: true, time: "15:00" },
  { id: "sun", day: "SUN 2", type: "Recovery", title: "Post-match recovery", duration: 25, intensity: "Easy", status: "Recovery", fixed: false },
  { id: "mon", day: "MON 3", type: "Speed", title: "Acceleration quality", duration: 35, intensity: "Moderate", status: "Planned", fixed: false }
];

/*
 * A complete example account loaded by the "Explore demo" button.
 * Nested values are accessed one level at a time, such as data.user.name.
 */
const demoState = {
  onboarded: true, // The example user has completed onboarding.
  user: {
    name: "Sam",
    ageConfirmed: true,
    disclaimerAccepted: true,
    position: "Midfielder",
    experience: "Intermediate",
    goal: "Match readiness",
    availability: ["Monday", "Wednesday", "Friday", "Sunday"],
    equipment: ["Bodyweight", "Resistance bands", "Field or open space"]
  },
  checkInDone: false,
  recommendation: {
    id: "tue",
    type: "Strength",
    title: "Lower-body foundation",
    duration: 45,
    intensity: "Moderate",
    status: "Planned",
    purpose: "Build useful lower-body strength with enough recovery before Saturday’s match."
  },
  plan: initialPlan,
  activities: [
    { id: 1, title: "Speed mechanics", status: "Completed", duration: 35, effort: 6, date: "Mon 27" },
    { id: 2, title: "Mobility reset", status: "Modified", duration: 18, effort: 3, date: "Sun 26" }
  ],
  adjustments: [],
  schedule: {
    practiceDay: "Thursday",
    practiceTime: "19:00",
    matchDay: "Saturday",
    matchTime: "15:00"
  }
};

/*
 * The blank starting state for a new athlete.
 * "Seed" means the default data from which a new account begins.
 */
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
    equipment: ["Bodyweight"]
  },
  checkInDone: false,
  recommendation: demoState.recommendation,
  plan: initialPlan,
  activities: [],
  adjustments: [],
  schedule: demoState.schedule
};

/*
 * A list of exercise objects used by renderWorkout().
 * Each object supplies the title and smaller detail text for one workout row.
 */
const exercises = [
  { name: "Dynamic movement series", detail: "8 min warm-up" },
  { name: "Split squat", detail: "3 × 8 each side" },
  { name: "Hip hinge", detail: "3 × 10" },
  { name: "Calf raise", detail: "3 × 12" },
  { name: "Trunk + mobility", detail: "9 min finish" }
];

// These values are reused to build choices instead of repeating the HTML by hand.
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/*
 * Each inner array describes one navigation button:
 * [screen id, icon name, visible label].
 * Later, array destructuring gives those values the names id, iconName, and label.
 */
const navItems = [
  ["today", "today", "Today"],
  ["week", "week", "Week"],
  ["progress", "progress", "Progress"],
  ["profile", "profile", "Profile"]
];

// =============================================================================
// LIVE APPLICATION STATE
// =============================================================================

/*
 * `data` is the app's lasting state. loadData() restores it from the browser or
 * returns a new onboarding state. It is saved again whenever important data
 * changes.
 */
let data = loadData();

/*
 * `ui` is temporary interface state. It remembers the open screen, unfinished
 * form values, and temporary choices. Unlike `data`, it is not saved between
 * page refreshes.
 */
let ui = {
  // A ternary is a short if/else: condition ? valueIfTrue : valueIfFalse.
  screen: data.onboarded ? "today" : "landing",
  onboardingStep: 1,
  onboardingForm: clone(onboardingSeed.user),
  onboardingSchedule: clone(demoState.schedule),
  checkinForm: { sleep: 3, energy: 3, soreness: 2, stress: 2, pain: "None" },
  workoutDone: [],
  outcome: "good",
  logConfig: { unplanned: false, status: "Completed" },
  logForm: null,
  pending: null,
  notifications: true
};

// =============================================================================
// DATA AND SAFETY HELPERS
// =============================================================================

/*
 * Makes a separate copy of a simple object or array.
 * Without a copy, two variables can point to the same object and accidentally
 * change each other. This JSON technique is suitable for this prototype's data.
 */
function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

/*
 * Tries to restore saved JSON text from localStorage.
 * If there is no saved value—or parsing fails—it returns a fresh starting state.
 */
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    // `saved ? A : B` returns A when saved exists and B when it does not.
    return saved ? JSON.parse(saved) : clone(onboardingSeed);
  } catch {
    // Corrupted or unavailable saved data should not stop the app from opening.
    localStorage.removeItem(STORAGE_KEY);
    return clone(onboardingSeed);
  }
}

// localStorage only accepts text, so JSON.stringify() converts the object first.
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/*
 * Converts potentially unsafe text into safe HTML text.
 * For example, "<" becomes "&lt;" instead of being treated as an HTML tag.
 * `value ?? ""` uses an empty string only when value is null or undefined.
 */
function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// =============================================================================
// SMALL HTML-BUILDING HELPERS
// =============================================================================

/*
 * Returns the SVG markup for a named icon.
 * `size = 20` is a default parameter used when no size is supplied.
 * `paths[name] || paths.bolt` falls back to the bolt for an unknown name.
 */
function icon(name, size = 20) {
  const paths = {
    bolt: '<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"></path>',
    today: '<circle cx="12" cy="12" r="8"></circle><path d="m12 7 1.5 4 3.5 1.5-3.5 1.5-1.5 4-1.5-4L7 12.5l3.5-1.5L12 7Z"></path>',
    week: '<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M16 3v4M8 3v4M3 10h18"></path>',
    progress: '<path d="M4 19V9M10 19V5M16 19v-7M22 19H2"></path>',
    profile: '<circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path>',
    arrow: '<path d="m9 18 6-6-6-6"></path>',
    back: '<path d="m15 18-6-6 6-6"></path>',
    clock: '<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><path d="m9 12 2 2 4-4"></path>',
    check: '<path d="m5 12 4 4L19 6"></path>',
    plus: '<path d="M12 5v14M5 12h14"></path>',
    refresh: '<path d="M20 7h-6V1"></path><path d="M20 7a9 9 0 1 0 1 8"></path>',
    alert: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"></path><path d="M12 9v4M12 17h.01"></path>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"></path>',
    trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"></path>'
  };

  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.bolt}</svg>`;
}

/*
 * The landing page starts inside an HTML <template>. This finds every element
 * marked with data-icon and inserts the matching SVG into it.
 */
function hydrateTemplateIcons() {
  app.querySelectorAll("[data-icon]").forEach((element) => {
    // closest() checks whether the icon is inside a .preview-icon parent.
    const size = element.closest(".preview-icon") ? 24 : 18;
    element.innerHTML = icon(element.dataset.icon, size);
  });
}

// =============================================================================
// MOTION AND MICRO-INTERACTIONS
// =============================================================================

/*
 * Motion is added after every render because render() replaces the current DOM.
 * The animations use the Web Animations API, so JavaScript controls when they
 * start while CSS continues to own PureAthletic's existing visual theme.
 */
let lastMotionView = "";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function motionViewKey() {
  return ui.screen === "onboarding"
    ? `${ui.screen}-${ui.onboardingStep}`
    : ui.screen;
}

function animateViewEntry() {
  const selectors = [
    ".landing-header > *",
    ".hero-copy > *",
    ".hero-preview",
    ".landing-footer > *",
    ".focused-header > *",
    ".step-panel > *",
    ".form-actions",
    ".checkin-intro > *",
    ".checkin-card",
    ".workout-hero > *",
    ".exercise-list",
    ".workout-note",
    ".sticky-actions",
    ".log-heading > *",
    ".form-card",
    ".outcome-card > *",
    ".adjustment-card > *",
    ".screen-header > *",
    ".dashboard-grid > *",
    ".week-card",
    ".progress-layout > *",
    ".profile-grid > *",
    ".history-toast"
  ];
  const elements = [...new Set(app.querySelectorAll(selectors.join(",")))];

  elements.forEach((element, index) => {
    element.animate(
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 480,
        delay: Math.min(index * 55, 385),
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      }
    );
  });
}

function animateDataDetails() {
  app.querySelectorAll(".load-bars span, .trend-bars i").forEach((bar, index) => {
    bar.animate(
      [
        { opacity: 0.35, transform: "scaleY(0.12)" },
        { opacity: 1, transform: "scaleY(1)" }
      ],
      {
        duration: 520,
        delay: 180 + index * 45,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      }
    );
  });

  app.querySelectorAll(".stat-main > strong").forEach((metric) => {
    const finalValue = Number(metric.textContent);
    if (!Number.isFinite(finalValue) || finalValue <= 0) return;

    const startedAt = performance.now();
    const duration = 620;
    metric.textContent = "0";

    function updateMetric(now) {
      if (!metric.isConnected) return;
      const progress = Math.min(1, (now - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      metric.textContent = String(Math.round(finalValue * eased));
      if (progress < 1) requestAnimationFrame(updateMetric);
    }

    requestAnimationFrame(updateMetric);
  });
}

function addButtonRipple(button, event) {
  if (button.disabled || event.button !== 0) return;

  const bounds = button.getBoundingClientRect();
  const diameter = Math.max(bounds.width, bounds.height) * 2;
  const ripple = document.createElement("span");
  ripple.className = "motion-ripple";
  ripple.style.width = `${diameter}px`;
  ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - bounds.left - diameter / 2}px`;
  ripple.style.top = `${event.clientY - bounds.top - diameter / 2}px`;
  button.append(ripple);

  const animation = ripple.animate(
    [
      { opacity: 0.2, transform: "scale(0.12)" },
      { opacity: 0, transform: "scale(1)" }
    ],
    { duration: 520, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
  );
  animation.onfinish = () => ripple.remove();
}

function animateButtonArrow(button, forward) {
  const arrow = [...button.querySelectorAll('[aria-hidden="true"]')]
    .find((element) => element.textContent.trim() === "→");
  if (!arrow) return;

  arrow.animate(
    [
      { transform: forward ? "translateX(0)" : "translateX(4px)" },
      { transform: forward ? "translateX(4px)" : "translateX(0)" }
    ],
    {
      duration: 220,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );
}

function installButtonMotion() {
  const selector = [
    ".button",
    ".icon-button",
    ".text-button",
    ".choice",
    ".radio-card",
    ".scale-buttons button",
    ".pain-options button",
    ".segmented button",
    ".log-another",
    ".date-control",
    ".side-nav nav button",
    ".bottom-nav button"
  ].join(",");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  app.querySelectorAll(selector).forEach((button) => {
    button.classList.add("motion-control");
    button.addEventListener("pointerdown", (event) => addButtonRipple(button, event));

    if (!finePointer || button.disabled) return;

    button.addEventListener("pointerenter", () => animateButtonArrow(button, true));
    button.addEventListener("pointerleave", () => animateButtonArrow(button, false));
  });
}

function installCardMotion() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  app.querySelectorAll(".hero-preview, .plain-card, .stat-card, .profile-card, .week-card, .empty-state")
    .forEach((card) => {
      let animation;
      const restingTransform = card.matches(".hero-preview")
        ? "rotate(1.5deg)"
        : "translateY(0)";
      const raisedTransform = card.matches(".hero-preview")
        ? "rotate(1.5deg) translateY(-4px)"
        : "translateY(-4px)";

      function moveCard(raised) {
        if (animation) animation.cancel();
        const currentTransform = getComputedStyle(card).transform;
        const nextAnimation = card.animate(
          [
            { transform: currentTransform },
            { transform: raised ? raisedTransform : restingTransform }
          ],
          {
            duration: raised ? 240 : 300,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards"
          }
        );
        animation = nextAnimation;
        if (!raised) {
          nextAnimation.onfinish = () => {
            if (animation === nextAnimation) nextAnimation.cancel();
          };
        }
      }

      card.classList.add("motion-card");
      card.addEventListener("pointerenter", () => moveCard(true));
      card.addEventListener("pointerleave", () => moveCard(false));
    });
}

function initializeMotion() {
  if (prefersReducedMotion()) return;

  installButtonMotion();
  installCardMotion();

  const viewKey = motionViewKey();
  if (viewKey === lastMotionView) return;
  lastMotionView = viewKey;

  requestAnimationFrame(() => {
    animateViewEntry();
    animateDataDetails();
  });
}

// The next helpers return small reusable pieces of HTML as template strings.
function brand() {
  return `<div class="brand"><span class="brand-mark">${icon("bolt", 18)}</span><span>PureAthletic</span></div>`;
}

// `tone` changes the CSS class; its default value is "neutral".
function pill(text, tone = "neutral") {
  return `<span class="pill pill-${tone}">${escapeHtml(text)}</span>`;
}

/*
 * Builds a consistent button. The options object allows callers to override
 * styling or add attributes without needing several separate button functions.
 */
function button(text, action, options = {}) {
  const variant = options.variant || "primary";
  const className = options.className || "";
  const attributes = options.attributes || "";
  const leadingIcon = options.icon ? icon(options.icon, 18) : "";
  return `<button type="button" class="button button-${variant} ${className}" data-action="${action}" ${attributes}>${leadingIcon}<span>${text}</span></button>`;
}

/*
 * map() transforms every choice into an <option>; join("") combines the array
 * of HTML strings into one string. The matching option receives "selected".
 */
function selectedOptions(options, selected) {
  return options.map((option) => `<option${option === selected ? " selected" : ""}>${escapeHtml(option)}</option>`).join("");
}

// A shared heading used by several main app screens.
function screenHeader(eyebrow, title, action = "") {
  return `<header class="screen-header"><div><span class="screen-eyebrow">${eyebrow}</span><h1>${title}</h1></div>${action}</header>`;
}

// =============================================================================
// SCREEN RENDERING
// =============================================================================

/*
 * A render function reads the current state and returns or inserts HTML.
 * Rendering does not save data—it only decides what the user sees right now.
 */

// Copies the landing <template> into #app, then fills its icon placeholders.
function renderLanding() {
  app.innerHTML = landingTemplate.innerHTML;
  hydrateTemplateIcons();
}

/*
 * Builds one of the five onboarding steps.
 * `panel` starts empty, then the matching if block fills it with that step's HTML.
 */
function renderOnboarding() {
  const step = ui.onboardingStep;
  const form = ui.onboardingForm;
  const schedule = ui.onboardingSchedule;
  const total = 5;
  let panel = "";

  if (step === 1) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">BEFORE WE BEGIN</span>
        <h1>Let’s keep this useful and safe.</h1>
        <p class="lead">PureAthletic provides general training guidance. It does not diagnose injury, provide treatment, or replace a qualified professional.</p>
        <label class="check-card">
          <input type="checkbox" data-scope="onboarding" data-field="ageConfirmed"${form.ageConfirmed ? " checked" : ""}>
          <span><strong>I confirm I am 18 or older</strong><small>The first prototype is limited to adult athletes.</small></span>
        </label>
        <label class="check-card">
          <input type="checkbox" data-scope="onboarding" data-field="disclaimerAccepted"${form.disclaimerAccepted ? " checked" : ""}>
          <span><strong>I understand the guidance boundary</strong><small>Pain or injury concerns need qualified support.</small></span>
        </label>
      </div>`;
  }

  if (step === 2) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">YOUR FOOTBALL</span>
        <h1>Tell us about your game.</h1>
        <div class="field">
          <label for="name">Preferred name</label>
          <input id="name" data-scope="onboarding" data-field="name" value="${escapeHtml(form.name)}" placeholder="Sam">
        </div>
        <div class="field">
          <label for="position">Position</label>
          <select id="position" data-scope="onboarding" data-field="position">${selectedOptions(["Goalkeeper", "Defender", "Midfielder", "Forward", "Utility player"], form.position)}</select>
        </div>
        <div class="field">
          <label>Training experience</label>
          <div class="choice-grid">
            ${["Beginner", "Intermediate", "Advanced"].map((item) => `<button type="button" class="choice ${form.experience === item ? "selected" : ""}" data-action="set-experience" data-value="${item}">${item}</button>`).join("")}
          </div>
        </div>
      </div>`;
  }

  if (step === 3) {
    // Each pair holds [goal title, supporting detail].
    const goals = [
      ["Match readiness", "Feel prepared around fixtures"],
      ["Strength", "Build force and robustness"],
      ["Speed", "Improve acceleration and pace"],
      ["Endurance", "Sustain repeated effort"],
      ["General fitness", "Build a balanced base"]
    ];
    panel = `
      <div class="step-panel">
        <span class="section-kicker">PRIMARY GOAL</span>
        <h1>What matters most right now?</h1>
        <div class="stacked-choices">
          <!-- [title, detail] destructures each pair into two named variables. -->
          ${goals.map(([title, detail]) => `
            <button type="button" class="radio-card ${form.goal === title ? "selected" : ""}" data-action="set-goal" data-value="${title}">
              <span class="radio-dot"></span><span><strong>${title}</strong><small>${detail}</small></span>
            </button>`).join("")}
        </div>
      </div>`;
  }

  if (step === 4) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">YOUR WEEK</span>
        <h1>Add the commitments that stay fixed.</h1>
        ${scheduleCard("TEAM PRACTICE", "practice", schedule, "onboardingSchedule")}
        ${scheduleCard("MATCH", "match", schedule, "onboardingSchedule")}
        <p class="hint">${icon("shield", 17)} These commitments will never be moved automatically.</p>
      </div>`;
  }

  if (step === 5) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">REVIEW</span>
        <h1>Your first week is ready to build.</h1>
        <div class="review-list">
          <div><span>Athlete</span><strong>${escapeHtml(form.name.trim() || "Sam")} · ${escapeHtml(form.position)}</strong></div>
          <div><span>Primary goal</span><strong>${escapeHtml(form.goal)}</strong></div>
          <div><span>Team practice</span><strong>${escapeHtml(schedule.practiceDay)} · ${escapeHtml(schedule.practiceTime)}</strong></div>
          <div><span>Match</span><strong>${escapeHtml(schedule.matchDay)} · ${escapeHtml(schedule.matchTime)}</strong></div>
          <div><span>Plan shape</span><strong>2 sessions · 2 recovery/rest days</strong></div>
        </div>
        <div class="info-card">${icon("shield")}<div><strong>Match protection applied</strong><p>We will avoid hard lower-body work immediately before your match.</p></div></div>
      </div>`;
  }

  // Step 1 stays disabled until both required checkboxes are selected.
  const canContinue = step !== 1 || (form.ageConfirmed && form.disclaimerAccepted);
  return `
    <main class="focused-page">
      <header class="focused-header">
        <button type="button" class="icon-button" data-action="onboarding-back" aria-label="Back">${icon("back")}</button>
        ${brand()}
        <button type="button" class="text-button" data-action="exit-onboarding">Exit</button>
      </header>
      <section class="form-shell">
        <div class="progress-meta"><span>STEP ${step} OF ${total}</span><span>${Math.round((step / total) * 100)}%</span></div>
        <div class="progress-track"><span style="width:${(step / total) * 100}%"></span></div>
        ${panel}
        <div class="form-actions">
          <button type="button" class="button button-primary" data-action="onboarding-next"${canContinue ? "" : " disabled"}>
            <span>${step === total ? "Generate my plan" : "Continue"} <span aria-hidden="true">→</span></span>
          </button>
        </div>
      </section>
    </main>`;
}

/*
 * Builds a reusable practice or match card.
 * A prefix such as "practice" becomes the property names "practiceDay" and
 * "practiceTime". Bracket notation reads a property using a variable name.
 */
function scheduleCard(label, prefix, schedule, scope) {
  const dayField = `${prefix}Day`;
  const timeField = `${prefix}Time`;
  return `
    <div class="schedule-card">
      ${pill(label, "dark")}
      <div class="two-fields">
        <div class="field"><label>Day</label><select data-scope="${scope}" data-field="${dayField}">${selectedOptions(weekdays, schedule[dayField])}</select></div>
        <div class="field"><label>Time</label><input type="time" data-scope="${scope}" data-field="${timeField}" value="${escapeHtml(schedule[timeField])}"></div>
      </div>
    </div>`;
}

/*
 * Wraps a main screen with the desktop sidebar and mobile bottom navigation.
 * The `content` argument is the already-rendered HTML for the current screen.
 */
function renderAppShell(content) {
  // Destructuring names the three values inside each navItems entry.
  const navigation = navItems.map(([id, iconName, label]) => `
    <button type="button" class="${ui.screen === id ? "active" : ""}" data-action="navigate" data-screen="${id}">
      ${icon(iconName)}<span>${label}</span>
    </button>`).join("");
  const userName = data.user.name || "Athlete";

  return `
    <div class="app-shell">
      <aside class="side-nav">
        ${brand()}
        <nav>${navigation}</nav>
        <div class="side-user">
          <span class="avatar">${escapeHtml(userName.slice(0, 1).toUpperCase())}</span>
          <div><strong>${escapeHtml(userName)}</strong><small>${escapeHtml(data.user.position)}</small></div>
          <button type="button" data-action="reset-demo" aria-label="Reset demo">${icon("refresh", 16)}</button>
        </div>
      </aside>
      <div class="app-content">${content}${renderHistory()}</div>
      <nav class="bottom-nav">${navigation}</nav>
    </div>`;
}

/*
 * Builds the Today dashboard from the current recommendation and check-in state.
 * The nested ternaries choose the appropriate buttons and explanation.
 */
function renderToday() {
  const rec = data.recommendation;
  const safety = rec.status === "Safety";
  const recommendationActions = !data.checkInDone && !safety
    ? button('Complete check-in <span aria-hidden="true">→</span>', "open-checkin")
    : safety
      ? button("Review guidance", "review-safety", { variant: "light" })
      : `<div class="button-row">${button("Start workout", "open-workout")}${button("25-min version", "open-short-workout", { variant: "light" })}</div>`;
  const explanation = safety
    ? "Safety rules take priority over the weekly goal and cannot be bypassed."
    : data.checkInDone
      ? "Your check-in supports this session, and it fits the clearest strength window before Saturday’s match."
      : "Check in first so the session can respond to today’s sleep, energy, soreness, stress, and pain.";

  return `
    <main class="screen">
      ${screenHeader("TUESDAY, 28 JULY", `Good afternoon, ${escapeHtml(data.user.name)}.`, `<span class="readiness-dot">${data.checkInDone ? "Check-in done" : "Check-in due"}</span>`)}
      <div class="dashboard-grid">
        <section class="recommendation-card ${safety ? "safety-card" : ""}">
          <div class="card-topline"><span class="eyebrow">${safety ? "SAFETY GUIDANCE" : "TODAY’S RECOMMENDATION"}</span>${pill(rec.status, safety ? "warning" : "lime")}</div>
          <div class="recommendation-icon">${icon(safety ? "alert" : rec.type === "Recovery" ? "shield" : "bolt", 28)}</div>
          <span class="session-type">${escapeHtml(rec.type)}</span>
          <h2>${escapeHtml(rec.title)}</h2>
          ${safety ? "" : `<div class="session-meta"><span>${icon("clock", 17)} ${rec.duration} min</span><span>${escapeHtml(rec.intensity)}</span></div>`}
          <p>${escapeHtml(rec.purpose)}</p>
          ${recommendationActions}
        </section>
        <div class="dashboard-side">
          <section class="plain-card explanation"><span class="eyebrow">WHY THIS TODAY?</span><p>${explanation}</p></section>
          <section class="plain-card next-card">
            <div><span class="eyebrow">NEXT FIXED COMMITMENT</span><h3>Team practice</h3><p>${escapeHtml(data.schedule.practiceDay)} · ${escapeHtml(data.schedule.practiceTime)} · 90 min</p></div>
            <span class="round-icon">${icon("week")}</span>
          </section>
          <section class="plain-card progress-mini">
            <span class="eyebrow">THIS WEEK</span>
            <div class="big-number">${data.activities.length}<small> activities logged</small></div>
            <div class="mini-track"><span style="width:${Math.min(100, data.activities.length * 24)}%"></span></div>
          </section>
          <button type="button" class="log-another" data-action="open-unplanned-log">${icon("plus")} Log another activity</button>
        </div>
      </div>
    </main>`;
}

/*
 * Builds the readiness form.
 * Each item in `scales` holds [state key, label, low label, high label].
 * One map() creates all four scales and another creates buttons 1 through 5.
 */
function renderCheckIn() {
  const scales = [
    ["sleep", "Sleep quality", "Poor", "Great"],
    ["energy", "Energy", "Low", "High"],
    ["soreness", "Muscle soreness", "None", "Severe"],
    ["stress", "Stress", "Low", "High"]
  ];
  const form = ui.checkinForm;
  const scaleMarkup = scales.map(([key, label, low, high]) => `
    <div class="scale-field">
      <div class="scale-label"><label>${label}</label><strong>${form[key]} / 5</strong></div>
      <div class="scale-buttons">
        ${[1, 2, 3, 4, 5].map((value) => `<button type="button" class="${form[key] === value ? "selected" : ""}" data-action="set-checkin-scale" data-field="${key}" data-value="${value}">${value}</button>`).join("")}
      </div>
      <div class="scale-ends"><span>${low}</span><span>${high}</span></div>
    </div>`).join("");
  const painWarning = ["Moderate", "Severe"].includes(form.pain)
    ? `<p class="inline-warning">${icon("alert", 17)} This will replace intense optional training with conservative safety guidance.</p>`
    : "";

  return `
    <main class="focused-page checkin-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-today" aria-label="Back to Today">${icon("back")}</button><span class="focused-title">Daily check-in</span><span class="time-hint">~30 sec</span></header>
      <section class="checkin-shell">
        <div class="checkin-intro">${pill("TODAY", "lime")}<h1>How ready do you feel?</h1><p>There are no good or bad answers. This helps shape the most appropriate next step.</p></div>
        <div class="checkin-card">
          ${scaleMarkup}
          <div class="pain-field">
            <div class="scale-label"><label>Pain today</label>${icon("shield", 18)}</div>
            <div class="pain-options">${["None", "Mild", "Moderate", "Severe"].map((pain) => `<button type="button" class="${form.pain === pain ? "selected" : ""} ${["Moderate", "Severe"].includes(pain) ? "caution" : ""}" data-action="set-checkin-pain" data-value="${pain}">${pain}</button>`).join("")}</div>
            ${painWarning}
          </div>
          ${button('Save check-in <span aria-hidden="true">→</span>', "submit-checkin", { className: "full" })}
        </div>
      </section>
    </main>`;
}

/*
 * Selects the wording for the check-in result.
 * Returning an object keeps the text decision separate from the outcome HTML.
 */
function outcomeCopy(kind) {
  if (kind === "poor") return { kicker: "RECOMMENDATION UPDATED", title: "A lighter day fits better.", body: "Today’s low sleep and energy make recovery the more appropriate choice before team practice.", before: "45-min strength", after: "20-min mobility + recovery" };
  if (kind === "moderate") return { kicker: "SAFETY ACTION", title: "Intense training removed.", body: "You reported moderate pain. PureAthletic cannot assess an injury or tell you when it is safe to return.", before: "45-min strength", after: "Conservative guidance" };
  if (kind === "severe") return { kicker: "STOP TRAINING", title: "Seek qualified advice.", body: "You reported severe pain. Stop training and seek advice from a qualified healthcare or sports professional.", before: "45-min strength", after: "No workout recommended" };
  return { kicker: "CHECK-IN SAVED", title: "Today’s plan still fits.", body: "Your readiness supports the planned session and no safety rule was triggered.", before: null, after: null };
}

// Builds the result screen after a readiness check-in or a pain safety action.
function renderOutcome() {
  const kind = ui.outcome;
  const copy = outcomeCopy(kind);
  const pain = ["moderate", "severe"].includes(kind);
  return `
    <main class="outcome-page ${pain ? "outcome-safety" : ""}">
      <div class="outcome-card">
        <span class="outcome-icon ${pain ? "warning" : ""}">${icon(pain ? "alert" : "check", 28)}</span>
        <span class="section-kicker">${copy.kicker}</span>
        <h1>${copy.title}</h1>
        <p>${copy.body}</p>
        ${copy.before ? `<div class="change-block"><div><small>BEFORE</small><strong>${copy.before}</strong></div><span>↓</span><div><small>NOW</small><strong>${copy.after}</strong></div></div>` : ""}
        ${pain ? `<div class="boundary-note">${icon("shield")}<p>Team commitments remain visible, but their presence is not clearance to participate. Safety actions cannot be directly undone.</p></div>` : ""}
        ${button(pain ? "Return to Today" : kind === "good" ? "View workout" : "View updated Today", "continue-outcome")}
      </div>
    </main>`;
}

/*
 * Builds either the full workout or its short version.
 * When `short` is true, slice(0, 4) returns only the first four exercises.
 */
function renderWorkout(short = false) {
  const shown = short ? exercises.slice(0, 4) : exercises;
  return `
    <main class="focused-page workout-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-today" aria-label="Back">${icon("back")}</button><span class="focused-title">${short ? "Shorter workout" : "Workout detail"}</span>${pill(short ? "25 MIN" : "45 MIN")}</header>
      <section class="workout-shell">
        <div class="workout-hero">
          <div>${pill("STRENGTH", "lime")}<h1>${short ? "Lower-body essentials" : "Lower-body foundation"}</h1><p>${short ? "The essential work, kept focused for a tighter day." : "Build useful lower-body strength with enough recovery before Saturday’s match."}</p></div>
          <div class="difficulty"><span>DIFFICULTY</span><strong>Moderate</strong><div><i></i><i></i><i class="muted"></i><i class="muted"></i></div></div>
        </div>
        <div class="exercise-list">
          <!-- map() turns every exercise object into one clickable HTML row. -->
          ${shown.map((exercise, index) => `
            <button type="button" class="exercise-row ${ui.workoutDone.includes(index) ? "done" : ""}" data-action="toggle-exercise" data-index="${index}">
              <span class="exercise-number">${ui.workoutDone.includes(index) ? icon("check", 17) : String(index + 1).padStart(2, "0")}</span>
              <span><strong>${exercise.name}</strong><small>${exercise.detail}</small></span>${icon("arrow")}
            </button>`).join("")}
        </div>
        <div class="workout-note">${icon("shield")}<p>Use controlled movement and stop if an exercise causes pain. Approved alternatives can be selected during the session.</p></div>
        <div class="sticky-actions">
          ${button("Finish and log", "open-planned-log", { attributes: 'data-status="Completed"' })}
          ${button("Log modifications", "open-planned-log", { variant: "secondary", attributes: 'data-status="Modified"' })}
          <button type="button" class="text-button danger-text" data-action="open-planned-log" data-status="Skipped">Skip session</button>
        </div>
      </section>
    </main>`;
}

/*
 * Builds the activity form for both planned and unplanned training.
 * Conditional template sections show different fields for the two situations.
 */
function renderActivityLog() {
  const form = ui.logForm;
  const unplanned = ui.logConfig.unplanned;
  return `
    <main class="focused-page log-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-today" aria-label="Back">${icon("back")}</button><span class="focused-title">${unplanned ? "Log another activity" : "Log your session"}</span><span></span></header>
      <section class="log-shell">
        <div class="log-heading"><span class="section-kicker">${unplanned ? "UNPLANNED ACTIVITY" : "TODAY’S SESSION"}</span><h1>${unplanned ? "What did you do?" : "Lower-body foundation"}</h1></div>
        <div class="form-card">
          ${unplanned ? `<div class="field"><label>Activity type</label><select data-scope="log" data-field="type">${selectedOptions(["Team practice", "Match", "Strength", "Speed", "Conditioning", "Recovery"], form.type)}</select></div>` : ""}
          ${unplanned ? "" : `<div class="field"><label>Outcome</label><div class="segmented">${["Completed", "Modified", "Skipped"].map((status) => `<button type="button" class="${form.status === status ? "selected" : ""}" data-action="set-log-status" data-value="${status}">${status}</button>`).join("")}</div></div>`}
          ${form.status === "Skipped" ? "" : `
            <div class="two-fields">
              <div class="field"><label>Duration</label><div class="input-suffix"><input type="number" min="1" data-scope="log" data-field="duration" value="${form.duration}"><span>min</span></div></div>
              <div class="field"><label>Effort</label><div class="input-suffix"><input type="number" min="1" max="10" data-scope="log" data-field="effort" value="${form.effort}"><span>/ 10</span></div></div>
            </div>`}
          <div class="field"><label>Pain during or after</label><div class="pain-options compact">${["None", "Mild", "Moderate", "Severe"].map((pain) => `<button type="button" class="${form.pain === pain ? "selected" : ""}" data-action="set-log-pain" data-value="${pain}">${pain}</button>`).join("")}</div></div>
          <div class="field"><label for="notes">Notes <small>Optional</small></label><textarea id="notes" rows="3" data-scope="log" data-field="notes" placeholder="${form.status === "Modified" ? "What did you change?" : "Anything useful to remember?"}">${escapeHtml(form.notes)}</textarea></div>
          ${unplanned ? `<p class="hint">${icon("refresh", 17)} A high-load activity may change the next 24–48 hours.</p>` : ""}
          ${button('Save activity <span aria-hidden="true">→</span>', "save-activity", { className: "full" })}
        </div>
      </section>
    </main>`;
}

/*
 * Shows a preview before changing the plan.
 * `ui.pending` can represent either a changed schedule or a high-load activity.
 */
function renderAdjustment() {
  const pending = ui.pending;
  const isSchedule = pending.kind === "schedule";
  const newDay = isSchedule ? pending.schedule.matchDay : "";
  const newTime = isSchedule ? pending.schedule.matchTime : "";
  return `
    <main class="outcome-page adjustment-page">
      <div class="adjustment-card">
        <span class="section-kicker">REVIEW PLAN CHANGES</span>
        <h1>${isSchedule ? "Your schedule changes the week." : "Recovery needs a little more room."}</h1>
        <p>${isSchedule ? `Your ${escapeHtml(newDay)} match stays fixed. We adjusted optional work around it.` : "The high-effort team session you logged increases today’s load. Fixed commitments remain unchanged."}</p>
        <div class="change-comparison">
          <div><small>${isSchedule ? "BEFORE" : "WED 29"}</small>${pill(isSchedule ? "SATURDAY MATCH" : "PLANNED")}<h3>${isSchedule ? "Match · Saturday" : "Conditioning"}</h3><span>${isSchedule ? "15:00" : "35 min · Moderate"}</span></div>
          <span class="change-arrow">→</span>
          <div class="new"><small>${isSchedule ? "AFTER" : "WED 29"}</small>${pill(isSchedule ? `${newDay.toUpperCase()} MATCH` : "RECOVERY", "lime")}<h3>${isSchedule ? `Match · ${escapeHtml(newDay)}` : "Mobility reset"}</h3><span>${isSchedule ? escapeHtml(newTime) : "20 min · Easy"}</span></div>
        </div>
        <div class="reason-box"><span class="round-icon">${icon("shield")}</span><div><strong>Why this changed</strong><p>${isSchedule ? "Optional lower-body work is kept away from the updated match day." : "This avoids consecutive high-load days while preserving team practice and the match."}</p></div></div>
        <div class="button-row">${button("Apply changes", "apply-adjustment")}${button("Keep current plan", "dismiss-adjustment", { variant: "secondary" })}</div>
      </div>
    </main>`;
}

/*
 * Builds one weekly-plan row per item in data.plan.
 * The callback passed to map() can do several calculations before returning HTML.
 */
function renderWeek() {
  const rows = data.plan.map((item) => {
    const interactive = !item.fixed && item.type !== "Rest";
    // Nested template strings add time and duration only when those values exist.
    const meta = `${item.time ? `${item.time} · ` : ""}${item.duration ? `${item.duration} min · ` : ""}${item.intensity}`;
    return `
      <button type="button" class="plan-row" ${interactive ? 'data-action="open-workout"' : ""}>
        <span class="day-dot ${item.fixed ? "fixed" : item.type.toLowerCase()}"></span>
        <span class="plan-day">${escapeHtml(item.day)}</span>
        <span class="plan-main"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(meta)}</small></span>
        ${pill(item.fixed ? item.type.toUpperCase() : item.status.toUpperCase(), item.fixed ? "dark" : item.type === "Recovery" ? "lime" : "neutral")}
        ${interactive ? icon("arrow", 18) : ""}
      </button>`;
  }).join("");

  return `
    <main class="screen">
      ${screenHeader("ROLLING PLAN", "Your next 7 days", '<button type="button" class="date-control">28 Jul — 3 Aug</button>')}
      <section class="week-card">
        <div class="week-summary">
          <div><span class="eyebrow">WEEK SHAPE</span><strong>2 focused sessions</strong><p>with protected recovery around your match</p></div>
          <div class="load-bars" aria-label="Training load preview">${[2, 1, 4, 1, 5, 1, 3].map((height, index) => `<span style="height:${height * 11}px" class="${index === 4 ? "match" : ""}"></span>`).join("")}</div>
        </div>
        <div class="plan-list">${rows}</div>
        <div class="week-legend"><span><i class="legend-fixed"></i> Fixed team commitment</span><span><i class="legend-plan"></i> PureAthletic recommendation</span></div>
      </section>
    </main>`;
}

/*
 * Calculates and renders the progress summary.
 * filter() keeps matching activities; reduce() adds all activity durations.
 */
function renderProgress() {
  const completed = data.activities.filter((activity) => activity.status === "Completed").length;
  const modified = data.activities.filter((activity) => activity.status === "Modified").length;
  const minutes = data.activities.reduce((sum, activity) => sum + Number(activity.duration || 0), 0);

  // Return early with an empty state when there are no activities to summarize.
  if (!data.activities.length) {
    return `
      <main class="screen">
        ${screenHeader("21 — 27 JULY", "Your week, in context.", '<button type="button" class="date-control">Previous week</button>')}
        <section class="empty-state"><span class="empty-icon">${icon("progress", 32)}</span><h2>Your first review is taking shape.</h2><p>Log a few sessions and check-ins. After seven days, useful patterns will appear here.</p></section>
      </main>`;
  }

  const loads = data.activities.slice(-5).map((activity) => Math.min(100, Math.round((activity.duration * activity.effort) / 8)));
  const bars = [34, 52, 46, 66, ...loads].slice(-7).map((height) => `<i style="height:${Math.max(12, height)}%"></i>`).join("");
  const completePercent = Math.max(15, (completed / data.activities.length) * 100);
  return `
    <main class="screen">
      ${screenHeader("21 — 27 JULY", "Your week, in context.", '<button type="button" class="date-control">Previous week</button>')}
      <div class="progress-layout">
        <section class="stat-card accent-stat"><span class="eyebrow">APPROPRIATE CONSISTENCY</span><div class="stat-main"><strong>${completed + modified}</strong><span>sessions completed<br>or modified</span></div><p>Rest and recovery count when they are the appropriate recommendation.</p></section>
        <section class="stat-card"><span class="eyebrow">TRAINING TIME</span><div class="stat-main"><strong>${minutes}</strong><span>minutes<br>logged</span></div><div class="trend-bars">${bars}</div></section>
        <section class="stat-card"><span class="eyebrow">SESSION OUTCOMES</span><div class="donut-row"><div class="donut" style="--complete:${completePercent}%"><span>${data.activities.length}</span></div><div class="donut-legend"><span><i class="complete"></i> Completed <strong>${completed}</strong></span><span><i class="modified"></i> Modified <strong>${modified}</strong></span><span><i class="other"></i> Other <strong>${data.activities.length - completed - modified}</strong></span></div></div></section>
        <section class="stat-card wide-stat"><div><span class="eyebrow">NOTABLE THIS WEEK</span><h2>You made the plan fit real life.</h2><p>${data.adjustments.length ? "The week adapted after new activity while keeping your team commitments fixed." : "Your logged sessions are starting to create a clearer picture of the week."}</p></div><span class="achievement">${icon("bolt", 28)}</span></section>
      </div>
    </main>`;
}

// Builds the athlete summary and settings rows.
function renderProfile() {
  const userName = data.user.name || "Athlete";
  return `
    <main class="screen">
      ${screenHeader("ATHLETE PROFILE", "Your setup")}
      <div class="profile-grid">
        <section class="profile-card">
          <div class="profile-identity"><span class="large-avatar">${escapeHtml(userName.slice(0, 1).toUpperCase())}</span><div><h2>${escapeHtml(userName)}</h2><p>${escapeHtml(data.user.position)} · ${escapeHtml(data.user.experience)}</p>${pill(data.user.goal.toUpperCase(), "lime")}</div></div>
          <div class="profile-facts"><div><span>Availability</span><strong>${data.user.availability.length} days / week</strong></div><div><span>Equipment</span><strong>${data.user.equipment.length} options</strong></div></div>
        </section>
        <section class="settings-card">
          <span class="settings-label">TRAINING SETUP</span>
          ${settingsRow("profile", "Athlete details", "Position, experience, primary goal")}
          ${settingsRow("week", "Team schedule", `${data.schedule.practiceDay} practice · ${data.schedule.matchDay} match`, "edit-schedule")}
          ${settingsRow("bolt", "Equipment & availability", "What you can use and when")}
          <span class="settings-label">PREFERENCES & DATA</span>
          <button type="button" data-action="toggle-notifications"><span class="settings-icon">${icon("today")}</span><span><strong>Check-in reminders</strong><small>${ui.notifications ? "On · before optional training" : "Off"}</small></span><span class="toggle ${ui.notifications ? "on" : ""}"><i></i></span></button>
          ${settingsRow("download", "Export my data", "Download this prototype’s local data", "export-data")}
          ${settingsRow("refresh", "Restart demo", "Restore the seeded prototype", "reset-demo")}
          ${settingsRow("trash", "Delete local account", "Clears all prototype data", "delete-data", "danger-row")}
        </section>
      </div>
    </main>`;
}

/*
 * A small reusable settings-row builder.
 * Empty default arguments make the action and extra CSS class optional.
 */
function settingsRow(iconName, title, detail, action = "", className = "") {
  return `<button type="button" class="${className}" ${action ? `data-action="${action}"` : ""}><span class="settings-icon">${icon(iconName)}</span><span><strong>${title}</strong><small>${detail}</small></span>${icon("arrow")}</button>`;
}

// Builds the form used to edit fixed practice and match commitments.
function renderScheduleEditor() {
  const schedule = ui.scheduleForm;
  return `
    <main class="focused-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-profile" aria-label="Back">${icon("back")}</button><span class="focused-title">Team schedule</span><span></span></header>
      <section class="form-shell schedule-editor">
        <span class="section-kicker">FIXED COMMITMENTS</span><h1>Keep the week accurate.</h1><p class="lead">Changes here may reshape optional sessions. You will review everything before it is applied.</p>
        ${scheduleCard("TEAM PRACTICE", "practice", schedule, "schedule")}
        ${scheduleCard("MATCH", "match", schedule, "schedule")}
        <div class="info-card">${icon("shield")}<div><strong>Fixed means fixed</strong><p>PureAthletic can move optional sessions around these entries, but never moves team commitments automatically.</p></div></div>
        ${button("Review schedule changes", "preview-schedule")}
      </section>
    </main>`;
}

/*
 * Shows only the latest plan change.
 * Returning "" means "render nothing" when the adjustment list is empty.
 */
function renderHistory() {
  if (!data.adjustments.length) return "";
  const adjustment = data.adjustments[0];
  return `
    <aside class="history-toast">
      <div><span class="eyebrow">RECENT PLAN CHANGE</span><strong>${escapeHtml(adjustment.title)}</strong><small>${escapeHtml(adjustment.reason)}</small></div>
      ${adjustment.undoable ? `<button type="button" data-action="undo-adjustment" data-id="${adjustment.id}">Undo</button>` : ""}
    </aside>`;
}

// =============================================================================
// SCREEN ROUTER
// =============================================================================

/*
 * The central renderer decides which screen function to run.
 *
 * Focused screens take over the whole page. Main app screens are first rendered
 * as content and then placed inside renderAppShell(). The final fallback shows
 * Today if ui.screen contains an unknown value.
 */
function render() {
  if (ui.screen === "landing") {
    renderLanding();
    initializeMotion();
    return;
  }

  const focusedScreens = {
    onboarding: renderOnboarding,
    checkin: renderCheckIn,
    outcome: renderOutcome,
    safety: renderOutcome,
    workout: () => renderWorkout(false),
    "short-workout": () => renderWorkout(true),
    log: renderActivityLog,
    adjustment: renderAdjustment,
    schedule: renderScheduleEditor
  };

  // A function is stored as the object's value, then () calls that function.
  if (focusedScreens[ui.screen]) {
    app.innerHTML = focusedScreens[ui.screen]();
    initializeMotion();
    return;
  }

  const appScreens = {
    today: renderToday,
    week: renderWeek,
    progress: renderProgress,
    profile: renderProfile
  };
  app.innerHTML = renderAppShell((appScreens[ui.screen] || renderToday)());
  initializeMotion();
}

/*
 * Navigation always follows the same three steps:
 * update the screen name, move to the top, and render the new screen.
 */
function setScreen(screen) {
  ui.screen = screen;
  window.scrollTo({ top: 0, behavior: "instant" });
  render();
}

// =============================================================================
// ACTIONS THAT CHANGE APPLICATION STATE
// =============================================================================

// Replaces the current saved account with a fresh, independent demo copy.
function enterDemo() {
  data = clone(demoState);
  saveData();
  setScreen("today");
}

/*
 * Converts the temporary onboarding form into lasting application data.
 * `...clone(demoState)` uses spread syntax to copy all demo properties first;
 * the properties below it then replace onboarded, user, and schedule.
 */
function finishOnboarding() {
  const user = clone(ui.onboardingForm);
  user.name = user.name.trim() || "Sam";
  data = {
    ...clone(demoState),
    onboarded: true,
    user,
    schedule: clone(ui.onboardingSchedule)
  };
  saveData();
  setScreen("today");
}

/*
 * Applies the prototype's readiness rules.
 * It starts with the normal recommendation, then replaces it when pain or very
 * poor readiness triggers a rule. Only the first matching branch runs.
 */
function submitCheckIn() {
  const form = clone(ui.checkinForm);
  let kind = "good";
  let recommendation = clone(data.recommendation);
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

  /*
   * Spread syntax copies the old data, then the following properties overwrite
   * the parts that changed. [adjustment, ...data.adjustments] adds the newest
   * item to the front of the old adjustment list.
   */
  data = {
    ...data,
    checkInDone: true,
    checkIn: form,
    recommendation,
    adjustments: adjustment ? [adjustment, ...data.adjustments] : data.adjustments
  };
  ui.outcome = kind;
  saveData();
  setScreen("outcome");
}

// Creates the temporary form values for a planned or unplanned activity.
function openLog(unplanned, status = "Completed") {
  ui.logConfig = { unplanned, status };
  ui.logForm = {
    type: unplanned ? "Team practice" : "Strength",
    status: unplanned ? "Completed" : status,
    duration: unplanned ? 75 : 42,
    effort: unplanned ? 8 : 6,
    pain: "None",
    notes: ""
  };
  setScreen("log");
}

/*
 * Turns the temporary log form into a saved activity.
 * map() creates a new plan array, changing only Tuesday when appropriate.
 * Date.now() supplies a simple numeric identifier based on the current time.
 */
function saveActivity() {
  const form = clone(ui.logForm);
  const activity = {
    ...form,
    id: Date.now(),
    title: ui.logConfig.unplanned ? form.type : data.recommendation.title,
    date: "Tue 28"
  };
  const activities = [activity, ...data.activities];
  const plan = data.plan.map((item) => item.id === "tue" && !ui.logConfig.unplanned ? { ...item, status: form.status } : item);
  const nextData = { ...data, activities, plan };

  // Moderate or severe pain takes the safety route and ends this function early.
  if (["Moderate", "Severe"].includes(form.pain)) {
    const severe = form.pain === "Severe";
    nextData.recommendation = {
      ...data.recommendation,
      type: "Safety",
      title: severe ? "Stop training and seek advice" : "Intense training removed",
      status: "Safety",
      duration: 0,
      purpose: `${form.pain} pain was reported after activity. Review the safety guidance.`
    };
    nextData.adjustments = [{ id: Date.now() + 1, title: "Future intense work restricted", reason: `Safety rule · ${form.pain.toLowerCase()} pain`, undoable: false }, ...data.adjustments];
    data = nextData;
    ui.outcome = severe ? "severe" : "moderate";
    saveData();
    setScreen("outcome");
    return;
  }

  data = nextData;
  saveData();

  // High duration AND high effort creates a plan-change preview.
  if (form.duration >= 60 && form.effort >= 8) {
    ui.pending = { kind: "activity", originalPlan: clone(data.plan) };
    setScreen("adjustment");
  } else {
    setScreen("today");
  }
}

/*
 * Applies the plan-change preview kept in ui.pending.
 * A schedule change updates the match; an activity change replaces Wednesday
 * with recovery. The old values are retained so an undo can restore them.
 */
function applyAdjustment() {
  const pending = ui.pending;
  if (pending.kind === "schedule") {
    const updatedPlan = data.plan.map((item) => item.id === "sat"
      ? { ...item, day: `${pending.schedule.matchDay.slice(0, 3).toUpperCase()} · UPDATED`, time: pending.schedule.matchTime }
      : item);
    const adjustment = { id: Date.now(), title: `Match moved to ${pending.schedule.matchDay}`, reason: "Team schedule changed", undoable: true, beforePlan: data.plan, beforeSchedule: data.schedule };
    data = { ...data, schedule: pending.schedule, plan: updatedPlan, adjustments: [adjustment, ...data.adjustments] };
  } else {
    const updatedPlan = data.plan.map((item) => item.id === "wed"
      ? { ...item, type: "Recovery", title: "Mobility reset", duration: 20, intensity: "Easy", status: "Recovery" }
      : item);
    const adjustment = { id: Date.now(), title: "Recovery replaced conditioning", reason: "Consecutive high-load days avoided", undoable: true, beforePlan: pending.originalPlan };
    data = { ...data, plan: updatedPlan, adjustments: [adjustment, ...data.adjustments] };
  }
  ui.pending = null;
  saveData();
  setScreen("week");
}

/*
 * Finds an adjustment by id and restores any "before" values saved with it.
 * `||` keeps the current value when that particular before-value does not exist.
 */
function undoAdjustment(id) {
  const adjustment = data.adjustments.find((item) => item.id === id);

  // Guard clause: stop immediately if the change is missing or cannot be undone.
  if (!adjustment || !adjustment.undoable) return;
  data = {
    ...data,
    plan: adjustment.beforePlan || data.plan,
    schedule: adjustment.beforeSchedule || data.schedule,
    recommendation: adjustment.beforeRecommendation || data.recommendation,
    adjustments: data.adjustments.filter((item) => item.id !== id)
  };
  saveData();
  render();
}

/*
 * Downloads the current `data` object as a JSON file:
 * Blob creates an in-memory file, an invisible <a> triggers the download, and
 * revokeObjectURL() releases the temporary browser URL afterward.
 */
function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "pureathletic-prototype-data.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

// =============================================================================
// FORM BINDING
// =============================================================================

// Browser inputs normally return strings; checkboxes and numbers need conversion.
function valueForInput(target) {
  if (target.type === "checkbox") return target.checked;
  if (target.type === "number") return Number(target.value);
  return target.value;
}

/*
 * data-scope says which temporary form object to update, while data-field says
 * which property inside that object should receive the input's new value.
 *
 * Example:
 * <input data-scope="onboarding" data-field="name">
 * updates ui.onboardingForm.name.
 */
function updateBoundField(target) {
  // Destructuring reads target.dataset.scope and target.dataset.field.
  const { scope, field } = target.dataset;
  if (!scope || !field) return;
  const scopes = {
    onboarding: ui.onboardingForm,
    onboardingSchedule: ui.onboardingSchedule,
    log: ui.logForm,
    schedule: ui.scheduleForm
  };
  if (scopes[scope]) scopes[scope][field] = valueForInput(target);
}

// =============================================================================
// EVENT LISTENERS
// =============================================================================

/*
 * Instead of attaching a listener to every field, these listeners sit on #app.
 * Browser events "bubble" upward from the clicked or edited element to #app.
 * This is event delegation, and it still works after render() replaces the HTML.
 */

// `input` fires immediately while a user types or changes a number.
app.addEventListener("input", (event) => {
  updateBoundField(event.target);
});

// `change` handles completed changes; checkboxes also need a visual rerender.
app.addEventListener("change", (event) => {
  updateBoundField(event.target);
  if (event.target.type === "checkbox") render();
});

/*
 * All clickable controls use a data-action attribute. closest() also handles a
 * click on a child <span> or SVG by finding its parent action element.
 * The long if/else chain acts as the prototype's action controller.
 */
app.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");

  // Ignore clicks that did not happen inside an element with data-action.
  if (!target) return;
  const action = target.dataset.action;

  if (action === "start-onboarding") {
    ui.onboardingStep = 1;
    ui.onboardingForm = clone(onboardingSeed.user);
    ui.onboardingSchedule = clone(demoState.schedule);
    setScreen("onboarding");
  } else if (action === "enter-demo") {
    enterDemo();
  } else if (action === "exit-onboarding") {
    setScreen("landing");
  } else if (action === "onboarding-back") {
    if (ui.onboardingStep === 1) setScreen("landing");
    else {
      ui.onboardingStep -= 1;
      render();
    }
  } else if (action === "onboarding-next") {
    if (ui.onboardingStep < 5) {
      ui.onboardingStep += 1;
      render();
    } else {
      finishOnboarding();
    }
  } else if (action === "set-experience") {
    ui.onboardingForm.experience = target.dataset.value;
    render();
  } else if (action === "set-goal") {
    ui.onboardingForm.goal = target.dataset.value;
    render();
  } else if (action === "navigate") {
    setScreen(target.dataset.screen);
  } else if (action === "open-checkin") {
    ui.checkinForm = { sleep: 3, energy: 3, soreness: 2, stress: 2, pain: "None" };
    setScreen("checkin");
  } else if (action === "set-checkin-scale") {
    ui.checkinForm[target.dataset.field] = Number(target.dataset.value);
    render();
  } else if (action === "set-checkin-pain") {
    ui.checkinForm.pain = target.dataset.value;
    render();
  } else if (action === "submit-checkin") {
    submitCheckIn();
  } else if (action === "review-safety") {
    // Optional chaining (?.) safely reads pain even if checkIn does not exist.
    ui.outcome = data.checkIn?.pain === "Severe" ? "severe" : "moderate";
    setScreen("safety");
  } else if (action === "continue-outcome") {
    setScreen(ui.outcome === "good" ? "workout" : "today");
  } else if (action === "open-workout") {
    ui.workoutDone = [];
    setScreen("workout");
  } else if (action === "open-short-workout") {
    ui.workoutDone = [];
    setScreen("short-workout");
  } else if (action === "toggle-exercise") {
    const index = Number(target.dataset.index);

    // Remove the index if selected already; otherwise add it to a new array.
    ui.workoutDone = ui.workoutDone.includes(index)
      ? ui.workoutDone.filter((item) => item !== index)
      : [...ui.workoutDone, index];
    render();
  } else if (action === "open-planned-log") {
    openLog(false, target.dataset.status);
  } else if (action === "open-unplanned-log") {
    openLog(true);
  } else if (action === "set-log-status") {
    ui.logForm.status = target.dataset.value;
    render();
  } else if (action === "set-log-pain") {
    ui.logForm.pain = target.dataset.value;
    render();
  } else if (action === "save-activity") {
    saveActivity();
  } else if (action === "apply-adjustment") {
    applyAdjustment();
  } else if (action === "dismiss-adjustment") {
    ui.pending = null;
    setScreen("today");
  } else if (action === "edit-schedule") {
    ui.scheduleForm = clone(data.schedule);
    setScreen("schedule");
  } else if (action === "preview-schedule") {
    ui.pending = { kind: "schedule", schedule: clone(ui.scheduleForm) };
    setScreen("adjustment");
  } else if (action === "toggle-notifications") {
    ui.notifications = !ui.notifications;
    render();
  } else if (action === "export-data") {
    exportData();
  } else if (action === "delete-data") {
    if (window.confirm("Delete all local prototype data? This cannot be undone.")) {
      localStorage.removeItem(STORAGE_KEY);
      data = clone(onboardingSeed);
      setScreen("landing");
    }
  } else if (action === "reset-demo") {
    if (window.confirm("Restart with the original seeded demo data?")) enterDemo();
  } else if (action === "undo-adjustment") {
    undoAdjustment(Number(target.dataset.id));
  } else if (action === "back-profile") {
    setScreen("profile");
  } else if (action === "back-today") {
    setScreen("today");
  }
});

// First render: this starts the application after the file has loaded.
render();
