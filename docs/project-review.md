# PureAthletic — Prototype Review and Immediate Backlog

**Review date:** 17 August 2026  
**Review scope:** Current repository, documented V1 journey, training catalog, and automated checks.

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

### P2 — Formalize the adaptive rule engine

Move the prototype's adjustment behavior into a separately testable module.
Every rule should have explicit inputs, outputs, priority, explanation text,
undo policy, and practitioner approval status. Add scenario tests for every
safe, unsafe, and schedule-conflict branch.

## Recommended order of work

1. Create the practitioner/safeguarding review packet.
2. Conduct the small adult usability review.
3. Fix only the highest-impact usability and safety-copy issues.
4. Add browser smoke execution to the test workflow.
5. Finalize the production data model and privacy classification.
6. Build authentication and server persistence.
7. Harden and independently test the adaptive rule engine.
8. Re-run practitioner and legal reviews before any junior beta.

## Explicitly defer

Do not add AI-generated plans, social features, wearables, payments,
leaderboards, native mobile apps, or additional training categories until the
core planning loop has passed practitioner review and user testing.

## Definition of the next milestone

The next milestone is complete when:

- the target audience is consistent across product documents and UI;
- a practitioner has reviewed the catalog and safety rules;
- at least five structured usability sessions are documented;
- the top usability issues have been fixed;
- browser smoke checks run through the project test workflow; and
- the production data/privacy boundary is approved for implementation.
