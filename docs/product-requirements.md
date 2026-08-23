# PureAthletic Version One Product Requirements

**Status:** Target-product requirements; research and specialist review pending
**Last reviewed:** 24 August 2026
**Owner:** Product founder

These requirements describe intended outcomes, not everything implemented in
the current prototype. The [Decision Sheet](decision-sheet.md) records which
choices are constraints, working decisions, hypotheses, deferred, or open.

## 1. Product summary

PureAthletic is a proposed adaptive training planner for youth football. It is
intended to turn a player’s goal, fixed schedule, recent activity, and minimal
readiness information into an explainable weekly plan, then adjust optional
work when circumstances change.

The research catalog covers U5–U17, but the first release cohort has not been
selected. Version one must choose a narrower football cohort and
responsible-adult/account model from research and specialist evidence before a
private beta is defined.

### Core promise

> PureAthletic keeps your training plan realistic, balanced, and responsive to what you actually do.

### Core feedback loop

1. Once selected and approved, the account owner establishes a player profile
   and supplies the minimum approved planning inputs.
2. PureAthletic generates a seven-day training plan.
3. The athlete logs completed activity and daily readiness.
4. PureAthletic evaluates the new information using explicit safety and scheduling rules.
5. The remaining plan is adjusted and the reasons are explained.

## 2. Target user

### Candidate primary user

A team-based youth footballer, with an appropriate responsible adult, who:

- Trains with a team one or more times per week.
- Wants to improve strength, speed, fitness, or general performance.
- Does not have a personal strength and conditioning coach.
- Needs a plan that fits around school, work, team practice, and matches.
- Has limited knowledge of programming training load and recovery.

### Research age coverage and release policy

The current catalog covers team age groups U5–U17 and the prototype simulates
parent or guardian approval during onboarding. The checkbox is not verified
consent, age assurance, or an account-control mechanism. Catalog coverage does
not decide the first beta cohort or make the product ready for minors.

A qualified youth-sport practitioner,
child-safeguarding review, verifiable consent flow, jurisdiction-specific
privacy and legal review, and appropriate minor account and communication
controls remain mandatory release gates.

## 3. User problem

Amateur athletes often combine team sessions, gym workouts, running, and matches without understanding how those activities affect one another. Generic workout plans do not respond when a session is missed, team practice is unusually intense, or recovery is poor.

PureAthletic should answer one practical question every day:

> What is the most appropriate thing for me to do next?

## 4. Product principles

- **Useful before impressive:** Prioritize clear plans and fast logging over novelty.
- **Adapt, do not punish:** A missed session should cause sensible rescheduling, not guilt.
- **Explain recommendations:** Athletes should understand why a session or adjustment exists.
- **Conservative under uncertainty:** Pain, unusual fatigue, or incomplete information should produce a cautious recommendation.
- **Separate guidance from healthcare:** The product supports training decisions but does not diagnose, treat, or rehabilitate injuries.
- **Minimize data entry:** Routine check-ins should take less than one minute.
- **Earn trust before automation:** Deterministic rules govern safety-critical decisions; AI may explain or personalize within those boundaries.

## 5. Version-one scope

### Included

- A production identity and account model appropriate to the selected cohort
  and responsible-adult relationship; the authentication method remains open.
- Athlete onboarding and profile management.
- One primary sport: football.
- Recording fixed commitments such as team practice and matches.
- Selecting one primary training goal.
- Seven-day training plan generation.
- Weekly calendar view.
- Individual workout instructions and exercise alternatives.
- Completion, modification, or skipping of a planned session.
- Manual logging of unplanned activities.
- Daily readiness check-in.
- Rule-based adjustment of future sessions.
- Plain-language explanations for recommendations and adjustments.
- Weekly progress summary.
- Basic notification preferences.
- Account data export and deletion.

### Explicitly excluded

- Medical diagnosis, injury rehabilitation, or return-to-play clearance.
- Detailed nutrition or supplement prescriptions.
- Wearable and health-platform integrations.
- Social feeds, messaging, leaderboards, and public profiles.
- Coach, club, or parent portals.
- Payments and subscriptions.
- Live GPS tracking.
- Precise calorie-burn claims.
- Advanced performance prediction.
- Fully autonomous AI-generated training without validation.
- Deep sport-specific support beyond football.

