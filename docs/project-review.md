# PureAthletic — Prototype Review and Immediate Backlog

**Review date:** 17 August 2026  
**Review scope:** Current repository, documented V1 journey, training catalog, and automated checks.

The long-term sequencing and release gates now live in the
[Three-Year Product and Engineering Roadmap](three-year-roadmap.md). The first
working artifacts are the [Research Plan](research-plan.md), [Research
Preparation Pack](research-preparation.md), [Practitioner and Safeguarding
Review Packet](safety-review-packet.md), and [Risk and Data
Foundation](risk-and-data-foundation.md). The [Prototype Verification
Checklist](prototype-verification-checklist.md) defines the current
pre-research manual checks. This file records the current review and the next
short-term actions.

## Review outcome

The prototype is ready for structured usability and practitioner review. It is
not ready for a minor-facing beta or production deployment. The core journey is
implemented locally and the deterministic training data is validated, but the
application still lacks real authentication, server-side persistence, account
isolation, and approval of the junior-training release gates.

## What is working

- Onboarding is resumable and persists through refreshes.
- Guardian approval, disclaimer acceptance, age-band selection, goal selection,
  schedule commitments, and experience selection are represented.
- Beginner and Intermediate U5–U17 recommendations resolve from the catalog;
  Advanced remains unavailable in the interface.
- Today, Week, Progress, Profile, check-in, workout detail, activity logging,
  adjustment review, and schedule editing are implemented.
- Fixed practices and matches are represented separately from optional work.
- Readiness, pain, completion, modification, skipping, unplanned activity,
  adjustment explanations, and limited undo behavior are implemented in the
  prototype.
- Local data export and deletion controls are present as prototype behavior.
- `npm test`, `npm run validate:training`, and `npm run build` currently pass.

## Highest-priority findings

### P0 — Audience decision resolved

The private-beta direction is now locked to junior footballers in team age
groups U5–U17, supported by a parent or guardian. The user-flow and wireframe
scope statements have been aligned with that decision. This means all future
account, consent, safety, recruitment, and legal work must follow the junior
product boundary.

### P0 — Practitioner and safeguarding review

Have a qualified youth-sport practitioner review the recommendation catalog,
readiness thresholds, pain branches, match-protection rules, supervision
requirements, and athlete-facing copy. Complete safeguarding, privacy, legal,
guardian-consent, and minor-account reviews before recruiting minors.

### P1 — Run structured usability testing

Use the current prototype with adults first:

1. Two or three football players complete onboarding and use the full journey.
2. Two or three parents or guardians review the safety and consent experience.
3. One qualified practitioner reviews the recommendations and safety branches.

Capture completion time, confusion points, unsafe interpretations, and the
answer to one central question: “Do you know what to do next, and why?”

### P1 — Make browser smoke tests part of verification

The repository contains browser and responsive smoke pages, but the default
`npm test` command only runs the Node test suites. Add a documented browser
test command or CI step that starts the local server and runs both smoke pages
in a real browser environment.

### P1 — Define the production data boundary

Before backend implementation, finalize the data model and privacy
classification for profile, schedule, readiness, pain, activity, adjustment,
consent, and audit records. Then implement authentication, server-side
persistence, authorization, export, and deletion together.

### P1 — Unify the planning boundary before API work

The repository currently contains a youth catalog selector, a separate legacy
recommendation engine, a static weekly plan, and UI-level check-in adjustments.
Before integrating an AI API, choose the canonical content schema and move
catalog selection, day-by-day scheduling, readiness restrictions, adaptation,
decision traces, and safe fallbacks behind one independently tested planner.
The [AI Integration Strategy](ai-integration-strategy.md) defines the required
contract and the limited order of AI experimentation.

### P1 — Build and test the canonical planner

Move the prototype's catalog selection, weekly scheduling, and adjustment
behavior into a separately testable module. Every rule should have explicit
inputs, outputs, priority, explanation text, undo policy, and practitioner
approval status. Add scenario tests for every safe, unsafe, and
schedule-conflict branch.

## Recommended order of immediate work

1. Create the research plan, participant criteria, consent materials, and
   practitioner/safeguarding review packet.
2. Record the threat model, data inventory, privacy classification, retention
   assumptions, and incident/escalation plan.
3. Conduct the first usability and practitioner review on the current app.
4. Add browser smoke execution and a manual WCAG 2.2 AA checklist to release
   verification.
5. Fix high-severity usability, safety-copy, accessibility, and consent issues.
6. Write the production architecture and data-contract decision record.
7. Unify the catalog and weekly planner behind an independently tested
   planning boundary.
8. Build authentication, persistence, authorization, export, deletion,
   monitoring, backups, and recovery together.
9. Run an offline AI experiment with synthetic profiles and approved content;
   keep it disabled in the user-facing product.
10. Re-run practitioner and legal reviews against the exact release candidate.
11. Start a small, supported closed beta only after all gates pass.

## Explicitly defer

Do not add AI-generated plans, social features, wearables, payments,
leaderboards, native mobile apps, or additional training categories until the
core planning loop has passed practitioner review and user testing.

## Definition of the next short-term milestone

The next milestone is complete when:

- the target audience is consistent across product documents and UI;
- a practitioner has reviewed the catalog and safety rules;
- at least five structured usability sessions are documented;
- the top usability issues have been fixed;
- browser smoke checks run through the project test workflow; and
- the production data/privacy boundary is approved for implementation.
- a threat model, accessibility checklist, and incident/escalation plan exist;
- the research findings are linked to concrete backlog decisions; and
- the next architecture decision is documented with its trade-offs.
