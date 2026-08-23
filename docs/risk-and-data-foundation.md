# PureAthletic — Risk and Data Foundation

**Status:** Draft design baseline; requires jurisdiction-specific legal review
**Last reviewed:** 24 August 2026
**Version:** 1.1

## Purpose

This document defines the minimum information, controls, and decisions required
before PureAthletic stores real athlete or guardian data. It is a design and
engineering baseline, not legal advice or a completed privacy impact assessment.

## Risk appetite

PureAthletic has a low tolerance for:

- unsafe training recommendations;
- unauthorized access to a minor’s or guardian’s data;
- invalid, unverifiable, or misleading consent;
- accidental exposure of pain, readiness, or activity information;
- silent data loss or untraceable recommendation changes;
- manipulative engagement that encourages unsafe training.

The product may tolerate slower growth, fewer features, manual review, and
conservative recommendations to reduce these risks.

## Data inventory

| Data area | Examples | Classification | Minimum use | Initial retention decision |
| --- | --- | --- | --- | --- |
| Account | Login identifier, account status | Personal | Authentication and support | Define with legal review |
| Responsible-adult relationship | Actor, relationship/authority evidence, approval or consent status, policy version, timestamps, withdrawal | Sensitive personal | Eligibility and accountability where required | Do not set until jurisdiction and account model are approved |
| Athlete profile | Preferred name, age band, position, goal, experience | Personal; age-related | Plan selection | Minimize and review periodically |
| Schedule | Practices and matches; future availability/equipment inputs | Personal | Planning | Availability/equipment are deferred from the active UI; retain only while used |
| Readiness | Sleep, energy, soreness, stress, pain response | Potentially health-related/sensitive; legal classification varies | Conservative adjustment | Short retention unless an approved audit purpose requires more |
| Activity | Duration, exertion, completion, notes | Personal; potentially health-related | Planning and progress | User-controlled history with deletion support |
| Recommendation | Routine, rule, content version, explanation | Product/audit | Explain and reproduce decisions | Retain according to audit policy |
| Adjustment | Before/after plan, rule, timestamp, undo status | Product/audit | Explain changes and incidents | Retain according to audit policy |
| Support/incident | Report, action, resolution | Sensitive operational | Safeguarding and service recovery | Restricted access and defined schedule |
| Analytics | Events such as plan viewed or task completed | Aggregated/pseudonymous | Product improvement | No raw health or free-text payloads |

Exact retention periods, lawful bases, age assurance, international transfers,
and guardian-consent mechanisms require advice for each launch jurisdiction.
Consent is not a substitute label for every lawful basis; record the approved
purpose and basis for each processing activity separately.

## Data minimization rules

- Use developmental age bands rather than exact date of birth in the planning
  payload unless a separately approved feature needs more precision.
- Do not require free-text medical history, precise location, school, team name,
  or contact details for plan generation.
- Do not collect data merely because it might be useful later.
- Do not send names, contact details, exact locations, free-text health notes, or
  direct identifiers to analytics or AI providers.
- Treat any user-entered free text as potentially sensitive and restrict who can
  access it.
- Prefer structured choices with clear explanations and an optional skip path.

## Proposed production entities

Every record must have an owner, creation/update timestamps, and a defined
authorization policy.

- `Account`
- `ResponsibleAdultRecord` or a jurisdiction-appropriate alternative
- `AthleteProfile`
- `Availability`
- `FixedCommitment`
- `TrainingPlan`
- `PlannedSession`
- `WorkoutTemplate`
- `ActivityLog`
- `ReadinessCheckIn`
- `PlanAdjustment`
- `RecommendationDecision`
- `WeeklySummary`
- `NotificationPreference`
- `AuditEvent`
- `SupportIncident`

Important relationships:

- The account owner and relationship model are open. Do not assume the athlete
  directly owns the account or that one account maps to one profile until the
  first cohort, jurisdiction, consent model, and recovery process are decided.
- Every athlete-owned record references the owning account directly or through
  a verifiable ownership chain.
- A planned session may reference one activity log; an unplanned activity may
  exist without a planned session.
- A recommendation decision records the rule-set and content versions used.
- A plan adjustment records before/after state, reason, actor, and whether it
  was automatic, confirmed, or undone.
- Approval/consent records, where applicable, are append-only from the
  application’s perspective; a new policy version creates a new record rather
  than overwriting history.

## Threat model baseline

### Assets to protect

- Minor and guardian identity data.
- Pain, readiness, activity, and any later-approved physical-limitation
  information.