## 6. Core user journey

### 6.1 Account and onboarding

The approved account owner establishes a player profile and supplies:

- Team age-group band: U5–U8, U9–U12, U13–U15, or U16–U17. The athlete chooses
  the band containing their registered team group; avoid collecting an exact
  team group or date of birth in the training-recommendation payload.
- The responsible-adult relationship and any required approval/consent record,
  actor, version, timestamp, withdrawal state, and legal basis appropriate to
  the chosen jurisdiction. The prototype checkbox does not satisfy this.
- Preferred name.
- Football position.
- Training experience: Beginner or Intermediate in the current product.
  Advanced remains organized as research-only content and cannot be selected or
  recommended.
- Primary goal: general fitness, strength, speed, endurance, or match readiness.
- Typical team-practice and match schedule.
- Available independent-training days and approximate time per day.
- Available equipment and the supervision required by candidate content.
- Only the minimum current-activity and readiness inputs that an approved rule
  demonstrably needs.

Availability, equipment, and qualified-supervision inputs are target-product
requirements but are deferred from the active onboarding prototype. Do not add
them back until their placement, purpose, persistence, and planner integration
meet the rollout gates in the Decision Sheet.

Do not collect medical history or free-text physical limitations by default.
Any health-related field requires a defined decision purpose, structured safe
handling, retention decision, practitioner input, and privacy/legal review.

Before generating a plan, the athlete must acknowledge that PureAthletic provides general training guidance and is not a medical service.

### 6.2 Initial plan

The system creates a seven-day plan containing:

- Fixed team practices and matches.
- Independent strength, speed, conditioning, mobility, recovery, or rest sessions.
- Estimated session duration.
- Intended difficulty.
- A short purpose statement.
- Complete workout instructions where applicable.

The plan must apply versioned, practitioner-approved match buffers, recovery
spacing, and weekly optional-session limits. Until those thresholds are
approved for the selected cohort, missing or uncertain context produces a
conservative fallback rather than extra training.

### 6.3 Daily use

The home screen shows:

- Today's planned activity.
- Its purpose, duration, and expected difficulty.
- The athlete's next fixed commitment.
- A readiness check-in if one has not been completed.
- Any recent plan adjustment and its reason.

The athlete can start the workout, replace it with a shorter version, mark it complete, record modifications, or skip it.

### 6.4 Logging

After activity, the athlete records:

- Actual duration.
- Perceived exertion from 1 to 10.
- Completion status.
- Optional notes.
- Pain status: none, mild, moderate, or severe.

An unplanned team or individual activity can be logged using the same fields.

### 6.5 Adaptation

After a readiness check-in or activity log, the system evaluates the remaining week.

Possible actions include:

- Keep the plan unchanged.
- Reduce session volume or intensity.
- Replace a session with recovery or mobility.
- Offer a shorter version.
- Move a session to another available day.
- Remove a lower-priority session.

Every adjustment must show:

- What changed.
- Why it changed.
- Whether the athlete can undo it.

### 6.6 Weekly review

At the end of each week, the athlete sees:

- Planned versus completed sessions.
- Training consistency.
- Total duration and session load trend.
- Readiness trend.
- Notable personal achievements.
- A concise explanation of what will influence the next week.

## 7. Screens

### Required screens

1. Landing page
2. Account setup and sign-in appropriate to the approved account model
3. Onboarding
4. Today dashboard
5. Weekly calendar
6. Workout detail
7. Activity log
8. Readiness check-in
9. Weekly review
10. Athlete profile and schedule
11. Settings, privacy, export, and account deletion

### Today dashboard priority

The dashboard should make the next action obvious without requiring navigation. Its content order is:

1. Today's recommendation
2. Readiness check-in
3. Explanation
4. Upcoming schedule
5. Recent progress

## 8. Training model

### Session categories

- Team practice
- Match
- Strength
- Speed
- Conditioning
- Mobility
- Recovery
- Rest

### Simple workload calculation

Version one may use session load as:

`duration in minutes × perceived exertion`

This is an internal planning signal, not a medical measurement. Trends matter more than exact numbers, and the interface should avoid presenting it as a precise physiological truth.

