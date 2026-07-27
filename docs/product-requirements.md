# PureAthletic Version One Product Requirements

## 1. Product summary

PureAthletic is an adaptive training planner for junior and amateur athletes. It turns an athlete's goals, schedule, training history, and recovery feedback into a practical weekly plan, then adjusts that plan as circumstances change.

Version one will focus on amateur football players who also train independently. This gives the product a clear initial audience while leaving the underlying model flexible enough to support other sports later.

### Core promise

> PureAthletic keeps your training plan realistic, balanced, and responsive to what you actually do.

### Core feedback loop

1. The athlete creates a profile and describes their goal and availability.
2. PureAthletic generates a seven-day training plan.
3. The athlete logs completed activity and daily readiness.
4. PureAthletic evaluates the new information using explicit safety and scheduling rules.
5. The remaining plan is adjusted and the reasons are explained.

## 2. Target user

### Primary user

An amateur football player who:

- Trains with a team one or more times per week.
- Wants to improve strength, speed, fitness, or general performance.
- Does not have a personal strength and conditioning coach.
- Needs a plan that fits around school, work, team practice, and matches.
- Has limited knowledge of programming training load and recovery.

### Initial age policy

The initial private beta should be restricted to users aged 18 or older. Supporting minors requires additional work involving consent, privacy, safeguarding, age-appropriate recommendations, and jurisdiction-specific requirements. Junior athletes remain part of the long-term vision, but are not included in the first release.

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

- Email-based account creation and authentication.
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

The athlete creates an account and supplies:

- Date of birth or confirmation that they are at least 18.
- Preferred name.
- Football position.
- Training experience: beginner, intermediate, or advanced.
- Primary goal: general fitness, strength, speed, endurance, or match readiness.
- Typical team-practice and match schedule.
- Available independent-training days and approximate time per day.
- Available equipment.
- Current training frequency.
- Known physical limitations or current pain.

Before generating a plan, the athlete must acknowledge that PureAthletic provides general training guidance and is not a medical service.

### 6.2 Initial plan

The system creates a seven-day plan containing:

- Fixed team practices and matches.
- Independent strength, speed, conditioning, mobility, recovery, or rest sessions.
- Estimated session duration.
- Intended difficulty.
- A short purpose statement.
- Complete workout instructions where applicable.

The plan must avoid placing a high-load lower-body workout immediately before a match. It must also preserve at least one low-load or rest day in a normal week.

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
2. Sign up and sign in
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

- Moderate or severe pain prevents automatic recommendation of intense training and displays appropriate safety guidance.
- Severe pain recommends stopping training and seeking qualified professional advice.
- Very poor readiness reduces the day's optional session or replaces it with recovery.
- A newly logged high-load session triggers reevaluation of the following 24–48 hours.
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

### Inappropriate uses

- Diagnose injuries or medical conditions.
- Invent exercises outside the approved library.
- Override pain and recovery rules.
- Produce an unvalidated training plan directly for the user.
- Make unsupported claims about injury prevention, calorie burn, or expected performance.

All AI outputs shown in the product should be grounded in structured application data, constrained to an expected format, and validated before display.

## 10. Data model

### Core entities

| Entity | Purpose |
| --- | --- |
| User | Authentication, contact, and account status |
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
| ConsentRecord | Terms, privacy, age confirmation, and policy versions accepted |

### Important data rules

- Fixed commitments and planned sessions must be distinct.
- A planned session can reference an activity log, but an activity log may exist without a planned session.
- Adjustments must be auditable and reversible where practical.
- Health-related inputs should be minimized and protected as sensitive data.
- Free-text notes must not be required for the product to function.

## 11. Safety and privacy requirements

- Clearly state that recommendations are general training guidance.
- Never present the product as a replacement for a coach, doctor, or physiotherapist.
- Provide immediate conservative guidance when users report moderate or severe pain.
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
- Percentage of users completing at least three readiness check-ins per week.
- Four-week retention.
- Athlete-reported confidence in knowing what to do next.
- Number and severity of unsafe, confusing, or inappropriate recommendations.

The primary product signal is not time spent in the app. It is whether athletes consistently use the plan to make better next-session decisions.

## 14. Delivery milestones

### Milestone 1: Product foundation

- Confirm the target user through five athlete interviews.
- Review the training rules with a qualified practitioner.
- Create low-fidelity screen flows.
- Finalize the data model and privacy classification.

### Milestone 2: Non-adaptive prototype

- Implement authentication and onboarding.
- Generate a plan from approved templates.
- Build the dashboard, calendar, workout detail, and logging flows.
- Test the complete journey with seeded data.

### Milestone 3: Adaptation

- Implement readiness check-ins.
- Add the explicit adjustment-rule engine.
- Add adjustment history, explanations, and undo behavior.
- Build automated tests for every safety and scheduling rule.

### Milestone 4: Controlled AI

- Add structured AI-generated explanations and weekly summaries.
- Validate all model output before storage or display.
- Add fallback copy for unavailable or invalid AI output.
- Test prompt-injection and unsafe-output scenarios.

### Milestone 5: Private beta

- Recruit 5–10 adult amateur football players.
- Run a four-week pilot.
- Review usage, interviews, recommendation quality, and safety incidents.
- Decide which assumptions to change before expanding the feature set.

## 15. Open product decisions

These questions should be resolved through interviews and prototype testing:

- Which goal produces the clearest value for the first cohort?
- Should plan generation begin from the current day or always from Monday?
- How much workout detail do users need during a team-season week?
- Do users prefer readiness questions in the morning or immediately before training?
- When should an adjustment happen automatically versus require confirmation?
- How should the app behave when the athlete's team schedule changes frequently?
- Which progress measure feels most motivating without encouraging unsafe overtraining?

## 16. Recommended technical direction

The following stack is suitable for a small web-first MVP, but it is not a product requirement:

- Next.js and TypeScript for the application.
- Tailwind CSS for the interface.
- PostgreSQL with Supabase for authentication, storage, and row-level security.
- OpenAI Responses API for constrained explanations and summaries.
- Vercel for deployment.

Technical implementation should begin only after the onboarding, weekly planning, logging, and adjustment flows have been sketched and reviewed.
