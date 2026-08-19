# PureAthletic — Prototype Verification Checklist

Use this checklist before sharing the prototype for research. It supplements
automated tests; it is not evidence of production readiness or junior release.

## Automated checks

- [ ] `npm test`
- [ ] `npm run validate:training`
- [ ] `npm run build`
- [ ] Open `test/browser-smoke.html` in a browser and record the result.
- [ ] Open `test/responsive-smoke.html` in a browser and record the result.

## Core journey

- [ ] Start with cleared browser storage and complete guardian approval,
  disclaimer, age band, goal, schedule, and experience.
- [ ] Refresh during onboarding; completed answers remain available.
- [ ] Confirm Today shows one clear next action and its explanation.
- [ ] Complete a readiness check-in and verify the recommendation changes when
  appropriate.
- [ ] Log completed, modified, skipped, and unplanned activity.
- [ ] Change a fixed practice or match and review the proposed plan changes
  before saving.
- [ ] Confirm fixed practices and matches are never automatically moved.
- [ ] Review Week, Progress, Profile, export, and deletion controls.

## Safety and accessibility

- [ ] Pain response pauses or restricts automated training and clearly directs
  the user to adult/professional review.
- [ ] Red-flag response produces no workout recommendation.
- [ ] Missing or uncertain readiness does not create false precision.
- [ ] Complete the core journey with keyboard only; focus remains visible.
- [ ] Zoom to 200% and check that content and actions remain usable.
- [ ] Check contrast, labels, error messages, headings, and status text.
- [ ] Check touch targets and layout on a narrow mobile viewport.
- [ ] Check reduced-motion behavior if animations are present.

## Result record

```text
Prototype/version:
Date:
Browser/device:
Automated checks:
Manual checks:
Findings:
Release-blocking issue:
Owner and next action:
```
