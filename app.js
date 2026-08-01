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
const STORAGE_KEY = "pureathletic-prototype-v2";
const YOUTH_DATA_BASE = "/data/youth-football";

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
 * Example: initialPlan[0].title gives "Football strength foundations".
 */
const initialPlan = [
  { id: "tue", day: "TODAY · TUE 28", type: "Strength", title: "Football strength foundations", duration: 30, intensity: "Moderate", status: "Planned", fixed: false },
  { id: "wed", day: "WED 29", type: "Rest", title: "Full rest", duration: 0, intensity: "Easy", status: "Rest", fixed: false },
  { id: "practice", day: "THU 30", type: "Team practice", title: "Team training", duration: 90, intensity: "Team-led", status: "Fixed", fixed: true, time: "19:00" },
  { id: "fri", day: "FRI 31", type: "Recovery", title: "Mobility reset", duration: 20, intensity: "Easy", status: "Recovery", fixed: false },
  { id: "match", day: "SAT 1", type: "Match", title: "League match", duration: 90, intensity: "Match", status: "Fixed", fixed: true, time: "15:00" },
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
    ageBandId: "u13-u15",
    guardianConfirmed: true,
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
    title: "Football strength foundations",
    duration: 30,
    intensity: "Moderate",
    status: "Planned",
    goalId: "strength",
    ageBandId: "u13-u15",
    purpose: "Build controlled football-strength foundations with enough recovery before Saturday’s match.",
    explanation: "Selected for U13–U15, Intermediate, and Strength, then placed away from the fixed Saturday match.",
    activities: [
      { name: "Mobility and control", detail: "Dynamic ankle, hip, and upper-body movement followed by unloaded squat, hinge, and landing positions." },
      { name: "Technique-first circuit", detail: "Squat-to-target, supported reverse lunge, incline push-up, calf raise, and dead bug with clean technique." },
      { name: "Easy movement", detail: "Walk, reset, and record any exercise that needed an easier option." }
    ]
  },
  plan: initialPlan,
  activities: [
    { id: 1, title: "Speed mechanics", status: "Completed", duration: 35, effort: 6, date: "Mon 27" },
    { id: 2, title: "Mobility reset", status: "Modified", duration: 18, effort: 3, date: "Sun 26" }
  ],
  adjustments: [],
  schedule: {
    practiceEnabled: true,
    practiceDay: "Thursday",
    practiceTime: "19:00",
    matchEnabled: true,
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
    ageBandId: "",
    guardianConfirmed: false,
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
  { name: "Mobility and control", detail: "Dynamic movement and unloaded technique rehearsal." },
  { name: "Technique-first circuit", detail: "Controlled squat, lunge, push, calf, and core patterns." },
  { name: "Easy movement", detail: "Walk, reset, and record technique notes." }
];

// These values are reused to build choices instead of repeating the HTML by hand.
const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const teamAgeBands = [
  { value: "u5-u8", label: "U5–U8", teamAgeGroups: ["U5", "U6", "U7", "U8"] },
  { value: "u9-u12", label: "U9–U12", teamAgeGroups: ["U9", "U10", "U11", "U12"] },
  { value: "u13-u15", label: "U13–U15", teamAgeGroups: ["U13", "U14", "U15"] },
  { value: "u16-u17", label: "U16–U17", teamAgeGroups: ["U16", "U17"] }
];
const goalIdsByLabel = {
  "Match readiness": "match_readiness",
  Strength: "strength",
  Speed: "speed",
  Endurance: "endurance",
  "General fitness": "general_fitness"
};

const youthRecommendationDataPromise = Promise.all(
  ["taxonomy.json", "routine-catalog.json", "recommendation-index.json"].map(
    async (fileName) => {
      const response = await fetch(`${YOUTH_DATA_BASE}/${fileName}`);
      if (!response.ok) {
        throw new Error(`Could not load ${fileName}`);
      }
      return response.json();
    }
  )
).then(([taxonomy, routineCatalog, recommendationIndex]) => ({
  taxonomy,
  routineCatalog,
  recommendationIndex
})).catch(() => null);

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

// Each rendered screen has a stable, shareable browser URL.
const screenRoutes = {
  landing: "/",
  onboarding: "/onboarding",
  today: "/today",
  week: "/training",
  progress: "/progress",
  profile: "/profile",
  checkin: "/check-in",
  outcome: "/check-in/result",
  safety: "/safety",
  workout: "/training/workout",
  "short-workout": "/training/workout/short",
  log: "/activity/log",
  adjustment: "/training/review",
  schedule: "/profile/schedule"
};
const routeScreens = Object.fromEntries(
  Object.entries(screenRoutes).map(([screen, route]) => [route, screen])
);
const screenTitles = {
  landing: "PureAthletic · Age-aware football training",
  onboarding: "Create your plan · PureAthletic",
  today: "Today · PureAthletic",
  week: "Training plan · PureAthletic",
  progress: "Progress · PureAthletic",
  profile: "Profile · PureAthletic",
  checkin: "Daily check-in · PureAthletic",
  outcome: "Check-in result · PureAthletic",
  safety: "Safety guidance · PureAthletic",
  workout: "Training session · PureAthletic",
  "short-workout": "Short training session · PureAthletic",
  "training-detail": "Session details · PureAthletic",
  log: "Log activity · PureAthletic",
  adjustment: "Review plan changes · PureAthletic",
  schedule: "Team schedule · PureAthletic"
};

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
  selectedPlanItemId: "tue",
  outcome: "good",
  logConfig: { unplanned: false, status: "Completed", planItemId: "tue" },
  logForm: null,
  pending: null,
  notifications: true,
  generatingPlan: false
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
    if (!saved) return clone(onboardingSeed);

    const restored = JSON.parse(saved);
    const previousAgeGroup = restored.user?.ageGroup;
    const selectedAgeBand = teamAgeBands.find(
      (option) => option.value === restored.user?.ageBandId
    ) || teamAgeBands.find((option) =>
      option.teamAgeGroups.includes(String(previousAgeGroup || "").toUpperCase())
    );

    if (restored.user?.experience === "Advanced" || !selectedAgeBand) {
      localStorage.removeItem(STORAGE_KEY);
      return clone(onboardingSeed);
    }

    // Version-two profiles stored an exact team group. Keep those profiles,
    // but minimise the saved value to the broader band now used by the UI.
    restored.user.ageBandId = selectedAgeBand.value;
    delete restored.user.ageGroup;
    if (previousAgeGroup) {
      if (restored.recommendation?.explanation) {
        restored.recommendation.explanation = restored.recommendation.explanation
          .replace(previousAgeGroup, selectedAgeBand.label);
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(restored));
    }

    return restored;
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
        duration: 540,
        delay: Math.min(index * 62, 434),
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
        duration: 580,
        delay: 190 + index * 50,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        fill: "backwards"
      }
    );
  });

  app.querySelectorAll(".stat-main > strong").forEach((metric) => {
    const finalValue = Number(metric.textContent);
    if (!Number.isFinite(finalValue) || finalValue <= 0) return;

    const startedAt = performance.now();
    const duration = 680;
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
      { opacity: 0.1, transform: "scale(0.12)" },
      { opacity: 0, transform: "scale(1)" }
    ],
    {
      duration: 700,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    }
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
      duration: 250,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      fill: "forwards"
    }
  );
}

function installButtonMotion() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  app.querySelectorAll("button").forEach((button) => {
    button.classList.add("motion-control");
    button.addEventListener("pointerdown", (event) => addButtonRipple(button, event));

    if (!finePointer || button.disabled) return;

    button.addEventListener("pointerenter", () => animateButtonArrow(button, true));
    button.addEventListener("pointerleave", () => animateButtonArrow(button, false));
  });
}

