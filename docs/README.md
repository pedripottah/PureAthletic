# PureAthletic documentation guide

**Status:** Documentation governance baseline
**Last reviewed:** 24 August 2026

This directory contains product intent, research material, safety constraints,
and implementation guidance. It does not by itself prove that the product is
safe, legally compliant, clinically appropriate, or ready for minors.

## Read this first

Use this order when documents overlap:

1. [Product Requirements](product-requirements.md) define the target product,
   boundaries, and acceptance outcomes.
2. [Decision Sheet](decision-sheet.md) records current constraints, working
   decisions, hypotheses, deferred choices, and unresolved decisions.
3. Specialist control documents govern their own areas:
   [Junior Training Content Standard](junior-training-content-standard.md),
   [Risk and Data Foundation](risk-and-data-foundation.md), and
   [AI Integration Strategy](ai-integration-strategy.md).
4. [User Flow](user-flow.md) and
   [Low-Fidelity Wireframes](low-fidelity-wireframes.md) describe the target
   experience. They are design artifacts, not a description of everything the
   current prototype implements.
5. Research documents define how assumptions are tested. The
   [Prototype Verification Checklist](prototype-verification-checklist.md)
   defines what must be checked before a research session.
6. The code and automated tests are authoritative for current implemented
   behavior. When code and target documentation differ, record the gap; do not
   silently rewrite either as if the gap did not exist.

The [Three-Year Roadmap](three-year-roadmap.md) is sequencing guidance, not a
deadline or permission to pass a release gate. The
[Project Review](project-review.md) is a dated assessment and immediate backlog,
not a permanent specification.

## Language used across documents

- **Current prototype:** behavior present in the local vanilla JavaScript app.
- **Target product:** intended behavior that may not yet be implemented or
  validated.
- **Product constraint:** a boundary that cannot change without an explicit
  product and risk decision.
- **Working decision:** the current direction, reversible when evidence changes.
- **Hypothesis:** an assumption that requires research or measurement.
- **Deferred:** intentionally excluded from the active prototype or milestone.
- **Release gate:** evidence or approval required before the named release.

Words such as *approved*, *validated*, *safe*, *compliant*, and *ready* require
named evidence, scope, reviewer, version, and date. Passing automated tests
means only that encoded behavior matched those tests.

## Current prototype snapshot

As of 24 August 2026:

- the active app is a local, dependency-free research prototype using browser
  storage; it has no production authentication, guardian-consent mechanism,
  backend authorization, or server-side persistence;
- onboarding Step 4 collects fixed practices and matches only;
- optional-training availability, equipment, and qualified-coach inputs are
  deferred from the live onboarding UI;
- the browser selects a catalog recommendation but still builds the visible
  week from the earlier static plan and UI-level adjustment logic;
- `lib/canonical-planner.mjs` and its scenario tests are development groundwork,
  not part of the deployment artifact; and
- the U5–U17 catalog is research content awaiting qualified review, not an
  approved training programme or a validated private-beta cohort.

## Document register

| Document | Role | Current authority |
| --- | --- | --- |
| [Quick Product Summary](product-foundation-summary.md) | Short orientation | Summary only |
| [Product Requirements](product-requirements.md) | Target product and outcomes | Primary product specification |
| [Decision Sheet](decision-sheet.md) | Decision state and open questions | Primary decision register |
| [User Flow](user-flow.md) | Target journey and branches | Design input |
| [Low-Fidelity Wireframes](low-fidelity-wireframes.md) | Target screen concepts | Research/design artifact |
| [Project Review](project-review.md) | Current gaps and immediate backlog | Dated assessment |
| [Project Progress](project-progress.md) | Current gate status and completion estimate | Working checkpoint only |
| [Three-Year Roadmap](three-year-roadmap.md) | Evidence-gated sequence | Directional plan |
| [Research Plan](research-plan.md) | Research questions and rounds | Research protocol baseline |
| [Research Preparation](research-preparation.md) | Adult-session procedure | Operational research guide |
| [Adult Research Participant Pack](adult-research-participant-pack.md) | Participant information and consent template | Draft; approval required before use |
| [Research Session Form](research-session-form.md) | Session evidence capture | Research instrument |
| [Research Round Summary](research-round-summary.md) | Anonymised synthesis and decision record | Research instrument |
| [Prototype Verification](prototype-verification-checklist.md) | Pre-research checks | Current prototype checklist |
| [Safety Review Packet](safety-review-packet.md) | Qualified review scope | Review instrument, not approval |
| [Junior Content Standard](junior-training-content-standard.md) | Training-content controls | Draft specialist standard |
| [Risk and Data Foundation](risk-and-data-foundation.md) | Privacy/security baseline | Draft specialist standard |
| [AI Integration Strategy](ai-integration-strategy.md) | AI boundary and gates | Deferred technical strategy |

## Maintenance rules

When a product decision changes:

1. Update the Decision Sheet with status, reason, evidence, owner, and date.
2. Update Product Requirements only when target scope or acceptance outcomes
   change.
3. Update affected specialist controls before implementation.
4. Update flows, wireframes, tests, and verification steps together.
5. Mark deferred behavior explicitly instead of deleting useful future work or
   presenting it as current.
6. Re-run link, formatting, test, and prototype checks before merging.

Research notes containing participant or reviewer identity, consent records,
medical details, or safeguarding information must remain in approved private
storage and must not be committed to this repository.
