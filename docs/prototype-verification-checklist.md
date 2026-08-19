# PureAthletic — Prototype Verification Checklist

Use this checklist before sharing the prototype for research. It supplements
automated tests; it is not evidence of production readiness or junior release.
The two HTML smoke pages are browser-run checks, not part of the current
`npm test` command.

## Run context

Start the local server with `npm run dev`, then open:

- `http://localhost:3000/test/browser-smoke.html`
- `http://localhost:3000/test/responsive-smoke.html`

Record the browser, viewport, prototype commit, and result. These pages need a
local server because they load the app in a same-origin iframe.

## Automated checks

- [ ] `npm test`
- [ ] `npm run validate:training`
- [ ] `npm run build`
- [ ] Browser smoke page reports `PASS`.
- [ ] Responsive smoke page reports `PASS`.

## Core journey

- [ ] Start with cleared browser storage and complete the local prototype’s
  guardian-approval simulation, disclaimer, age band, goal, schedule, and
  experience.
- [ ] Refresh during onboarding; completed answers remain available.
- [ ] Confirm Today shows one clear next action and its explanation.
- [ ] Complete a readiness check-in and verify the recommendation changes when
  appropriate.
- [ ] Log completed, modified, skipped, and unplanned activity.
- [ ] Change a fixed practice or match and review the proposed plan changes
  before saving.
- [ ] Confirm fixed practices and matches are never automatically moved.
- [ ] Review Week, Progress, Profile, export, and deletion controls.
- [ ] Export contains the expected prototype data, then deletion clears the
  local profile and returns the app to its initial state.

## Safety and accessibility

- [ ] Each non-`None` pain response pauses or restricts automated training and
  clearly directs the user to adult/professional review.
- [ ] The deterministic rule test for a red-flag symptom passes and produces
  no workout recommendation. Do not mark a red-flag UI flow as verified unless
  the UI exposes that scenario.
- [ ] Missing or uncertain readiness does not create false precision.
- [ ] Complete the core journey with keyboard only; focus remains visible.
- [ ] Zoom to 200% and check that content and actions remain usable.
- [ ] Check contrast, labels, error messages, headings, and status text.
- [ ] Check touch targets and layout on a narrow mobile viewport.
- [ ] Check reduced-motion behavior if animations are present.

## Result record

```text
Prototype/version:
Commit:
Date:
Browser/device:
Viewport(s):
Automated checks:
Manual checks:
Findings:
Finding IDs and evidence:
Release-blocking issue(s):
Owner, disposition, and next action:
```
