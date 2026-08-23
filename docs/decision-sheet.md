# PureAthletic V1 Decision Sheet

**Status:** Active decision register
**Last updated:** 24 August 2026
**Owner:** Product founder

This register separates product constraints from reversible decisions and
untested assumptions. “Working decision” does not mean user-validated,
practitioner-approved, legally reviewed, or implemented. See the
[documentation guide](README.md) for conflict rules.

## Status vocabulary

- **Product constraint:** may change only through an explicit product and risk
  decision.
- **Working decision:** current direction; evidence may change it.
- **Hypothesis:** must be tested before it defines a beta.
- **Needs specialist review:** cannot be relied on for junior release.
- **Deferred:** intentionally outside the active prototype or milestone.
- **Open:** no responsible decision has been made.

## Product focus

| Decision | Current direction | Status | Evidence or next action |
| --- | --- | --- | --- |
| User problem | Help a footballer understand the next appropriate action around team commitments, recent activity, and recovery | Working decision | Test comprehension and perceived value in adult research |
| Research catalog | U5–U17 football, Beginner and Intermediate; Advanced research-only | Working decision; needs specialist review | Catalog coverage is not proof that all bands should launch |
| First beta cohort | A narrower junior football cohort with responsible-adult support | Open | Choose only after adult research, practitioner input, and account/consent analysis |
| Initial use case | Match readiness around an existing team week | Hypothesis | Compare with general training-planning needs in interviews |
| Platform | Responsive, mobile-first web app | Working decision | Current prototype supports this direction |
| Product promise | A realistic, explainable next seven days—not maximum training volume | Product constraint | Preserve across design and metrics |

## Product and safety constraints

| Constraint | Required behavior |
| --- | --- |
| Fixed commitments | Practices and matches remain visible and are never moved automatically |
| Safety authority | Deterministic, versioned rules—not AI—control safety-critical behavior |
| Pain | Any reported pain pauses automated optional training for responsible-adult review; severe pain adds stop-training/professional-advice guidance |
| Medical boundary | No diagnosis, treatment, rehabilitation, or return-to-play clearance |
| Content | Recommendations use reviewed, approved IDs; missing or conflicting inputs produce a conservative fallback |
| Explanation | Every material adjustment states what changed, why, confirmation state, and undo availability |
| Engagement | No streaks, rankings, or nudges that reward training through rest or pain |
| Data | Collect only what an active feature needs; treat readiness, pain, limitations, and notes as sensitive |
| Accessibility | Design and verify the complete core journey against WCAG 2.2 AA |

All training thresholds, supervision rules, pain wording, and age-band content
remain blocked on qualified practitioner review of the exact version.

## Experience decisions

| Decision | Current direction | Status | Next evidence |
| --- | --- | --- | --- |
| Planning horizon | Today plus the following six days | Working decision | Test against Monday-to-Sunday expectations |
| Primary navigation | Today, Week, Progress, Profile | Working decision | Observe findability in adult sessions |
| Default destination | Today with one clear next action | Working decision | Test task success without prompting |
| Readiness timing | Before the first optional session of the day | Hypothesis | Compare with morning or on-demand timing |
| Readiness inputs | Sleep, energy, soreness, stress, and pain in under one minute | Working decision; needs specialist review | Validate comprehension, necessity, and thresholds |
| Session outcomes | Completed, modified, skipped, or unplanned | Working decision | Confirm labels and logging burden |
| Plan changes | Preview non-safety changes; apply safety restrictions immediately; allow undo only after a fresh safety check | Working decision | Scenario-test every branch |
| Progress | Appropriate completion, duration/context trends, and explanations without prescriptive scores | Hypothesis | Test motivation and risk of overtraining interpretations |

## Onboarding decisions

The active research prototype has five steps. Step 4 collects only fixed
practices and matches. The checkbox labelled as guardian approval is a research
simulation and must never be described as verifiable consent.

The target product may later collect independent-training availability,
available time, equipment, and qualified-supervision context. Those inputs are
**deferred** from the current UI until:

1. a narrower first cohort and account owner are selected;
2. the minimum safe input set is agreed with a practitioner;
3. placement and wording pass usability testing;
4. the canonical planner is reviewed and ready to consume them; and
5. a deliberate storage migration and privacy purpose are documented.

Current onboarding principles:

- structured inputs must be sufficient; free text is optional and minimized;
- every requested field must map to an active decision or be removed;
- progress and Back behavior preserve completed answers; and
- the user reviews inputs before generation.

## Identity, consent, and data decisions

| Decision | Current direction | Status | Required before beta |
| --- | --- | --- | --- |
| Account owner for minors | Undecided: guardian-owned, linked guardian/athlete, or age-dependent model | Open | Jurisdiction, safeguarding, privacy, and usability review |
| Authentication | No provider or email/password method selected | Open | Threat model, recovery, accessibility, and age/consent model |
| Guardian involvement | Meaningful, verifiable, revocable, and versioned where legally/ethically required | Product constraint; implementation open | Approved consent and withdrawal flow |
| Authorization | Server-side ownership checks for every record and operation | Product constraint | Negative cross-account tests |
| Export/deletion | Understandable export and deletion covering derived records, subject to documented lawful exceptions | Product constraint; needs legal review | End-to-end tests and retention policy |
| Analytics | No health/free-text payloads; collect only approved product events | Product constraint | Data map and privacy review |
| Advertising | No use of pain, readiness, activity, or minor profiling for advertising | Product constraint | Preserve as business-model boundary |

## AI decision

AI is deferred from user-facing behavior. If revisited, the first candidate is
a constrained explanation or weekly summary over approved planner output. It
must be server-side, schema-validated, evaluated, monitored, disableable, and
backed by deterministic fallback. It may not select safety outcomes, invent
training, or receive unnecessary minor data. See the
[AI Integration Strategy](ai-integration-strategy.md).

## V1 boundary

The target core loop remains:

`Onboard → plan → check in → train or rest → log → adjust → review`

Explicitly deferred: additional sports, social features, public profiles,
messaging, leaderboards, streaks, coach/club portals, wearables, live location,
nutrition/supplement prescriptions, payments, native apps, and unrestricted AI
training generation.

## Decisions required next

1. Select the first cohort and account owner only after research evidence.
2. Approve or reject each catalog/rule/supervision assumption with a qualified
   practitioner.
3. Decide the minimum onboarding input set for that cohort.
4. Decide jurisdiction and complete privacy, safeguarding, consent, and legal
   analysis before designing production identity.
5. Decide whether the validated problem justifies a production build.

Record each decision with date, owner, evidence links, affected documents, and
the trigger for re-review.
