# PureAthletic — Practitioner and Safeguarding Review Packet

**Status:** Awaiting qualified review
**Packet last reviewed:** 24 August 2026
**Version under review:** Record the exact commit and artifact before sending
**Scope:** Research catalog and prototype behavior across U5–U17; launch cohort
not yet selected

## Review purpose

This packet gives qualified reviewers a bounded set of materials to assess.
Approval of this packet does not approve production release, medical use, or
any jurisdiction-specific legal position.

The reviewer should assess the exact catalog, rule behavior, interface copy, and
data flows intended for release. General approval of the product idea is not
enough.

## Product boundary

PureAthletic provides general training-planning guidance. It does not diagnose,
treat, rehabilitate, clear, or predict medical or athletic outcomes. It does
not replace a parent/guardian, coach, doctor, physiotherapist, or other
qualified professional.

The current research boundary is:

- Football only.
- Team age bands U5–U8, U9–U12, U13–U15, and U16–U17.
- Beginner and Intermediate recommendations only.
- Advanced content remains unavailable.
- The prototype simulates guardian approval; it does not implement verifiable
  consent or prove a guardian relationship.
- Team practices and matches are fixed context, not automatically movable work.
- Deterministic rules are the intended authority for safety-critical behavior,
  but the active browser still contains static and UI-level planning paths.

Review the deployed prototype and the development-only canonical planner as
separate artifacts. Approval of one does not approve the other or authorize
their integration.

## Materials for the reviewer

Provide the reviewer with:

1. `data/youth-football/sources.json`
2. `data/youth-football/taxonomy.json`
3. `data/youth-football/routine-catalog.json`
4. `data/youth-football/recommendation-index.json`
5. `docs/junior-training-content-standard.md`
6. `lib/canonical-planner.mjs` and its scenario tests, clearly labelled
   development-only.
7. `docs/user-flow.md` and `docs/low-fidelity-wireframes.md`, clearly labelled
   as target design rather than current behavior.
8. The exact deployed or locally served prototype commit.
9. The scenario matrix below, automated output, and recorded browser-smoke
   results.

The reviewer should receive a versioned copy of all materials, not an informal
description or changing development branch. A source list or passing validator
does not establish that the derived routines or thresholds are appropriate.

## Review domains

### A. Developmental appropriateness

- Are the four age bands meaningfully distinct for the proposed routines,
  instructions, duration, intensity, and progression?
- Is the language understandable and appropriate for each age band?
- Are the activities appropriate for the likely environment and equipment?
- Are supervision requirements visible at the moment they matter?
- Does the product avoid treating total daily activity as extra training to add
  on top of school, football, free play, and normal life?

### B. Training content

- Is every routine technically coherent and feasible without specialist
  equipment?
- Are warm-up, technique cues, easier options, stopping conditions, and finish
  guidance adequate?
- Are duration, intensity, progression, and recovery limits conservative?
- Are there hidden assumptions about coaching, space, flooring, weather, or
  skill that need to be made explicit?
- Are any exercises inappropriate for the age band or unsupervised use?

### C. Scheduling and workload

- Are fixed practices and matches protected from automatic movement?
- Is the pre-match and post-match behavior appropriate?
- Are consecutive high-load days handled conservatively?
- Is the maximum independent-session policy suitable for the age bands?
- Does the plan preserve recovery when the fixed schedule allows it?
- Does the product avoid incentivizing extra activity when the athlete already
  has substantial football or school activity?

### D. Readiness, pain, and uncertainty

- Does any pain or red-flag response produce appropriately conservative behavior?
- Are moderate and severe pain states distinguished safely, or should they be
  combined until more professional guidance is available?
- Does the product avoid implying that a readiness score is a diagnosis?
- Are stop-training, adult-review, and professional-advice instructions clear?
- What should happen when data is missing, contradictory, stale, or entered by
  someone other than the athlete?

### E. Guardian and safeguarding experience