function installCardMotion() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  app.querySelectorAll(".plain-card, .stat-card, .profile-card, .week-card, .empty-state")
    .forEach((card) => {
      let animation;

      function moveCard(raised) {
        if (animation) animation.cancel();
        const currentTransform = getComputedStyle(card).transform;
        const nextAnimation = card.animate(
          [
            { transform: currentTransform },
            { transform: raised ? "translateY(-4px)" : "translateY(0)" }
          ],
          {
            duration: raised ? 270 : 340,
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

function installPreviewHover() {
  const preview = app.querySelector(".hero-preview");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!preview || !finePointer) return;

  let animation;

  function startPreviewHover() {
    if (animation) animation.cancel();
    animation = preview.animate([
      { transform: "perspective(900px) translateY(-4px) rotate(1.5deg) rotateX(0) rotateY(0)" },
      { transform: "perspective(900px) translateY(-4px) rotate(1deg) rotateX(-0.7deg) rotateY(5deg)" },
      { transform: "perspective(900px) translateY(-4px) rotate(1.5deg) rotateX(0) rotateY(0)" },
      { transform: "perspective(900px) translateY(-4px) rotate(2deg) rotateX(0.7deg) rotateY(-4deg)" },
      { transform: "perspective(900px) translateY(-4px) rotate(1.5deg) rotateX(0) rotateY(0)" }
    ], {
      duration: 2200,
      easing: "ease-in-out",
      iterations: Infinity,
      fill: "both"
    });
  }

  function stopPreviewHover() {
    const currentTransform = getComputedStyle(preview).transform;
    if (animation) animation.cancel();
    const resetAnimation = preview.animate([
      { transform: currentTransform },
      { transform: "perspective(900px) translateY(0) rotate(1.5deg) rotateX(0) rotateY(0)" }
    ], {
      duration: 380,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)"
    });
    animation = resetAnimation;
    resetAnimation.onfinish = () => {
      if (animation === resetAnimation) resetAnimation.cancel();
    };
  }

  preview.classList.add("motion-preview");
  preview.addEventListener("pointerenter", startPreviewHover);
  preview.addEventListener("pointerleave", stopPreviewHover);
}

function initializeMotion() {
  if (prefersReducedMotion()) return;

  installButtonMotion();
  installCardMotion();
  installPreviewHover();

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
  return options.map((option) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    return `<option value="${escapeHtml(value)}"${value === selected ? " selected" : ""}>${escapeHtml(label)}</option>`;
  }).join("");
}

function ageBandLabel(ageBandId) {
  return teamAgeBands.find((option) => option.value === ageBandId)?.label
    || "Age group not set";
}

function sessionTypeLabel(sessionType) {
  const labels = {
    active_play: "Active play",
    mixed_play: "Football play",
    speed_play: "Speed play"
  };

  return labels[sessionType]
    || sessionType
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
}

function recommendationFromCatalog(user, catalog) {
  const experience = user.experience.toLowerCase();
  const goalId = goalIdsByLabel[user.goal] || "general_fitness";
  const ageBand = catalog.taxonomy.ageBands.find((candidate) =>
    candidate.id === user.ageBandId
  );

  if (!ageBand || !["beginner", "intermediate"].includes(experience)) {
    throw new Error("The selected age group or experience is not available.");
  }

  const routineId =
    catalog.recommendationIndex.index[ageBand.id][experience][goalId];
  const routine = catalog.routineCatalog.routines.find(
    (candidate) => candidate.id === routineId
  );

  if (!routine) {
    throw new Error("The selected routine is missing from the catalog.");
  }

  return {
    id: routine.id,
    type: sessionTypeLabel(routine.sessionType),
    title: routine.title,
    duration: routine.durationMinutesByLevel[experience],
    intensity:
      routine.intensityByLevel[experience].charAt(0).toUpperCase()
      + routine.intensityByLevel[experience].slice(1),
    status: "Planned",
    goalId,
    ageBandId: ageBand.id,
    purpose: routine.purpose,
    explanation: `Selected from the U5–U17 catalog for ${ageBandLabel(user.ageBandId)}, ${user.experience}, and ${user.goal}. Fixed commitments are then used to place and protect the session.`,
    progression: routine.levelProgressions[experience],
    supervision: routine.supervision,
    activities: routine.blocks.map((block) => ({
      name: block.title,
      detail: block.activities.join(" ")
    }))
  };
}

function fallbackRecommendation(user) {
  const fallbacks = {
    "Match readiness": {
      type: "Technical",
      title: "Match confidence touches",
      purpose: "Use familiar, low-fatigue ball actions so you arrive confident and fresh."
    },
    Strength: {
      type: "Strength",
      title: "Body-control foundations",
      purpose: "Practise supervised, technique-first football strength and movement control."
    },
    Speed: {
      type: "Speed",
      title: "React, accelerate and stop",
      purpose: "Practise a few short accelerations and controlled stops with full recovery."
    },
    Endurance: {
      type: "Conditioning",
      title: "Ball interval games",
      purpose: "Build repeatable football movement through short ball rounds and easy recovery."
    },
    "General fitness": {
      type: "Mixed",
      title: "Football foundations",
      purpose: "Combine ball skill, movement control, and an easy football-focused finish."
    }
  };
  const selected = fallbacks[user.goal] || fallbacks["General fitness"];

  return {
    id: `fallback-${goalIdsByLabel[user.goal] || "general_fitness"}`,
    ...selected,
    duration: user.ageBandId === "u5-u8" ? 15 : 20,
    intensity: "Easy",
    status: "Planned",
    goalId: goalIdsByLabel[user.goal] || "general_fitness",
    ageBandId: user.ageBandId,
    purpose: selected.purpose,
    explanation: `A conservative offline fallback selected for ${ageBandLabel(user.ageBandId)} and ${user.goal}.`,
    activities: [
      { name: "Easy preparation", detail: "Start with comfortable movement and familiar ball touches." },
      { name: selected.title, detail: selected.purpose },
      { name: "Easy finish", detail: "Walk, breathe comfortably, and stop if anything feels wrong." }
    ]
  };
}

function commitmentEnabled(schedule, prefix) {
  return schedule?.[`${prefix}Enabled`] !== false;
}

function activeCommitments(schedule) {
  const commitments = [];

  if (commitmentEnabled(schedule, "practice")) {
    commitments.push({
      type: "Team practice",
      day: schedule.practiceDay,
      time: schedule.practiceTime
    });
  }
  if (commitmentEnabled(schedule, "match")) {
    commitments.push({
      type: "Match",
      day: schedule.matchDay,
      time: schedule.matchTime
    });
  }

  return commitments;
}

function commitmentSummary(schedule) {
  const commitments = activeCommitments(schedule);
  return commitments.length
    ? commitments
      .map((item) => `${item.type}: ${item.day} · ${item.time}`)
      .join(" · ")
    : "No fixed commitments";
}

function nextFixedCommitment(schedule) {
  return activeCommitments(schedule)[0] || null;
}

function planWithRecommendationAndSchedule(recommendation, schedule, sourcePlan = initialPlan) {
  return sourcePlan.map((item) => {
    if (item.id === "tue") {
      return {
        ...item,
        type: recommendation.type,
        title: recommendation.title,
        duration: recommendation.duration,
        intensity: recommendation.intensity,
        status: "Planned",
        fixed: false
      };
    }

    if (item.id === "practice") {
      return commitmentEnabled(schedule, "practice")
        ? {
          ...item,
          day: `${schedule.practiceDay.slice(0, 3).toUpperCase()} · FIXED`,
          time: schedule.practiceTime,
          type: "Team practice",
          title: "Team training",
          duration: 90,
          intensity: "Team-led",
          status: "Fixed",
          fixed: true
        }
        : {
          ...item,
          type: "Rest",
          title: "Open day",
          duration: 0,
          intensity: "Easy",
          status: "Rest",
          fixed: false,
          time: ""
        };
    }

    if (item.id === "match") {
      return commitmentEnabled(schedule, "match")
        ? {
          ...item,
          day: `${schedule.matchDay.slice(0, 3).toUpperCase()} · FIXED`,
          time: schedule.matchTime,
          type: "Match",
          title: "Match",
          duration: 90,
          intensity: "Match",
          status: "Fixed",
          fixed: true
        }
        : {
          ...item,
          type: "Rest",
          title: "Open day",
          duration: 0,
          intensity: "Easy",
          status: "Rest",
          fixed: false,
          time: ""
        };
    }

    return item;
  });
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
        <h1>Let’s keep junior training useful and safe.</h1>
        <p class="lead">PureAthletic provides general, age-group training guidance for U5–U17 footballers. It does not diagnose injury, provide treatment, or replace a qualified professional.</p>
        <label class="check-card">
          <input type="checkbox" data-scope="onboarding" data-field="guardianConfirmed"${form.guardianConfirmed ? " checked" : ""}>
          <span><strong>A parent or guardian approves this setup</strong><small>A responsible adult must know when and where every junior session takes place.</small></span>
        </label>
        <label class="check-card">
          <input type="checkbox" data-scope="onboarding" data-field="disclaimerAccepted"${form.disclaimerAccepted ? " checked" : ""}>
          <span><strong>We understand the guidance boundary</strong><small>Pain, illness, injury concerns, or return-to-play decisions need qualified support.</small></span>
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
          <input id="name" maxlength="40" autocomplete="given-name" data-scope="onboarding" data-field="name" value="${escapeHtml(form.name)}" placeholder="Sam">
        </div>
        <div class="field">
          <label for="age-band">Team age-group range</label>
          <select id="age-band" data-scope="onboarding" data-field="ageBandId" required>
            <option value="" disabled${form.ageBandId ? "" : " selected"}>Select a range</option>
            ${selectedOptions(teamAgeBands, form.ageBandId)}
          </select>
          <small class="field-note">Choose the range containing the player’s registered team group. These bands match how the training guidance changes; a date of birth is not needed.</small>
        </div>
        <div class="field">
          <label for="position">Position</label>
          <select id="position" data-scope="onboarding" data-field="position">${selectedOptions(["Goalkeeper", "Defender", "Midfielder", "Forward", "Utility player"], form.position)}</select>
        </div>
        <div class="field">
          <label>Training experience</label>
          <div class="choice-grid" role="group" aria-label="Training experience">
            ${["Beginner", "Intermediate"].map((item) => `<button type="button" class="choice ${form.experience === item ? "selected" : ""}" data-action="set-experience" data-value="${item}" aria-pressed="${form.experience === item}"><span>${item}</span></button>`).join("")}
            <button type="button" class="choice choice-unavailable" disabled aria-disabled="true" aria-label="Advanced recommendations are in development">
              <span>Advanced</span><small>In development</small>
            </button>
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
        <div class="stacked-choices" role="group" aria-label="Primary goal">
          <!-- [title, detail] destructures each pair into two named variables. -->
          ${goals.map(([title, detail]) => `
            <button type="button" class="radio-card ${form.goal === title ? "selected" : ""}" data-action="set-goal" data-value="${title}" aria-pressed="${form.goal === title}">
              <span class="radio-dot"></span><span class="radio-copy"><strong>${title}</strong><small>${detail}</small></span>
            </button>`).join("")}
        </div>
      </div>`;
  }

  if (step === 4) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">YOUR WEEK</span>
        <h1>Add the commitments that stay fixed.</h1>
        <p class="lead">Add a team practice, a match, both, or neither. You can change these later.</p>
        ${scheduleCard("TEAM PRACTICE", "practice", schedule, "onboardingSchedule")}
        ${scheduleCard("MATCH", "match", schedule, "onboardingSchedule")}
        <p class="hint">${icon("shield", 17)} Added commitments will never be moved automatically. Leaving both empty is okay.</p>
      </div>`;
  }

  if (step === 5) {
    panel = `
      <div class="step-panel">
        <span class="section-kicker">REVIEW</span>
        <h1>Your first week is ready to build.</h1>
        <div class="review-list">
          <div><span>Athlete</span><strong>${escapeHtml(form.name.trim() || "Sam")} · ${escapeHtml(ageBandLabel(form.ageBandId))} · ${escapeHtml(form.position)}</strong></div>
          <div><span>Experience</span><strong>${escapeHtml(form.experience)}</strong></div>
          <div><span>Primary goal</span><strong>${escapeHtml(form.goal)}</strong></div>
          <div><span>Fixed commitments</span><strong>${escapeHtml(commitmentSummary(schedule))}</strong></div>
          <div><span>Plan logic</span><strong>Age band + experience + primary goal + schedule</strong></div>
        </div>
        <div class="info-card">${icon("shield")}<div><strong>Junior safeguards applied</strong><p>Age-band limits, supervision, readiness, recovery, and any fixed match or practice take priority over the selected goal.</p></div></div>
      </div>`;
  }

  // Safety consent and the recommendation-driving age band are both required.
  const stepIsValid =
    (step !== 1 || (form.guardianConfirmed && form.disclaimerAccepted))
    && (step !== 2 || Boolean(form.ageBandId));
  const canContinue = !ui.generatingPlan && stepIsValid;
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
            <span>${ui.generatingPlan ? "Building your plan…" : step === total ? "Generate my plan" : "Continue"} ${ui.generatingPlan ? "" : '<span aria-hidden="true">→</span>'}</span>
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
  const enabled = commitmentEnabled(schedule, prefix);

  if (!enabled) {
    return `
      <div class="schedule-card schedule-card-empty">
        <div class="schedule-card-heading">
          ${pill(label, "neutral")}
          <button type="button" class="commitment-action" data-action="add-commitment" data-prefix="${prefix}" data-scope="${scope}">${icon("plus", 16)} Add</button>
        </div>
        <p>No ${label.toLowerCase()} added.</p>
      </div>`;
  }

  return `
    <div class="schedule-card">
      <div class="schedule-card-heading">
        ${pill(label, "dark")}
        <button type="button" class="commitment-action remove" data-action="remove-commitment" data-prefix="${prefix}" data-scope="${scope}">Remove</button>
      </div>
      <div class="two-fields">
        <div class="field"><label for="${scope}-${dayField}">Day</label><select id="${scope}-${dayField}" data-scope="${scope}" data-field="${dayField}">${selectedOptions(weekdays, schedule[dayField])}</select></div>
        <div class="field"><label for="${scope}-${timeField}">Time</label><input id="${scope}-${timeField}" type="time" data-scope="${scope}" data-field="${timeField}" value="${escapeHtml(schedule[timeField])}"></div>
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
    <a class="${ui.screen === id ? "active" : ""}" href="${routeForScreen(id)}" data-action="navigate" data-screen="${id}"${ui.screen === id ? ' aria-current="page"' : ""}>
      ${icon(iconName)}<span>${label}</span>
    </a>`).join("");
  const userName = data.user.name || "Athlete";

  return `
    <div class="app-shell">
      <aside class="side-nav">
        ${brand()}
        <nav aria-label="Primary navigation">${navigation}</nav>
        <div class="side-user">
          <span class="avatar">${escapeHtml(userName.slice(0, 1).toUpperCase())}</span>
          <div><strong>${escapeHtml(userName)}</strong><small>${escapeHtml(data.user.position)}</small></div>
          <button type="button" data-action="reset-demo" aria-label="Reset demo">${icon("refresh", 16)}</button>
        </div>
      </aside>
      <div class="app-content">${content}${renderHistory()}</div>
      <nav class="bottom-nav" aria-label="Primary navigation">${navigation}</nav>
    </div>`;
}