- Consent and safeguarding records.
- Recommendation rules and content versions.
- Authentication sessions, recovery mechanisms, and export files.
- Operational logs and support incidents.

### Threats to address

| Threat | Required control |
| --- | --- |
| User reads another account’s records | Server-side authorization, ownership checks, negative tests, and review of every endpoint |
| Stolen or guessed session | Secure cookies/tokens, expiry, revocation, rate limits, and recovery controls |
| Browser exposes secrets | Keep service credentials server-side; audit built assets and environment handling |
| Malicious or malformed input | Server-side validation, output encoding, safe file handling, and rate limits |
| Consent is forged or ambiguous | Verified flow, policy version, timestamp, actor, and revocation behavior |
| Sensitive data leaks through logs | Structured logging with redaction and access controls |
| Export link is shared | Short-lived, authenticated, one-time or revocable download process |
| Unsafe rule or catalog change | Versioning, review status, staged release, scenario tests, and rollback |
| AI produces unsafe or invented content | Do not use AI for safety decisions; schema validation, allowlists, fallback, and audit |
| Dependency or build compromise | Lockfiles, provenance, scanning, review, reproducible CI, and least privilege |
| Service outage or data loss | Backups, restore tests, health checks, incident runbook, and graceful fallback |
| Child is pressured to overtrain | No streak pressure, competitive ranking, manipulative nudges, or volume-maximizing copy |

Before production, turn this into a formal threat model with trust boundaries,
data-flow diagrams, abuse cases, mitigations, owners, and verification tests.

## Required technical controls

- TLS in transit and platform-supported encryption at rest.
- Server-side authorization on every read and write.
- Separate development, preview, and production data and credentials.
- Secure passwordless or password-based authentication with accessible recovery.
- CSRF, XSS, injection, upload, and dependency protections appropriate to the
  chosen stack.
- Rate limits and abuse monitoring on authentication, exports, and support
  paths.
- Redacted logs with restricted access and defined retention.
- Immutable or access-controlled audit records for consent, recommendations,
  adjustments, exports, deletions, and incidents.
- Encrypted backups with routine restore verification.
- Automated tests for authorization failures, deletion, export, and safety
  hard stops.
- Dependency inventory, update process, vulnerability response, and release
  provenance.
- A documented vulnerability disclosure and incident response path.

## Privacy and child-safety controls

- High-privacy defaults for minor accounts.
- Clear, age-appropriate explanations of what data is collected and why.
- Guardian controls that do not expose more information than necessary.
- No advertising based on pain, readiness, activity, or other health-related
  information.
- No unnecessary profiling, location tracking, public profiles, or messaging in
  the initial release.
- Data export and deletion that cover the account, athlete data, consent, and
  derived records subject to documented legal exceptions.
- A process for access requests, correction, consent withdrawal, safeguarding
  concerns, and account closure.

## Incident severity and response

### Critical

Examples: unsafe recommendation causing plausible immediate harm, cross-account
data access, compromised credentials, or serious safeguarding concern.

Response: pause affected feature or service, preserve evidence, notify the
responsible owner, assess affected people, seek qualified professional/legal
advice, and document corrective action before reopening.

### High

Examples: repeatable authorization bypass, sensitive data in logs, broken
consent flow, or missing pain hard stop.

Response: stop the relevant release, assign an owner and deadline, patch,
retest, and obtain review before release.

### Medium/Low

Examples: non-sensitive UI defect, recoverable analytics error, or minor
documentation gap.

Response: record, prioritize, fix through normal delivery, and monitor for
repetition.

Never use analytics alone to detect safety incidents. Provide a visible support
or report route and a manual review process.

## Approval checklist before real data

- [ ] Jurisdiction and responsible legal/privacy reviewer identified.
- [ ] Data inventory and retention decisions approved.
- [ ] Guardian consent and withdrawal flow approved.
- [ ] Threat model reviewed and high-risk mitigations assigned.
- [ ] Data model and authorization rules implemented and tested.
- [ ] Export and deletion tested with realistic records.
- [ ] Backup restoration demonstrated.
- [ ] Logs redacted and access controlled.
- [ ] Incident and safeguarding escalation runbook tested.
- [ ] Practitioner has approved the exact content and rule versions.
- [ ] Accessibility review completed for consent, safety, and account controls.
- [ ] No real minor data is used in development, test fixtures, or analytics.

## Decision record

```text
Decision:
Date:
People consulted:
Jurisdiction(s):
Data affected:
Risk accepted or rejected:
Controls required:
Open legal or safeguarding questions:
Review date:
Owner:
```