- Is guardian approval meaningful, verifiable, revocable, and versioned?
- Does the product make the responsible adult’s role clear without shifting all
  responsibility onto a child?
- Can a child safely understand warnings without being frightened or shamed?
- Are notifications, contact methods, and support escalation appropriate for
  minors?
- Are there any social, competitive, persuasive, or streak mechanics that could
  encourage unsafe behavior?
- Can the service be paused or closed safely if a concern is raised?

### F. Content and interface language

- Are recommendations direct, calm, and non-judgmental?
- Does the interface distinguish guidance from medical advice?
- Are explanations specific enough to build trust without overstating certainty?
- Are instructions understandable without relying on color, icons, or animation?
- Are translations, reading level, and accessibility needs considered?

## Required scenario review

For every scenario, record the expected result, actual prototype result, risk,
required change, and approval status.

| Scenario | Expected safety question |
| --- | --- |
| U5–U8 beginner with no equipment | Is the activity playful, controlled, and supervised? |
| U9–U12 intermediate speed goal | Is the routine age-appropriate and not maximal? |
| U16–U17 beginner strength goal | Is technique prioritized over load and failure? |
| Match tomorrow | Is high-load lower-body work protected? |
| Match completed today | Is the next recommendation appropriately easy? |
| Three team commitments in seven days | Does optional work reduce rather than crowd the week? |
| Low sleep and high soreness | Does the plan choose easy recovery or rest? |
| Mild pain | Is automated optional training paused and adult review clear? |
| Moderate pain | Is automated optional training paused without implying diagnosis? |
| Severe pain | Is there stop-training guidance and appropriate qualified-support wording? |
| Red-flag symptom | Is there no workout recommendation and a clear escalation? |
| Unplanned high-load activity | What recovery horizon should be reassessed for this cohort, and is the fallback conservative? |
| Missing readiness input | Does the app avoid false precision? |
| Schedule changed after plan generation | Are fixed commitments preserved and changes explained? |
| Guardian approval withdrawn | Is access or junior guidance paused appropriately? |
| Data export requested | Does the export avoid unnecessary sensitive exposure? |

## Approval categories

Use one status for every item:

- **Approved** — suitable for the reviewed scope and version.
- **Approved with conditions** — usable only after listed changes or controls.
- **Needs evidence** — cannot be approved until a question is answered.
- **Rejected** — unsafe, inappropriate, or outside the product boundary.
- **Not reviewed** — no conclusion; must not be treated as approval.

## Release-blocking findings

Any of the following blocks junior release until resolved and re-reviewed:

- A recommendation could plausibly encourage training despite pain or a red flag.
- A fixed match or practice can be moved or overridden automatically.
- A child can use the junior product without the required approval or consent.
- The product implies diagnosis, treatment, injury clearance, or guaranteed
  performance improvement.
- The reviewer cannot reconstruct why a recommendation or plan adjustment was
  produced.
- Safety-critical copy is missing, ambiguous, inaccessible, or contradicted by
  another screen.
- Sensitive minor data is sent to an unnecessary third party or used for
  advertising, profiling, or engagement pressure.

## Reviewer decision record

```text
Reviewer:
Qualification/role:
Organisation (if applicable):
Materials and versions reviewed:
Date:

Overall decision: Approved / Approved with conditions / Needs evidence / Rejected

Approved scope:
Conditions:
Release-blocking findings:
Required changes:
Recommended future research:
Next review trigger:
Signature or written confirmation:
```

## Review cadence

Repeat review when any of the following changes:

- age band, goal, routine, intensity, progression, or supervision requirement;
- readiness, pain, scheduling, or adjustment thresholds;
- consent, guardian, notification, or data-sharing behavior;
- athlete-facing safety or disclaimer copy;
- AI behavior or third-party processing;
- a serious incident, near miss, or repeated unsafe misunderstanding.

Store the signed decision and reviewed versions privately where they contain
personal or professional information. Commit only the decision summary and
non-sensitive action list to the repository.