/*
 * Builds the Today dashboard from the current recommendation and check-in state.
 * The nested ternaries choose the appropriate buttons and explanation.
 */
function renderToday() {
  const rec = data.recommendation;
  const safety = rec.status === "Safety";
  const nextCommitment = nextFixedCommitment(data.schedule);
  const recommendationActions = !data.checkInDone && !safety
    ? button('Complete check-in <span aria-hidden="true">→</span>', "open-checkin")
    : safety
      ? button("Review guidance", "review-safety", { variant: "light" })
      : `<div class="button-row">${button("Start routine", "open-workout")}${button(`${Math.max(12, Math.round(rec.duration * 0.7))}-min version`, "open-short-workout", { variant: "light" })}</div>`;
  const explanation = safety
    ? "Safety rules take priority over the weekly goal and cannot be bypassed."
    : data.checkInDone
      ? rec.explanation || "Your check-in supports this age- and goal-matched routine."
      : `${rec.explanation || `Selected for ${ageBandLabel(data.user.ageBandId)}, ${data.user.experience}, and ${data.user.goal}.`} Check in first so it can respond to today’s readiness.`;

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
            <div><span class="eyebrow">NEXT FIXED COMMITMENT</span><h3>${nextCommitment ? escapeHtml(nextCommitment.type) : "Nothing added"}</h3><p>${nextCommitment ? `${escapeHtml(nextCommitment.day)} · ${escapeHtml(nextCommitment.time)} · fixed` : "Add a practice or match from your profile when needed."}</p></div>
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
 * Each item in `scales` holds [state key, label, low label, high label, inverted].
 * Native range inputs keep the five-step scales draggable and keyboard friendly.
 */
function renderCheckIn() {
  const scales = [
    ["sleep", "Sleep quality", "Poor", "Great", false],
    ["energy", "Energy", "Low", "High", false],
    ["soreness", "Muscle soreness", "Severe", "None", true],
    ["stress", "Stress", "High", "Low", true]
  ];
  const form = ui.checkinForm;
  const scaleMarkup = scales.map(([key, label, low, high, inverted]) => {
    const displayValue = inverted ? 6 - form[key] : form[key];
    return `
    <div class="scale-field">
      <div class="scale-label"><label for="checkin-${key}">${label}</label><output for="checkin-${key}">${displayValue} / 5</output></div>
      <div class="scale-control" style="--readiness-position: ${(displayValue - 1) * 25}%">
        <div class="scale-track" aria-hidden="true">
          <span class="scale-rail"></span>
          <span class="scale-handle"></span>
        </div>
        <input
          class="scale-slider"
          id="checkin-${key}"
          type="range"
          min="1"
          max="5"
          step="1"
          value="${displayValue}"
          data-scope="checkin"
          data-field="${key}"
          data-inverted="${inverted}"
          aria-label="${label}: ${displayValue} out of 5"
        >
      </div>
      <div class="scale-ends"><span>${low}</span><span>${high}</span></div>
    </div>`;
  }).join("");
  const painWarning = form.pain !== "None"
    ? `<p class="inline-warning" role="alert">${icon("alert", 17)} Any reported pain pauses automated junior training and asks for responsible-adult review.</p>`
    : "";

  return `
    <main class="focused-page checkin-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-today" aria-label="Back to Today">${icon("back")}</button><span class="focused-title">Daily check-in</span><span class="time-hint">~30 sec</span></header>
      <section class="checkin-shell">
        <div class="checkin-intro">${pill("TODAY", "lime")}<h1>How ready do you feel?</h1><p>There are no good or bad answers. This helps shape the most appropriate next step.</p></div>
        <div class="checkin-card">
          ${scaleMarkup}
          <div class="pain-field">
            <div class="scale-label"><span class="field-group-label" id="checkin-pain-label">Pain today</span>${icon("shield", 18)}</div>
            <div class="pain-options" role="group" aria-labelledby="checkin-pain-label">${["None", "Mild", "Moderate", "Severe"].map((pain) => `<button type="button" class="${form.pain === pain ? "selected" : ""} ${pain !== "None" ? "caution" : ""}" data-action="set-checkin-pain" data-value="${pain}" aria-pressed="${form.pain === pain}">${pain}</button>`).join("")}</div>
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
  if (kind === "poor") return { kicker: "RECOMMENDATION UPDATED", title: "A lighter day fits better.", body: "Today’s low sleep and energy make recovery more appropriate than the planned routine.", before: "Planned routine", after: "20-min mobility + recovery" };
  if (kind === "pain") return { kicker: "RESPONSIBLE-ADULT REVIEW", title: "Pause the routine.", body: "Pain was reported. Stop the automated routine and tell a parent, guardian, coach, or another responsible adult. Seek qualified healthcare advice when appropriate.", before: "Planned routine", after: "No automated workout" };
  if (kind === "moderate") return { kicker: "SAFETY ACTION", title: "Intense training removed.", body: "You reported moderate pain. PureAthletic cannot assess an injury or tell you when it is safe to return.", before: "Planned routine", after: "Conservative guidance" };
  if (kind === "severe") return { kicker: "STOP TRAINING", title: "Seek qualified advice.", body: "You reported severe pain. Stop training and tell a parent or guardian. Seek advice from a qualified healthcare or sports professional.", before: "Planned routine", after: "No workout recommended" };
  return { kicker: "CHECK-IN SAVED", title: "Today’s plan still fits.", body: "Your readiness supports the planned session and no safety rule was triggered.", before: null, after: null };
}

// Builds the result screen after a readiness check-in or a pain safety action.
function renderOutcome() {
  const kind = ui.outcome;
  const copy = outcomeCopy(kind);
  const pain = ["pain", "moderate", "severe"].includes(kind);
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
  const routineExercises = data.recommendation.activities?.length
    ? data.recommendation.activities
    : exercises;
  const shown = short
    ? routineExercises.slice(0, Math.max(2, routineExercises.length - 1))
    : routineExercises;
  const duration = short
    ? Math.max(12, Math.round(data.recommendation.duration * 0.7))
    : data.recommendation.duration;
  return `
    <main class="focused-page workout-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-today" aria-label="Back">${icon("back")}</button><span class="focused-title">${short ? "Shorter routine" : "Routine detail"}</span>${pill(`${duration} MIN`)}</header>
      <section class="workout-shell">
        <div class="workout-hero">
          <div>${pill(data.recommendation.type.toUpperCase(), "lime")}<h1>${short ? `${escapeHtml(data.recommendation.title)} · short` : escapeHtml(data.recommendation.title)}</h1><p>${short ? "The essential blocks, kept focused for a tighter day." : escapeHtml(data.recommendation.purpose)}</p></div>
          <div class="difficulty"><span>LEVEL</span><strong>${escapeHtml(data.user.experience)}</strong><div><i></i><i class="${data.user.experience === "Beginner" ? "muted" : ""}"></i><i class="muted"></i><i class="muted"></i></div></div>
        </div>
        <div class="exercise-list">
          <!-- map() turns every exercise object into one clickable HTML row. -->
          ${shown.map((exercise, index) => `
            <button type="button" class="exercise-row ${ui.workoutDone.includes(index) ? "done" : ""}" data-action="toggle-exercise" data-index="${index}" aria-pressed="${ui.workoutDone.includes(index)}">
              <span class="exercise-number">${ui.workoutDone.includes(index) ? icon("check", 17) : String(index + 1).padStart(2, "0")}</span>
              <span><strong>${exercise.name}</strong><small>${exercise.detail}</small></span>${icon("arrow")}
            </button>`).join("")}
        </div>
        <div class="workout-note">${icon("shield")}<p>A responsible adult must know about the session. Follow the listed supervision level, use controlled movement, and stop for pain, dizziness, unusual breathing difficulty, or feeling unwell.</p></div>
        <div class="sticky-actions">
          ${button("Finish and log", "open-planned-log", { attributes: 'data-status="Completed"' })}
          ${button("Log modifications", "open-planned-log", { variant: "secondary", attributes: 'data-status="Modified"' })}
          <button type="button" class="text-button danger-text" data-action="open-planned-log" data-status="Skipped">Skip session</button>
        </div>
      </section>
    </main>`;
}

function planItemGuidance(item) {
  if (item.id === "tue") {
    return {
      purpose: data.recommendation.purpose,
      activities: data.recommendation.activities?.length
        ? data.recommendation.activities
        : exercises
    };
  }

  const guidance = {
    Recovery: {
      purpose: "Use easy movement to reduce stiffness and arrive fresher for the next football commitment.",
      activities: [
        { name: "Easy mobility flow", detail: "Move gently through comfortable ankle, hip, and upper-body ranges." },
        { name: "Low-intensity movement", detail: "Walk or move easily enough to keep the session restorative." },
        { name: "Recovery check", detail: "Finish feeling better than you started and tell an adult about any pain or concern." }
      ]
    },
    Speed: {
      purpose: "Practise short, high-quality acceleration efforts with full recovery between repetitions.",
      activities: [
        { name: "Movement preparation", detail: "Build from easy movement into controlled running mechanics." },
        { name: "Acceleration quality", detail: "Use short efforts with a stable start, strong posture, and a safe stopping area." },
        { name: "Full recovery", detail: "Walk back and wait until ready before the next quality effort." }
      ]
    },
    Strength: {
      purpose: "Build controlled football-strength foundations with technique taking priority over load.",
      activities: [
        { name: "Mobility and control", detail: "Prepare the joints and rehearse each movement without load." },
        { name: "Technique-first circuit", detail: "Use controlled squat, lunge, push, calf, and core patterns." },
        { name: "Easy finish", detail: "Stop before technique drops and record any movement that needed an easier option." }
      ]
    },
    Conditioning: {
      purpose: "Build repeatable football movement through short work periods and visible recovery.",
      activities: [
        { name: "Progressive warm-up", detail: "Increase movement gradually while keeping control and awareness." },
        { name: "Football intervals", detail: "Alternate short movement rounds with enough recovery to preserve quality." },
        { name: "Easy reset", detail: "Walk, breathe normally, and finish without an all-out effort." }
      ]
    },
    "Team practice": {
      purpose: "This is a fixed, team-led commitment. Follow the coach’s session rather than an additional PureAthletic workout.",
      activities: [
        { name: "Follow the team plan", detail: "Use the instructions, space, and equipment provided by the responsible coach." },
        { name: "Keep adults informed", detail: "Tell the coach and a parent or guardian about pain, illness, or feeling unwell." },
        { name: "No extra loading", detail: "Do not add optional hard training around this fixed commitment." }
      ]
    },
    Match: {
      purpose: "This match is a fixed commitment and takes priority over optional training in the plan.",
      activities: [
        { name: "Use the team preparation", detail: "Follow the coach’s warm-up, role, and match-day instructions." },
        { name: "Play within the rules", detail: "Use appropriate equipment and communicate any pain or concern immediately." },
        { name: "Recover afterwards", detail: "Use easy movement, normal food and fluids, and responsible-adult support." }
      ]
    },
    Rest: {
      purpose: "No structured training is planned. This open day gives the week room to recover.",
      activities: [
        { name: "No workout required", detail: "Rest is part of the plan and does not need to be replaced." },
        { name: "Normal easy activity", detail: "Everyday walking and comfortable movement are enough if you feel well." },
        { name: "Prepare for what is next", detail: "Check the next commitment and keep a parent or guardian informed." }
      ]
    }
  };

  return guidance[item.type] || {
    purpose: "Review this planned session before deciding how it fits the day.",
    activities: exercises
  };
}

function renderTrainingDetail() {
  const item = data.plan.find((candidate) => candidate.id === ui.selectedPlanItemId);
  if (!item) return renderWeek();

  const guidance = planItemGuidance(item);
  const canLog = item.type !== "Rest";
  const canCompleteSteps = canLog && !item.fixed;
  const durationLabel = item.duration ? `${item.duration} MIN` : item.type.toUpperCase();
  const rows = guidance.activities.map((activity, index) => {
    const completed = ui.workoutDone.includes(index);
    const content = `
      <span class="exercise-number">${completed ? icon("check", 17) : String(index + 1).padStart(2, "0")}</span>
      <span><strong>${escapeHtml(activity.name)}</strong><small>${escapeHtml(activity.detail)}</small></span>
      ${canCompleteSteps ? icon("arrow") : ""}`;
    return canCompleteSteps
      ? `<button type="button" class="exercise-row ${completed ? "done" : ""}" data-action="toggle-exercise" data-index="${index}" aria-pressed="${completed}">${content}</button>`
      : `<div class="exercise-row static-row">${content}</div>`;
  }).join("");

  const actions = canLog
    ? `<div class="sticky-actions">
        ${button("Finish and log", "open-plan-item-log", { attributes: `data-id="${escapeHtml(item.id)}" data-status="Completed"` })}
        ${button("Log modifications", "open-plan-item-log", { variant: "secondary", attributes: `data-id="${escapeHtml(item.id)}" data-status="Modified"` })}
      </div>`
    : `<div class="sticky-actions">${button("Back to training", "back-training", { variant: "secondary" })}</div>`;

  return `
    <main class="focused-page workout-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-training" aria-label="Back to Training">${icon("back")}</button><span class="focused-title">Session detail</span>${pill(durationLabel)}</header>
      <section class="workout-shell">
        <div class="workout-hero">
          <div>${pill(item.type.toUpperCase(), item.fixed ? "dark" : "lime")}<h1>${escapeHtml(item.title)}</h1><p>${escapeHtml(guidance.purpose)}</p></div>
          <div class="difficulty"><span>${item.fixed ? "OWNER" : "INTENSITY"}</span><strong>${escapeHtml(item.fixed ? "Team-led" : item.intensity)}</strong><div><i></i><i class="${["Easy", "Rest"].includes(item.intensity) ? "muted" : ""}"></i><i class="muted"></i><i class="muted"></i></div></div>
        </div>
        <div class="exercise-list">${rows}</div>
        <div class="workout-note">${icon("shield")}<p>${item.fixed ? "This page explains how the fixed commitment fits the week; the coach remains responsible for the session itself." : "A responsible adult must know about the session. Stop for pain, dizziness, unusual breathing difficulty, or feeling unwell."}</p></div>
        ${actions}
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
  const planItem = data.plan.find((item) => item.id === ui.logConfig.planItemId);
  const backAction = !unplanned && ui.logConfig.planItemId !== "tue" ? "back-training" : "back-today";
  return `
    <main class="focused-page log-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="${backAction}" aria-label="Back">${icon("back")}</button><span class="focused-title">${unplanned ? "Log another activity" : "Log your session"}</span><span></span></header>
      <section class="log-shell">
        <div class="log-heading"><span class="section-kicker">${unplanned ? "UNPLANNED ACTIVITY" : "PLANNED SESSION"}</span><h1>${unplanned ? "What did you do?" : escapeHtml(planItem?.title || data.recommendation.title)}</h1></div>
        <form class="form-card" data-form="activity-log">
          ${unplanned ? `<div class="field"><label for="log-type">Activity type</label><select id="log-type" data-scope="log" data-field="type">${selectedOptions(["Team practice", "Match", "Strength", "Speed", "Conditioning", "Recovery"], form.type)}</select></div>` : ""}
          ${unplanned ? "" : `<div class="field"><span class="field-group-label" id="log-outcome-label">Outcome</span><div class="segmented" role="group" aria-labelledby="log-outcome-label">${["Completed", "Modified", "Skipped"].map((status) => `<button type="button" class="${form.status === status ? "selected" : ""}" data-action="set-log-status" data-value="${status}" aria-pressed="${form.status === status}">${status}</button>`).join("")}</div></div>`}
          ${form.status === "Skipped" ? "" : `
            <div class="two-fields">
              <div class="field"><label for="log-duration">Duration</label><div class="input-suffix"><input id="log-duration" type="number" min="1" max="300" required data-scope="log" data-field="duration" value="${form.duration}"><span>min</span></div></div>
              <div class="field"><label for="log-effort">Effort</label><div class="input-suffix"><input id="log-effort" type="number" min="1" max="10" required data-scope="log" data-field="effort" value="${form.effort}"><span>/ 10</span></div></div>
            </div>`}
          <div class="field"><span class="field-group-label" id="log-pain-label">Pain during or after</span><div class="pain-options compact" role="group" aria-labelledby="log-pain-label">${["None", "Mild", "Moderate", "Severe"].map((pain) => `<button type="button" class="${form.pain === pain ? "selected" : ""}" data-action="set-log-pain" data-value="${pain}" aria-pressed="${form.pain === pain}">${pain}</button>`).join("")}</div></div>
          <div class="field"><label for="notes">Notes <small>Optional</small></label><textarea id="notes" rows="3" data-scope="log" data-field="notes" placeholder="${form.status === "Modified" ? "What did you change?" : "Anything useful to remember?"}">${escapeHtml(form.notes)}</textarea></div>
          ${unplanned ? `<p class="hint">${icon("refresh", 17)} A high-load activity may change the next 24–48 hours.</p>` : ""}
          <button type="submit" class="button button-primary full"><span>Save activity <span aria-hidden="true">→</span></span></button>
        </form>
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
  const beforeSummary = isSchedule
    ? commitmentSummary(data.schedule)
    : "Conditioning · 35 min · Moderate";
  const afterSummary = isSchedule
    ? commitmentSummary(pending.schedule)
    : "Mobility reset · 20 min · Easy";
  return `
    <main class="outcome-page adjustment-page">
      <div class="adjustment-card">
        <span class="section-kicker">REVIEW PLAN CHANGES</span>
        <h1>${isSchedule ? "Your schedule changes the week." : "Recovery needs a little more room."}</h1>
        <p>${isSchedule ? "Added commitments stay fixed; removed commitments stop affecting the plan. Optional work is recalculated around what remains." : "The high-effort team session you logged increases today’s load. Fixed commitments remain unchanged."}</p>
        <div class="change-comparison">
          <div><small>${isSchedule ? "BEFORE" : "WED 29"}</small>${pill(isSchedule ? "CURRENT" : "PLANNED")}<h3>${isSchedule ? "Fixed commitments" : "Conditioning"}</h3><span>${escapeHtml(beforeSummary)}</span></div>
          <span class="change-arrow">→</span>
          <div class="new"><small>${isSchedule ? "AFTER" : "WED 29"}</small>${pill(isSchedule ? "UPDATED" : "RECOVERY", "lime")}<h3>${isSchedule ? "Fixed commitments" : "Mobility reset"}</h3><span>${escapeHtml(afterSummary)}</span></div>
        </div>
        <div class="reason-box"><span class="round-icon">${icon("shield")}</span><div><strong>Why this changed</strong><p>${isSchedule ? "The recommendation system only protects practices and matches that are currently added." : "This avoids consecutive high-load days while preserving team commitments."}</p></div></div>
        <div class="button-row">${button("Apply changes", "apply-adjustment")}${button("Keep current plan", "dismiss-adjustment", { variant: "secondary" })}</div>
      </div>
    </main>`;
}

/*
 * Builds one weekly-plan row per item in data.plan.
 * The callback passed to map() can do several calculations before returning HTML.
 */
function renderWeek() {
  const focusedSessions = data.plan.filter(
    (item) => !item.fixed && !["Rest", "Recovery"].includes(item.type)
  ).length;
  const hasMatch = commitmentEnabled(data.schedule, "match");
  const rows = data.plan.map((item) => {
    // Nested template strings add time and duration only when those values exist.
    const meta = `${item.time ? `${item.time} · ` : ""}${item.duration ? `${item.duration} min · ` : ""}${item.intensity}`;
    return `
      <a href="/training/session/${encodeURIComponent(item.id)}" class="plan-row interactive" data-action="open-training-detail" data-id="${escapeHtml(item.id)}">
        <span class="day-dot ${item.fixed ? "fixed" : item.type.toLowerCase()}"></span>
        <span class="plan-day">${escapeHtml(item.day)}</span>
        <span class="plan-main"><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(meta)}</small></span>
        ${pill(item.fixed ? item.type.toUpperCase() : item.status.toUpperCase(), item.fixed ? "dark" : item.type === "Recovery" ? "lime" : "neutral")}
        ${icon("arrow", 18)}
      </a>`;
  }).join("");

  return `
    <main class="screen">
      ${screenHeader("ROLLING PLAN", "Your next 7 days", '<span class="date-control">28 Jul — 3 Aug</span>')}
      <section class="week-card">
        <div class="week-summary">
          <div><span class="eyebrow">WEEK SHAPE</span><strong>${focusedSessions} focused session${focusedSessions === 1 ? "" : "s"}</strong><p>${hasMatch ? "with recovery protected around your match" : "balanced around the commitments you added"}</p></div>
          <div class="load-bars" aria-label="Training load preview">${[2, 1, 4, 1, hasMatch ? 5 : 1, 1, 3].map((height, index) => `<span style="height:${height * 11}px" class="${hasMatch && index === 4 ? "match" : ""}"></span>`).join("")}</div>
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
        ${screenHeader("21 — 27 JULY", "Your week, in context.", '<span class="date-control">Previous week</span>')}
        <section class="empty-state"><span class="empty-icon">${icon("progress", 32)}</span><h2>Your first review is taking shape.</h2><p>Log a few sessions and check-ins. After seven days, useful patterns will appear here.</p></section>
      </main>`;
  }

  const loads = data.activities.slice(-5).map((activity) => Math.min(100, Math.round((activity.duration * activity.effort) / 8)));
  const bars = [34, 52, 46, 66, ...loads].slice(-7).map((height) => `<i style="height:${Math.max(12, height)}%"></i>`).join("");
  const completePercent = Math.max(15, (completed / data.activities.length) * 100);
  return `
    <main class="screen">
      ${screenHeader("21 — 27 JULY", "Your week, in context.", '<span class="date-control">Previous week</span>')}
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
          <div class="profile-identity"><span class="large-avatar">${escapeHtml(userName.slice(0, 1).toUpperCase())}</span><div><h2>${escapeHtml(userName)}</h2><p>${escapeHtml(ageBandLabel(data.user.ageBandId))} · ${escapeHtml(data.user.position)} · ${escapeHtml(data.user.experience)}</p>${pill(data.user.goal.toUpperCase(), "lime")}</div></div>
          <div class="profile-facts"><div><span>Availability</span><strong>${data.user.availability.length} days / week</strong></div><div><span>Equipment</span><strong>${data.user.equipment.length} options</strong></div></div>
        </section>
        <section class="settings-card">
          <span class="settings-label">TRAINING SETUP</span>
          ${settingsRow("profile", "Athlete details", "Position, experience, primary goal")}
          ${settingsRow("week", "Team schedule", commitmentSummary(data.schedule), "edit-schedule")}
          ${settingsRow("bolt", "Equipment & availability", "What you can use and when")}
          <span class="settings-label">PREFERENCES & DATA</span>
          <button type="button" role="switch" aria-checked="${ui.notifications}" data-action="toggle-notifications"><span class="settings-icon">${icon("today")}</span><span><strong>Check-in reminders</strong><small>${ui.notifications ? "On · before optional training" : "Off"}</small></span><span class="toggle ${ui.notifications ? "on" : ""}" aria-hidden="true"><i></i></span></button>
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
  if (!action) {
    return `<div class="settings-static ${className}"><span class="settings-icon">${icon(iconName)}</span><span><strong>${title}</strong><small>${detail}</small></span></div>`;
  }
  return `<button type="button" class="${className}" data-action="${action}"><span class="settings-icon">${icon(iconName)}</span><span><strong>${title}</strong><small>${detail}</small></span>${icon("arrow")}</button>`;
}