### Initial adjustment rules

The first implementation should use explicit rules that can be tested. Examples:

- Any reported pain pauses automated optional training and asks for
  responsible-adult review; exact language and escalation require practitioner
  approval.
- Severe pain recommends stopping training and seeking qualified professional advice.
- Very poor readiness reduces the day's optional session or replaces it with recovery.
- A newly logged high-load session triggers reevaluation over the configured,
  practitioner-reviewed recovery horizon; 24–48 hours is a research candidate,
  not an approved universal threshold.
- A missed high-priority session may move only if an appropriate open day exists.
- A missed low-priority session may be removed rather than creating a crowded week.
- A match takes priority over independent conditioning.
- High-load lower-body training should not be added immediately before a match.
- Consecutive high-load days should be avoided unless they are unavoidable fixed team commitments.
- No automatic adjustment may move a fixed team practice or match.

These rules require review by a qualified sports-performance professional before a public launch.

## 9. Role of AI

AI is an assistant inside a controlled planning system, not the sole decision-maker.

### Appropriate uses

- Explain why a workout was selected.
- Turn validated plan data into encouraging, plain-language guidance.
- Suggest exercise alternatives from an approved exercise library.
- Summarize a completed week.
- Personalize tone and level of detail.
- Rank already-approved candidate routines after deterministic safety filtering.

### Inappropriate uses

- Diagnose injuries or medical conditions.
- Invent exercises outside the approved library.
- Override pain and recovery rules.
- Produce an unvalidated training plan directly for the user.
- Make unsupported claims about injury prevention, calorie burn, or expected performance.
- Browse arbitrary internet content to make a live training decision.

Offline AI experimentation may begin with synthetic profiles only after the
catalog, day-by-day planner, data contract, decision traces, and safety
scenarios are stable and reviewed. User-facing AI should begin only after
server-side authorization,
privacy review, practitioner approval, strict output validation, and a
deterministic fallback are available. All AI outputs shown in the product must
be grounded in structured application data, constrained to an expected format,
and validated before display.

## 10. Data model

### Core entities

| Entity | Purpose |
| --- | --- |
| Account | Authentication, contact, and account status |
| ResponsibleAdultRecord | Relationship/authority and approval or consent evidence where required |
| AthleteProfile | Sport, position, experience, goals, equipment, and preferences |
| Availability | Recurring days and time available for independent training |
| FixedCommitment | Team practice, match, or other immovable activity |
| TrainingPlan | A dated plan for one athlete and one week |
| PlannedSession | Session type, purpose, duration, difficulty, and status |
| WorkoutTemplate | Approved structure and exercises for a planned workout |
| ActivityLog | What the athlete actually completed |
| ReadinessCheckIn | Sleep, energy, soreness, stress, and pain |
| PlanAdjustment | Before/after change, rule invoked, explanation, and timestamp |
| WeeklySummary | Aggregated adherence, load, readiness, and narrative summary |
| ApprovalConsentRecord | Actor, authority, purpose, policy version, status, timestamps, and withdrawal where required |

### Important data rules

- Fixed commitments and planned sessions must be distinct.
- A planned session can reference an activity log, but an activity log may exist without a planned session.
- Adjustments must be auditable and reversible where practical.
- Health-related inputs should be minimized and protected as sensitive data.
- Free-text notes must not be required for the product to function.

## 11. Safety and privacy requirements

- Clearly state that recommendations are general training guidance.
- Never present the product as a replacement for a coach, doctor, or physiotherapist.
- Pause automated optional training and provide immediate conservative guidance
  for any reported pain; add stop-training and qualified-support wording for
  severe pain.
- Do not use pain or health data for advertising.
- Encrypt data in transit and at rest using the chosen platform's supported controls.
- Apply row-level authorization so users can access only their own records.
- Never expose secret API keys to browser code.
- Avoid sending unnecessary personally identifiable or health-related data to AI providers.
- Record which recommendation rules and content versions produced each plan.
- Support account deletion and a portable data export.
- Complete a jurisdiction-specific privacy and safeguarding review before expanding to minors.

## 12. Functional acceptance criteria

Version one is functionally complete when:

