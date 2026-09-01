# PureAthletic — Project Progress Checkpoint

**Status:** Working progress summary; not a specification or release approval  
**Checkpoint date:** 1 September 2026  
**Baseline commit:** `5cb6895` (`fix: keep HEAD responses bodyless`)

This checkpoint translates the evidence-gated roadmap into a short operational
view. Percentages are planning estimates, not evidence that a gate has passed.
The source-of-truth order in the [documentation guide](README.md) still applies.

## Completion estimate

| Scope | Estimate | Meaning |
| --- | ---: | --- |
| Current adult research prototype | 85% | The journey is implemented and automated checks pass; real-browser, accessibility, and session evidence remain |
| Phase 0 discovery and safety foundation | 55% | Protocols and review instruments exist; participants, specialist findings, and the cohort decision remain |
| Full Phase 0–5 roadmap | 15% | Production, controlled beta, operational, accessibility, and optional scale phases have not begun |

Allow roughly ±5 percentage points. The full-roadmap estimate is intentionally
conservative because later phases require external evidence and approval, not
only repository changes.

## Current evidence

- The dependency-free prototype implements onboarding, Today, Training,
  Progress, Profile, readiness, logging, schedule changes, local export, and
  deletion demonstrations.
- The U5–U17 research catalog contains 17 source records, four age bands, five
  goals, 20 routine outlines, and 60 indexed level combinations.
- The canonical planner and safety scenarios are development groundwork and
  remain outside the browser build.
- On 1 September 2026, `npm run verify` passed against baseline commit
  `5cb6895`: 83 application/data/HTTP tests and four build-contract tests
  passed; training data and 68 documentation links validated; and the static
  build completed.
- The baseline branch was clean and synchronized with `origin/main` before this
  checkpoint was added.

Automated verification does not replace the two real-browser smoke pages or
the manual safety and accessibility checks in the
[prototype verification checklist](prototype-verification-checklist.md).

## Phase 0 gate status

| Required outcome | Status | Next evidence |
| --- | --- | --- |
| Narrow first user and problem | Open | Complete adult research and record the cohort/problem decision |
| Adult footballer/coach and parent/guardian perspectives | Not started | At least five approved adult sessions across both perspectives |
| Research questions and measures | Prepared | Use the versioned research plan and session form |
| Exact-version practitioner review | Awaiting review | Qualified youth-sport practitioner decision and itemised findings |
| Safeguarding/privacy review | Awaiting review | Reviewer decision, conditions, and escalation requirements |
| Data, risk, consent, and safeguarding foundations | Drafted | Select jurisdiction and storage process, then obtain appropriate review |
| Prototype automated verification | Passing | Re-run after changes and before sharing |
| Browser and accessibility evidence | Not recorded | Smoke pages plus keyboard, zoom, contrast, touch, and reduced-motion checks |

## Work order

Follow the roadmap backlog without feature expansion:

1. Prepare and approve adult participant information, consent, storage, and
   deletion arrangements.
2. Record real-browser verification against the exact research commit.
3. Run at least five adult sessions using fictional profiles.
4. Run exact-version practitioner and safeguarding/privacy reviews.
5. Synthesize findings and decide to continue, narrow, investigate, or stop.
6. Select the first cohort/problem only from that evidence.

Do not interpret this checkpoint as permission for minor research, real
training use, production data, or a private beta.