// Builds the form used to edit fixed practice and match commitments.
function renderScheduleEditor() {
  const schedule = ui.scheduleForm;
  return `
    <main class="focused-page">
      <header class="focused-header"><button type="button" class="icon-button" data-action="back-profile" aria-label="Back">${icon("back")}</button><span class="focused-title">Team schedule</span><span></span></header>
      <section class="form-shell schedule-editor">
        <span class="section-kicker">FIXED COMMITMENTS</span><h1>Keep the week accurate.</h1><p class="lead">Add, remove, or leave both commitment types empty. Changes may reshape optional routines, and you will review them first.</p>
        ${scheduleCard("TEAM PRACTICE", "practice", schedule, "schedule")}
        ${scheduleCard("MATCH", "match", schedule, "schedule")}
        <div class="info-card">${icon("shield")}<div><strong>Fixed means fixed</strong><p>PureAthletic can move optional sessions around entries you add, but never moves those commitments automatically.</p></div></div>
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

function normalizedPathname(pathname = window.location.pathname) {
  const withoutIndex = pathname === "/index.html" ? "/" : pathname;
  const normalized = `/${withoutIndex.split("/").filter(Boolean).join("/")}`;
  return normalized === "/" ? normalized : normalized.replace(/\/$/, "");
}

function routeForScreen(screen) {
  if (screen === "training-detail") {
    return `/training/session/${encodeURIComponent(ui.selectedPlanItemId || "tue")}`;
  }
  return screenRoutes[screen] || screenRoutes.today;
}

function screenForRoute(pathname = window.location.pathname) {
  const normalized = normalizedPathname(pathname);
  const trainingMatch = normalized.match(/^\/training\/session\/([^/]+)$/);
  if (trainingMatch) {
    ui.selectedPlanItemId = decodeURIComponent(trainingMatch[1]);
    return "training-detail";
  }
  return routeScreens[normalized] || null;
}

function resolveRouteScreen(requestedScreen) {
  let screen = requestedScreen || (data.onboarded ? "today" : "landing");

  if (!data.onboarded && !["landing", "onboarding"].includes(screen)) {
    return "onboarding";
  }
  if (screen === "adjustment" && !ui.pending) return "week";
  if (screen === "training-detail" && !data.plan.some((item) => item.id === ui.selectedPlanItemId)) {
    return "week";
  }
  if (screen === "outcome" && !data.checkInDone) return "today";
  if (screen === "safety" && data.recommendation.status !== "Safety") return "today";
  return screen;
}

function defaultLogForm(unplanned = true, status = "Completed", planItemId = "tue") {
  const planItem = data.plan.find((item) => item.id === planItemId);
  return {
    type: unplanned ? "Team practice" : planItem?.type || data.recommendation.type,
    status: unplanned ? "Completed" : status,
    duration: unplanned ? 75 : planItem?.duration || data.recommendation.duration,
    effort: unplanned ? 8 : 6,
    pain: "None",
    notes: ""
  };
}

function prepareScreenState(screen) {
  if (screen === "schedule" && !ui.scheduleForm) {
    ui.scheduleForm = clone(data.schedule);
  }
  if (screen === "log" && !ui.logForm) {
    ui.logConfig = { unplanned: true, status: "Completed", planItemId: null };
    ui.logForm = defaultLogForm(true);
  }
  if (["outcome", "safety"].includes(screen) && data.checkIn) {
    ui.outcome = data.checkIn.pain === "Severe"
      ? "severe"
      : data.checkIn.pain !== "None"
        ? "pain"
        : data.checkIn.sleep <= 2 && data.checkIn.energy <= 2
          ? "poor"
          : "good";
  }
}

function updatePageMetadata(screen) {
  if (screen === "training-detail") {
    const item = data.plan.find((candidate) => candidate.id === ui.selectedPlanItemId);
    document.title = `${item?.title || "Session details"} · PureAthletic`;
    return;
  }
  document.title = screenTitles[screen] || "PureAthletic";
}

function routeHistoryState(screen, depth) {
  return { pureAthletic: true, screen, depth };
}

function replaceCurrentRoute(screen, depth = 0) {
  window.history.replaceState(
    routeHistoryState(screen, depth),
    "",
    `${routeForScreen(screen)}${window.location.search}`
  );
}

function initializeRoute() {
  const requestedScreen = screenForRoute();
  const screen = resolveRouteScreen(requestedScreen);
  prepareScreenState(screen);
  ui.screen = screen;

  const currentDepth = window.history.state?.pureAthletic
    ? Number(window.history.state.depth || 0)
    : 0;
  replaceCurrentRoute(screen, currentDepth);
}

function focusScreenHeading() {
  requestAnimationFrame(() => {
    const heading = app.querySelector("main h1");
    if (!heading) return;
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
  });
}

function focusAfterRender(selector) {
  requestAnimationFrame(() => {
    app.querySelector(selector)?.focus({ preventScroll: true });
  });
}

function selectorForBoundControl(target) {
  if (target.id) return `#${CSS.escape(target.id)}`;
  if (!target.dataset.scope || !target.dataset.field) return "";
  return `[data-scope="${target.dataset.scope}"][data-field="${target.dataset.field}"]`;
}

