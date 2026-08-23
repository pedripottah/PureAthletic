# PureAthletic — Prototype Review and Immediate Backlog

**Review date:** 24 August 2026
**Scope:** Active vanilla prototype, product documentation, training data,
planner groundwork, and verification workflow
**Status:** Dated assessment; not a product specification or release approval

## Outcome

The prototype is suitable for controlled adult usability sessions and for
showing exact behavior to qualified reviewers. It is not suitable for real
training use, a minor-facing beta, or production data.

The product idea remains a hypothesis. The repository demonstrates a coherent
journey, but does not yet establish that the problem is valuable enough, the
U5–U17 audience is appropriately scoped, the recommendations are professionally
approved, or the system can safely operate with real accounts.

## What exists today

- A dependency-free local web prototype with onboarding, Today, Week, Progress,
  Profile, check-in, workout, logging, schedule editing, adjustment, export, and
  deletion demonstrations.
- Browser-local persistence and simulated guardian/disclaimer acknowledgements.
- A U5–U17 catalog with versioned source records, taxonomy, routine outlines,
  recommendation index, and validation tests.
- A separate legacy junior rule library and recommendation engine.
- A development-only canonical planner with scenario tests; it is not imported
  by the browser or included in the deployment build.
- Manual browser smoke pages plus Node, data-validation, and build checks.

## Important limitations

- The first beta cohort and account owner are unresolved. Catalog coverage must
  not be mistaken for an audience decision.
- The guardian checkbox is not consent, age assurance, identity verification,
  or a safeguarding control.
- There is no production authentication, server authorization, persistence,
  retention policy, audit store, backup, monitoring, or incident operation.
- The visible browser week still combines catalog selection with a static plan
  template and UI-level adjustments; it is not the canonical planner output.
- Availability, equipment, and qualified-supervision inputs are deliberately
  absent from active onboarding, so the current prototype cannot safely claim
  to filter recommendations using those inputs.
- Catalog validation proves schema consistency, not developmental
  appropriateness or safety.
- Browser smoke pages require manual execution in a real browser and are not
  currently run by `npm test` or CI.
- Accessibility has checklist coverage but no conformance evidence.

## Immediate priorities

### P0 — Keep the prototype inside its research boundary

Use fictional profiles and adults only. Do not invite users to follow workouts.
Every session must state that the prototype is being evaluated and is not
medical or training advice.

### P0 — Obtain exact-version specialist review

A qualified youth-sport practitioner must review catalog content, age bands,
session duration/intensity, supervision, progression, match spacing, readiness,
pain behavior, and athlete-facing copy. Safeguarding/privacy reviewers must
assess the proposed account and research model separately.

### P1 — Test the problem before expanding the product

Run at least five structured adult sessions across footballer/coach and
parent/guardian roles. Focus on recent planning behavior, next-action
comprehension, fixed-versus-optional understanding, pain interpretation, and
which onboarding inputs feel necessary.

### P1 — Select one product and planning boundary

After research and practitioner feedback, choose the first cohort and canonical
content schema. Finish one planner contract for catalog selection, dated
scheduling, supervision/equipment checks, readiness/pain restrictions,
adaptation, traceability, and safe fallbacks. Do not reconnect it to the browser
until rollout inputs and migration behavior are deliberately reviewed.

### P1 — Automate browser verification

Add a repeatable browser command or CI job that starts the server and executes
both smoke pages. Until then, record browser, viewport, commit, and PASS result
manually before each research share.

### P1 — Decide whether production is justified

Only after evidence supports continuing, write the production architecture and
data-contract decision. Identity, consent, authorization, persistence, export,
deletion, monitoring, backups, and recovery belong to one production-foundation
milestone—not piecemeal prototype additions.

## Next milestone exit criteria

- At least five adult research sessions are recorded privately and summarized.
- A first cohort/problem decision is recorded with evidence.
- Qualified review findings are mapped to exact catalog/rule versions.
- Every high-severity usability, safety-copy, consent, and accessibility finding
  has an owner and disposition.
- Both browser smoke pages pass against the shared commit and results are
  recorded.
- The canonical planner’s remaining gaps and browser rollout conditions are
  explicit.
- A continue, narrow, investigate, or stop decision is documented.

Do not treat completion of this milestone as authorization for a junior beta.
The release gates in the Product Requirements, Risk and Data Foundation, and
Safety Review Packet still apply.