- A new eligible user can finish onboarding and receive a seven-day plan.
- Fixed team practices and matches appear correctly in the plan.
- Every recommended session has a purpose, duration, difficulty, and instructions.
- A user can complete, modify, skip, or manually add an activity.
- A readiness check-in can trigger a predictable, testable adjustment.
- Fixed commitments are never moved by automatic adaptation.
- The user can see what changed and why.
- The weekly summary reflects completed activity rather than only the original plan.
- One user's data cannot be accessed by another authenticated user.
- The user can export and delete their account data.

## 13. Success measures

The private beta should evaluate:

- Percentage of users who finish onboarding.
- Percentage who generate their first plan.
- Weekly plan-view rate.
- Percentage of planned sessions logged.
- Median time required to log a session.
- Readiness check-in frequency and distribution; set a target only after
  research establishes when check-ins are useful rather than burdensome.
- Four-week retention.
- Athlete-reported confidence in knowing what to do next.
- Number and severity of unsafe, confusing, or inappropriate recommendations.

The primary product signal is not time spent in the app. It is whether athletes consistently use the plan to make better next-session decisions.

## 14. Delivery milestones

The detailed three-year sequence, exit criteria, research cadence, security
controls, accessibility expectations, and operational gates are maintained in
the [Three-Year Product and Engineering Roadmap](three-year-roadmap.md).

The current milestones are intentionally evidence-led:

### Milestone 1: Discovery and safety foundation

- Confirm the first cohort and narrow problem through research.
- Turn assumptions into ranked research questions and hypotheses.
- Review catalog content, rules, thresholds, supervision, and copy with a
  qualified practitioner.
- Create the data inventory, threat model, privacy assessment, consent model,
  and safeguarding escalation plan.

### Milestone 2: Prototype validation

- Test the current prototype with adults first in small rounds. Include
  children only through a separately approved age-appropriate protocol after
  the cohort, consent/assent, safeguarding, privacy, and specialist gates pass.
- Include accessibility and safety-interpretation testing.
- Run browser smoke checks through the normal verification workflow.
- Fix high-severity findings and document the continue/narrow/stop decision.

### Milestone 3: Production foundation

- Define the production architecture and data contracts.
- Implement authentication, the selected account-owner and consent/approval
  model, authorization, persistence, export, deletion, audit records, backups,
  monitoring, and recovery.
- Establish CI, dependency/security checks, release versioning, and rollback.

### Milestone 4: Deterministic MVP and closed beta

- Finish, independently review, and integrate one canonical adaptive planner;
  development-only extraction by itself does not satisfy this milestone.
- Version rules, catalog content, explanations, and recommendations.
- Re-run practitioner and legal reviews against the release candidate.
- Run a small, supported four-week pilot only after every release gate passes.

### Milestone 5: Reliability and carefully bounded expansion

- Continue user research and accessibility testing throughout delivery.
- Improve reliability, performance, support, data quality, and privacy controls.
- Consider AI only for constrained explanations and summaries with deterministic
  fallback and server-side validation.
- Evaluate every new category or feature as a separate evidence and risk review.

## 15. Open product decisions

These questions should be resolved through interviews and prototype testing:

- Which age band and responsible-adult/account model should define the first
  private-beta cohort?
- Which goal produces the clearest value for the first cohort?
- Should plan generation begin from the current day or always from Monday?
- How much workout detail do users need during a team-season week?
- Do users prefer readiness questions in the morning or immediately before training?
- When should an adjustment happen automatically versus require confirmation?
- How should the app behave when the athlete's team schedule changes frequently?
- Which progress measure feels most motivating without encouraging unsafe overtraining?
- Which onboarding inputs are essential, and which introduce more burden or
  sensitive data than value?

## 16. Technical decision principles

The framework, identity provider, database, hosting platform, and AI provider
are architecture decisions—not product requirements. Select them only after the
first cohort, account owner, jurisdiction, research-supported flow, data contract, threat
model, and operating capacity are known.

The production architecture must keep safety rules and secrets server-side,
enforce record ownership on every operation, support versioned migrations and
rollback, provide export/deletion/audit behavior, and be small enough for the
project to operate reliably. Record the choice and rejected alternatives in an
architecture decision before implementation.