function navigateBack(fallbackScreen) {
  const depth = Number(window.history.state?.depth || 0);
  if (window.history.state?.pureAthletic && depth > 0) {
    window.history.back();
    return;
  }
  setScreen(fallbackScreen, { replace: true });
}

/*
 * The central renderer decides which screen function to run.
 *
 * Focused screens take over the whole page. Main app screens are first rendered
 * as content and then placed inside renderAppShell(). The final fallback shows
 * Today if ui.screen contains an unknown value.
 */
function render() {
  updatePageMetadata(ui.screen);

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
    "training-detail": renderTrainingDetail,
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
function setScreen(screen, options = {}) {
  const resolvedScreen = resolveRouteScreen(screen);
  prepareScreenState(resolvedScreen);
  ui.screen = resolvedScreen;

  const route = routeForScreen(resolvedScreen);
  const currentDepth = Number(window.history.state?.depth || 0);
  if (normalizedPathname() !== route) {
    if (options.replace) {
      replaceCurrentRoute(resolvedScreen, currentDepth);
    } else {
      window.history.pushState(
        routeHistoryState(resolvedScreen, currentDepth + 1),
        "",
        route
      );
    }
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  render();
  focusScreenHeading();
}

window.addEventListener("popstate", (event) => {
  const resolvedScreen = resolveRouteScreen(screenForRoute());
  prepareScreenState(resolvedScreen);
  ui.screen = resolvedScreen;

  if (normalizedPathname() !== routeForScreen(resolvedScreen)) {
    replaceCurrentRoute(resolvedScreen, Number(event.state?.depth || 0));
  }
  window.scrollTo({ top: 0, behavior: "instant" });
  render();
  focusScreenHeading();
});

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
async function finishOnboarding() {
  if (ui.generatingPlan) return;

  ui.generatingPlan = true;
  render();

  const user = clone(ui.onboardingForm);
  user.name = user.name.trim() || "Sam";
  if (user.experience === "Advanced") user.experience = "Beginner";

  const catalog = await youthRecommendationDataPromise;
  const recommendation = catalog
    ? recommendationFromCatalog(user, catalog)
    : fallbackRecommendation(user);
  const schedule = clone(ui.onboardingSchedule);

  data = {
    ...clone(demoState),
    onboarded: true,
    user,
    recommendation,
    schedule,
    plan: planWithRecommendationAndSchedule(
      recommendation,
      schedule,
      clone(initialPlan)
    )
  };
  ui.generatingPlan = false;
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
  } else if (form.pain !== "None") {
    kind = "pain";
    recommendation = { ...recommendation, type: "Safety", title: "Pause training and tell an adult", status: "Safety", duration: 0, purpose: `${form.pain} pain was reported. Automated junior training is paused for responsible-adult review.` };
    adjustment = { id: Date.now(), title: "Workout paused after pain report", reason: `Safety rule · ${form.pain.toLowerCase()} pain`, undoable: false };
  } else if (form.sleep <= 2 && form.energy <= 2) {
    kind = "poor";
    recommendation = { ...recommendation, type: "Recovery", title: "Mobility + recovery", status: "Recovery", duration: 20, intensity: "Easy", purpose: "Low sleep and energy make a lighter recovery session the better fit today." };
    adjustment = { id: Date.now(), title: "Planned routine replaced with recovery", reason: "Very poor readiness", undoable: true, beforeRecommendation: data.recommendation };
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
function openLog(unplanned, status = "Completed", planItemId = "tue") {
  ui.logConfig = { unplanned, status, planItemId: unplanned ? null : planItemId };
  ui.logForm = defaultLogForm(unplanned, status, planItemId);
  setScreen("log");
}

/*
 * Turns the temporary log form into a saved activity.
 * map() creates a new plan array, changing only Tuesday when appropriate.
 * Date.now() supplies a simple numeric identifier based on the current time.
 */
function saveActivity() {
  const form = clone(ui.logForm);
  const planItem = data.plan.find((item) => item.id === ui.logConfig.planItemId);
  const hasValidLoad = form.status === "Skipped" || (
    Number.isFinite(Number(form.duration))
    && Number(form.duration) >= 1
    && Number(form.duration) <= 300
    && Number.isFinite(Number(form.effort))
    && Number(form.effort) >= 1
    && Number(form.effort) <= 10
  );
  if (!hasValidLoad) return;

  form.duration = Number(form.duration);
  form.effort = Number(form.effort);
  const activity = {
    ...form,
    id: Date.now(),
    title: ui.logConfig.unplanned ? form.type : planItem?.title || data.recommendation.title,
    date: planItem?.day.replace("TODAY · ", "").replace(" · FIXED", "") || "Tue 28"
  };
  const activities = [activity, ...data.activities];
  const plan = data.plan.map((item) => item.id === ui.logConfig.planItemId && !ui.logConfig.unplanned ? { ...item, status: form.status } : item);
  const nextData = { ...data, activities, plan };

  // Any reported pain takes the junior safety route and ends this function early.
  if (form.pain !== "None") {
    const severe = form.pain === "Severe";
    nextData.recommendation = {
      ...data.recommendation,
      type: "Safety",
      title: severe ? "Stop training and seek advice" : "Pause training and tell an adult",
      status: "Safety",
      duration: 0,
      purpose: `${form.pain} pain was reported after activity. Review the safety guidance.`
    };
    nextData.adjustments = [{ id: Date.now() + 1, title: "Future intense work restricted", reason: `Safety rule · ${form.pain.toLowerCase()} pain`, undoable: false }, ...data.adjustments];
    data = nextData;
    ui.outcome = severe ? "severe" : "pain";
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
    setScreen(ui.logConfig.planItemId && ui.logConfig.planItemId !== "tue" ? "week" : "today");
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
    const updatedPlan = planWithRecommendationAndSchedule(
      data.recommendation,
      pending.schedule,
      data.plan
    );
    const adjustment = {
      id: Date.now(),
      title: "Fixed commitments updated",
      reason: commitmentSummary(pending.schedule),
      undoable: true,
      beforePlan: data.plan,
      beforeSchedule: data.schedule
    };
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
  if (target.type === "number" || target.type === "range") return Number(target.value);
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
    checkin: ui.checkinForm,
    log: ui.logForm,
    schedule: ui.scheduleForm
  };
  if (!scopes[scope]) return;
  const value = valueForInput(target);
  scopes[scope][field] = target.dataset.inverted === "true" ? 6 - Number(value) : value;
}

function syncSelectedButtons(action, selectedValue, field = "") {
  app.querySelectorAll(`[data-action="${action}"]`).forEach((choice) => {
    if (field && choice.dataset.field !== field) return;
    const selected = choice.dataset.value === selectedValue;
    choice.classList.toggle("selected", selected);
    if (choice.hasAttribute("aria-pressed")) {
      choice.setAttribute("aria-pressed", String(selected));
    }
  });
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

  if (event.target.matches(".scale-slider")) {
    const slider = event.target;
    const value = Number(slider.value);
    slider.closest(".scale-control").style.setProperty("--readiness-position", `${(value - 1) * 25}%`);
    slider.setAttribute("aria-label", `${slider.closest(".scale-field").querySelector("label").textContent}: ${value} out of 5`);
    slider.closest(".scale-field").querySelector("output").textContent = `${value} / 5`;
  }
});

// `change` handles completed changes; checkboxes also need a visual rerender.
app.addEventListener("change", (event) => {
  updateBoundField(event.target);
  if (event.target.type === "checkbox" || event.target.dataset.field === "ageBandId") {
    const selector = selectorForBoundControl(event.target);
    render();
    if (selector) focusAfterRender(selector);
  }
});

app.addEventListener("submit", (event) => {
  if (!event.target.matches('[data-form="activity-log"]')) return;
  event.preventDefault();
  if (!event.target.reportValidity()) return;
  saveActivity();
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
  if (target.matches("a[href]")) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
  }
  const action = target.dataset.action;

  if (action === "start-onboarding") {
    ui.onboardingStep = 1;
    ui.onboardingForm = clone(onboardingSeed.user);
    ui.onboardingSchedule = clone(demoState.schedule);
    ui.generatingPlan = false;
    setScreen("onboarding");
  } else if (action === "enter-demo") {
    enterDemo();
  } else if (action === "exit-onboarding") {
    navigateBack("landing");
  } else if (action === "onboarding-back") {
    if (ui.onboardingStep === 1) navigateBack("landing");
    else {
      ui.onboardingStep -= 1;
      window.scrollTo({ top: 0, behavior: "instant" });
      render();
      focusScreenHeading();
    }
  } else if (action === "onboarding-next") {
    if (ui.onboardingStep < 5) {
      ui.onboardingStep += 1;
      window.scrollTo({ top: 0, behavior: "instant" });
      render();
      focusScreenHeading();
    } else {
      void finishOnboarding();
    }
  } else if (action === "set-experience") {
    if (target.dataset.value === "Advanced") return;
    ui.onboardingForm.experience = target.dataset.value;
    syncSelectedButtons("set-experience", target.dataset.value);
  } else if (action === "set-goal") {
    ui.onboardingForm.goal = target.dataset.value;
    syncSelectedButtons("set-goal", target.dataset.value);
  } else if (action === "add-commitment" || action === "remove-commitment") {
    const scheduleScopes = {
      onboardingSchedule: ui.onboardingSchedule,
      schedule: ui.scheduleForm
    };
    const schedule = scheduleScopes[target.dataset.scope];
    const prefix = target.dataset.prefix;

    if (schedule && ["practice", "match"].includes(prefix)) {
      schedule[`${prefix}Enabled`] = action === "add-commitment";
      render();
      const nextAction = action === "add-commitment" ? "remove-commitment" : "add-commitment";
      focusAfterRender(`[data-action="${nextAction}"][data-prefix="${prefix}"]`);
    }
  } else if (action === "navigate") {
    setScreen(target.dataset.screen);
  } else if (action === "open-training-detail") {
    ui.selectedPlanItemId = target.dataset.id;
    ui.workoutDone = [];
    setScreen("training-detail");
  } else if (action === "open-checkin") {
    ui.checkinForm = { sleep: 3, energy: 3, soreness: 2, stress: 2, pain: "None" };
    setScreen("checkin");
  } else if (action === "set-checkin-pain") {
    ui.checkinForm.pain = target.dataset.value;
    syncSelectedButtons("set-checkin-pain", target.dataset.value);
    const painField = target.closest(".pain-field");
    const existingWarning = painField.querySelector(".inline-warning");
    const needsWarning = target.dataset.value !== "None";
    if (needsWarning && !existingWarning) {
      painField.insertAdjacentHTML(
        "beforeend",
        `<p class="inline-warning" role="alert">${icon("alert", 17)} Any reported pain pauses automated junior training and asks for responsible-adult review.</p>`
      );
    } else if (!needsWarning && existingWarning) {
      existingWarning.remove();
    }
  } else if (action === "submit-checkin") {
    submitCheckIn();
  } else if (action === "review-safety") {
    // Optional chaining (?.) safely reads pain even if checkIn does not exist.
    ui.outcome = data.checkIn?.pain === "Severe" ? "severe" : "pain";
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
    const completed = ui.workoutDone.includes(index);
    target.classList.toggle("done", completed);
    target.setAttribute("aria-pressed", String(completed));
    target.querySelector(".exercise-number").innerHTML = completed
      ? icon("check", 17)
      : String(index + 1).padStart(2, "0");
  } else if (action === "open-planned-log") {
    openLog(false, target.dataset.status);
  } else if (action === "open-plan-item-log") {
    openLog(false, target.dataset.status, target.dataset.id);
  } else if (action === "open-unplanned-log") {
    openLog(true);
  } else if (action === "set-log-status") {
    ui.logForm.status = target.dataset.value;
    render();
    focusAfterRender(`[data-action="set-log-status"][data-value="${target.dataset.value}"]`);
  } else if (action === "set-log-pain") {
    ui.logForm.pain = target.dataset.value;
    syncSelectedButtons("set-log-pain", target.dataset.value);
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
    target.setAttribute("aria-checked", String(ui.notifications));
    target.querySelector("small").textContent = ui.notifications
      ? "On · before optional training"
      : "Off";
    target.querySelector(".toggle").classList.toggle("on", ui.notifications);
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
    navigateBack("profile");
  } else if (action === "back-training") {
    navigateBack("week");
  } else if (action === "back-today") {
    navigateBack("today");
  }
});

// First render: this starts the application after the file has loaded.
initializeRoute();
render();
