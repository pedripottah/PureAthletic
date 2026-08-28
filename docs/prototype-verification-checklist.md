# PureAthletic — Prototype Verification Checklist

**Status:** Pre-share checklist for the current local research prototype
**Last reviewed:** 28 August 2026

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

- Run `npm run verify` for the complete automated check set below. Stop and
  investigate if any step fails.
- [ ] `npm test`
- [ ] `npm run validate:training`
- [ ] `npm run validate:docs`
- [ ] `npm run build`
- [ ] `npm run verify:build`

## Manual browser checks

Run both browser pages against the same commit recorded below. These checks are
not included in `npm run verify`.

- [ ] Browser smoke page reports `PASS`.
- [ ] Responsive smoke page reports `PASS`.

Passing these checks verifies only the encoded prototype contract. It does not
approve training content, establish WCAG conformance, satisfy privacy/legal
requirements, or authorize junior use.

## Core journey

- [ ] Start with cleared browser storage and complete the local prototype’s
  guardian-approval simulation, disclaimer, age band, goal, schedule, and
  experience.
- [ ] Refresh during onboarding; completed answers remain available.
- [ ] Confirm onboarding Step 4 shows only fixed practices and matches, without
  optional-training availability, equipment, or qualified-coach controls.
- [ ] Generate a plan and confirm Training shows the earlier mixed weekly plan,
  rather than every non-fixed day appearing as `Open day`.
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
