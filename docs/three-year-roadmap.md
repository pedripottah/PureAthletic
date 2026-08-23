# PureAthletic — Three-Year Product and Engineering Roadmap

**Status:** Working long-term plan
**Last reviewed:** 24 August 2026
**Applies to:** The football-planning research project and any future web service

## Purpose

This roadmap keeps PureAthletic useful, safe, maintainable, and realistic to
develop alongside a university degree. It is a sequence of evidence gates, not
a promise that every feature will be built. Each phase should produce something
that can be demonstrated, tested, documented, and learned from before the next
phase begins.

The product is currently a local, dependency-free prototype. It is not yet a
production service and must not be presented as ready for unsupervised use by
minors.

## Product north star

Help a junior footballer, with responsible-adult support, understand the most
appropriate next training or recovery action around their real football week.

The product should optimize for safe, understandable next-session decisions,
not time spent in the app, maximum training volume, social engagement, or
automated novelty.

## Non-negotiable principles

1. **Evidence before expansion.** Every major feature starts with a user need,
   a measurable hypothesis, and a small prototype or experiment.
2. **Safety before convenience.** A hard safety rule, uncertainty, pain report,
   or safeguarding concern cannot be overridden by the interface or AI.
3. **Human review for junior guidance.** Catalog content, thresholds, copy, and
   supervision expectations require qualified practitioner and safeguarding
   review before release.
4. **Privacy by design.** Collect the minimum data needed, use high-privacy
   defaults, keep minor data out of unnecessary analytics and AI payloads, and
   make retention, export, and deletion understandable.
5. **Accessible by default.** Build and test the core journey against WCAG 2.2
   Level AA, including keyboard, screen-reader, focus, contrast, motion, forms,
   touch targets, and clear language.
6. **Small reversible changes.** Prefer a modular web architecture, migrations,
   feature flags, backups, and rollback over large rewrites.
7. **Documented learning.** Every research round, incident, decision, release,
   and rejected idea leaves a short record in the repository.

## Current position

The prototype already demonstrates onboarding, age-aware catalog selection,
Today/Week/Progress/Profile screens, readiness, activity logging, schedule
changes, plan adjustments, local export/deletion, and deterministic catalog
validation. A canonical planner exists as development-only groundwork and is not
connected to the browser build. The first beta cohort and account owner remain
open. The main gaps are evidence from users, professional approval, a unified
reviewed planner, production identity/data controls, automated browser
verification, accessibility evidence, and operational readiness.

## Phase 0 — Discovery and safety foundation

**Timing:** Start now; complete before production architecture or minor
recruitment.

### Outcomes

- Confirm the first narrow problem and cohort, preferably one clear use case
  such as match readiness around an existing team schedule.
- Run adult-only interviews with footballer/coach and parent/guardian
  perspectives, plus a separate qualified practitioner review.
- Turn assumptions into research questions and rank them by risk.
- Produce a practitioner review packet for catalog content, thresholds, pain
  behavior, supervision, and athlete-facing wording.
- Complete a preliminary data inventory, threat model, privacy impact assessment,
  consent model, and safeguarding escalation plan.
- Define a measurable product hypothesis and a small set of success measures.

### Exit gate

Do not proceed until the team can state: who the first user is, what problem is
being solved, what must not happen, how success will be measured, what data is
needed, and who is accountable for safety decisions.

## Phase 1 — Prototype validation

**Timing:** After Phase 0 exit evidence; calendar dates do not override the gate.

### Outcomes

- Test the current prototype in small rounds of 4–8 participants rather than
  one large study.
- Include adults first, then only age-appropriate participants through an
  approved research process.
- Test onboarding, first-plan comprehension, daily recommendation, readiness,
  pain/safety branches, logging, adjustment explanations, and weekly review.
- Run a manual accessibility review with keyboard navigation, screen reader,
  zoom/reflow, reduced motion, contrast, and touch-size checks.
- Add browser smoke execution to the normal test workflow.
- Fix the highest-impact usability and safety-copy problems; avoid feature
  expansion during this phase.

### Exit gate

- At least five documented sessions across relevant user types.
- No unresolved high-severity safety or consent confusion.
- Core tasks have written acceptance criteria and pass browser smoke checks.
- Practitioner feedback is recorded with accepted, rejected, or pending items.
- A decision is made to continue, narrow the product, or stop.

## Phase 2 — Production foundation

**Timing:** Only after Phase 1 evidence supports continuing.

### Outcomes

- Choose the smallest production architecture the project can operate reliably;
  avoid adopting a framework or vendor only for prestige.
- Establish TypeScript or equivalent type checking, formatting, linting,
  dependency scanning, CI, preview deployments, environment separation, and
  reproducible builds.
- Implement authentication, the selected account-owner and consent/approval
  model, session management, authorization, account isolation, audit records,
  export, and deletion.
- Define database migrations, backups, restore tests, retention, and incident
  response before storing real user data.
- Keep safety-critical recommendation logic server-authoritative and versioned.
- Add structured logs, error monitoring, uptime checks, and privacy-preserving
  product analytics.
- Establish a release checklist and a vulnerability-reporting path.
- Unify the catalog, weekly scheduler, readiness/adaptation rules, and decision
  trace into one tested planning boundary before beginning an offline AI
  experiment with synthetic profiles.

### Exit gate

An independent test must show that users cannot access one another’s data,
secrets are not exposed to browsers, deletion/export work, backups can be
restored, high-risk events are auditable, and the core service can be monitored
and rolled back.

