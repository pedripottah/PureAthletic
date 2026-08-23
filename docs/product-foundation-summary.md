# PureAthletic — Quick Product Summary

**Status:** Orientation summary; not a source of release approval
**Last reviewed:** 24 August 2026

Read the [documentation guide](README.md) before using this summary to make a
product or engineering decision.

## Product in one sentence

PureAthletic is exploring whether a structured, age-aware football planner can
help a player and responsible adult understand the next appropriate training or
recovery action around team commitments, recent activity, and readiness.

## Problem and promise

Team football, independent training, school, work, free play, matches, and
recovery compete for the same week. Static workout plans do not adapt when the
schedule or the athlete’s condition changes.

The target product should answer:

> What should I do next, why, and when should I not follow an automated
> suggestion?

The intended loop is:

`Set up → plan → check in → train or rest → log → adjust → review`

## Audience status

The research catalog spans team groups U5–U17, but that range is not yet a
validated first-release cohort. Research must determine a narrower initial
cohort, responsible-adult role, account ownership model, and primary use case.
No junior beta is authorized by the existence of the catalog or prototype.

Adult-only prototype research using fictional profiles comes first. Any future
research involving children requires an approved protocol, appropriate guardian
consent and child assent, safeguarding arrangements, privacy/legal review, and
qualified oversight.

## Target product

The target experience may eventually:

- capture an age band, goal, fixed practices and matches, availability,
  equipment, supervision context, and minimal readiness inputs;
- generate a rolling seven-day plan from approved content and deterministic
  safety and scheduling rules;
- distinguish fixed team commitments from optional recommendations;
- explain what changed and why after readiness, activity, or schedule changes;
- support completion, modification, skipping, and unplanned activity logs; and
- provide a restrained weekly review without streak pressure or false
  physiological precision.

Availability, equipment, and qualified-supervision inputs remain target-product
requirements, but are deliberately deferred from the current onboarding UI.

## Current prototype

The current vanilla JavaScript prototype demonstrates the journey with browser
storage and seeded/local data. It is useful for adult usability and
practitioner review, but it is not a production planner:

- guardian approval is simulated by a checkbox, not verified consent;
- there is no real authentication, account isolation, backend, or production
  data protection;
- the browser selects a catalog routine but the visible week still uses the
  earlier plan template and UI-level adjustment logic;
- optional-training availability, equipment, and coach-supervision controls are
  not shown on onboarding Step 4; and
- the canonical planner is tested development groundwork and is not deployed.

## Non-negotiable boundaries

- PureAthletic does not diagnose, treat, rehabilitate, or clear an injury.
- Any reported pain pauses automated optional training for responsible-adult
  review; severe pain produces stop-training and professional-advice guidance.
- Team practices and matches are fixed and never moved automatically.
- Safety-critical behavior is deterministic, versioned, testable, and reviewed.
- AI cannot invent or approve training, override safety rules, or become a
  dependency for the core journey.
- Minor data is minimized, private by default, and excluded from unnecessary
  analytics or external processing.
- No training streak, leaderboard, or engagement mechanism should encourage
  training when rest is appropriate.

## What is deliberately out of scope

- diagnosis, rehabilitation, and return-to-play clearance;
- unrestricted AI-generated training;
- social feeds, messaging, public profiles, leaderboards, and streak pressure;
- wearables, live tracking, nutrition/supplement prescriptions, payments, and
  additional sports before the core loop is validated; and
- a minor-facing beta before every named release gate passes.

## Current priority

The next valuable work is evidence, not feature volume:

1. Run adult-only usability sessions on the current prototype.
2. Obtain qualified review of the exact catalog, rules, supervision assumptions,
   pain behavior, and copy.
3. Select a narrow first cohort and responsible-adult/account model.
4. Resolve the production data, privacy, consent, safeguarding, and
   authorization boundary.
5. Finish and review one canonical planner before integrating it into the
   browser or experimenting with AI.

For detail, use the [Product Requirements](product-requirements.md),
[Decision Sheet](decision-sheet.md), and
[Project Review](project-review.md).
