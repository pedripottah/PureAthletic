const appScreenRoutes = [
  "/",
  "/onboarding",
  "/today",
  "/training",
  "/progress",
  "/profile",
  "/check-in",
  "/check-in/result",
  "/safety",
  "/training/workout",
  "/training/workout/short",
  "/activity/log",
  "/training/review",
  "/profile/schedule"
];

const weekdaySessionRoutes = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun"
].map((day) => `/training/session/${day}`);

export const pageRoutes = Object.freeze([
  ...appScreenRoutes,
  ...weekdaySessionRoutes
]);

export const deployedFiles = Object.freeze([
  { path: "/index.html", file: "index.html", type: "text/html; charset=utf-8" },
  { path: "/favicon.svg", file: "favicon.svg", type: "image/svg+xml" },
  { path: "/styles.css", file: "styles.css", type: "text/css; charset=utf-8" },
  { path: "/app.js", file: "app.js", type: "text/javascript; charset=utf-8" },
  { path: "/data/youth-football/sources.json", file: "data/youth-football/sources.json", type: "application/json; charset=utf-8" },
  { path: "/data/youth-football/taxonomy.json", file: "data/youth-football/taxonomy.json", type: "application/json; charset=utf-8" },
  { path: "/data/youth-football/routine-catalog.json", file: "data/youth-football/routine-catalog.json", type: "application/json; charset=utf-8" },
  { path: "/data/youth-football/recommendation-index.json", file: "data/youth-football/recommendation-index.json", type: "application/json; charset=utf-8" }
]);

export const previewOnlyFiles = Object.freeze([
  { path: "/test/browser-smoke.html", file: "test/browser-smoke.html", type: "text/html; charset=utf-8" },
  { path: "/test/responsive-smoke.html", file: "test/responsive-smoke.html", type: "text/html; charset=utf-8" }
]);

export function normalizeRoute(pathname) {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export function isPageRoute(pathname) {
  const route = normalizeRoute(pathname);
  return pageRoutes.includes(route)
    || /^\/training\/session\/[^/]+$/.test(route);
}