## Phase 3 — Deterministic MVP and controlled closed beta

**Timing:** Only after the production foundation passes.

### Outcomes

- Rebuild the research-supported core loop on production infrastructure:
  onboarding → plan → check-in → train/rest → log → adjust → review.
- Finish and integrate the canonical adaptive planner. Each rule needs explicit
  inputs, priority, output, explanation, undo policy, test scenarios, source,
  and practitioner approval status.
- Version the catalog, rules, plan, and safety copy so every recommendation can
  be explained after the fact.
- Release to the selected small, supported cohort with the approved responsible
  adults, account controls, and support/escalation process its protocol
  requires.
- Review safety signals weekly and pause releases when a serious issue appears.

### Exit gate

- Four-week pilot completed with consent and support processes working.
- No unresolved critical safety, privacy, authorization, or data-loss incident.
- Core usability and product metrics improve or meet predefined thresholds.
- Practitioner signs off on the exact release version, not merely the concept.
- The team can explain why every automated change happened.

## Phase 4 — Reliability, accessibility, and learning

**Timing:** After a controlled pilot demonstrates a product worth operating.

### Outcomes

- Run continuous small research rounds and include disabled users in testing.
- Improve accessibility toward documented WCAG 2.2 AA conformance evidence.
- Measure performance on low-end mobile devices and slow networks.
- Add data-quality checks, stale-data handling, rate limits, abuse controls,
  content versioning, and support tooling.
- Review retention without using manipulative notifications or pressure to train.
- Publish a transparent changelog and maintain architecture, threat-model,
  privacy, and decision records.
- Expand only where research shows a real need: more goals, languages, or
  supported age bands should each receive separate practitioner review.

### Exit gate

The service is stable, supportable, accessible, and demonstrably useful for
the original cohort. Expansion is justified by evidence rather than a feature
wish list.

## Phase 5 — Carefully bounded intelligence and scale decisions

**Timing:** Optional and evidence-dependent; no target date.

### Outcomes

- Consider AI only for constrained explanations, alternatives from approved
  content, and summaries—not for independent safety decisions.
- Treat free-form plan generation as out of scope unless a new safety, privacy,
  practitioner, and evaluation review explicitly changes that decision.
- Send the minimum structured context, validate outputs server-side, log model
  and prompt versions, test prompt injection and unsafe outputs, and retain a
  deterministic fallback.
- Evaluate coach, club, parent, wearable, payment, or social features only as
  separate products with separate privacy, safeguarding, and operational
  reviews.
- Decide whether to remain a research project, continue as a small service, or
  scale with additional people and governance.

### Exit gate

No new capability launches unless its user need, risk assessment, cost of
operation, data impact, accessibility plan, and rollback plan are documented.

## The recurring development loop

Every two-week working cycle should contain:

1. One explicit research or product question.
2. One small design or implementation slice.
3. Automated tests plus manual accessibility and safety checks where relevant.
4. A review of analytics, errors, feedback, and open risks.
5. A short decision log entry: learned, changed, deferred, or stopped.

Every release should include a version, test result, known limitations,
content/rule versions, rollback method, and owner for post-release monitoring.

## Initial backlog, in order

1. Prepare approved adult-research information/consent materials and run the
   [Phase 0 Research Plan](research-plan.md) using the current prototype.
2. Run the [Practitioner/Safeguarding Review Packet](safety-review-packet.md)
   against an exact version and record every condition or rejection.
3. Select or reject a narrow first cohort/problem from the evidence.
4. Add browser smoke execution and a manual WCAG 2.2 AA checklist to CI/release
   verification.
5. Resolve high-severity usability, safety-copy, accessibility, and consent
   findings.
6. Complete the unresolved account, privacy, consent, retention, incident, and
   data decisions in the [Risk and Data Foundation](risk-and-data-foundation.md).
7. Finish and review the canonical planner; keep it out of the browser until
   the deferred-input and persistence rollout gates pass.
8. Write the production architecture and data-contract decision only if the
   research supports continuing.
9. Build identity, consent, authorization, persistence, export, deletion,
   monitoring, backups, and recovery as one production-foundation milestone.
10. Re-run professional review against the exact release candidate.
11. Start a small, supported closed beta only after every release gate passes.

## Explicitly defer

Do not prioritize AI-generated plans, social features, leaderboards, wearables,
payments, native apps, coach/club portals, advertising, or additional sports
until the core loop is safe, understandable, accessible, privacy-reviewed,
operationally supported, and useful for the original cohort.

## Reference standards and guidance

- [WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessibility requirements and
  testable success criteria.
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
  — web application security verification requirements.
- [NIST SSDF](https://csrc.nist.gov/projects/ssdf) — secure development
  practices integrated throughout the software lifecycle.
- [ICO Age Appropriate Design Code](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/)
  — privacy and safety expectations for services likely to be accessed by
  children. Local legal advice remains necessary.
- [EDPB guidance on children](https://www.edpb.europa.eu/topics/key-gdpr-concepts/children_en)
  — child-specific protection and age-appropriate transparency under GDPR.
- [GOV.UK user research guidance](https://www.gov.uk/service-manual/user-research/plan-user-research-for-your-service)
  — research questions, participant groups, small rounds, and feeding findings
  into prioritization.

These sources guide the project; they are not a substitute for qualified
medical, safeguarding, privacy, or legal advice in the jurisdictions where the
service may operate.
