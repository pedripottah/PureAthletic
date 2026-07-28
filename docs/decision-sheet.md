# PureAthletic V1 Decision Sheet

**Status:** Working baseline for product design  
**Last updated:** 28 July 2026  
**Purpose:** Turn the product requirements into a small set of explicit decisions for the user flow, wireframes, and first implementation.

## 1. Product focus

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Primary audience | Adults aged 18 or older who play amateur football, attend at least one team activity per week, and also train independently | Locked | This is specific enough to guide the product and avoids the safeguarding requirements associated with minors. |
| Primary user problem | Help the athlete decide what training is appropriate to do next around practices, matches, availability, and recovery | Locked | This is the clearest expression of the product's day-to-day value. |
| Core product promise | Keep the athlete's next seven days realistic, balanced, and responsive to what they actually do | Locked | It keeps the experience focused on practical planning rather than broad performance analysis. |
| Private-beta focus | Recruit athletes primarily interested in match readiness | Proposed; validate in interviews | Match readiness connects the plan directly to football commitments and makes the adaptive value easy to evaluate. |
| Supported goals | General fitness, strength, speed, endurance, and match readiness; the athlete chooses one primary goal | Locked | These are already part of the required onboarding scope and keep personalization understandable. |
| Platform | Responsive, mobile-first web application | Locked | Most daily check-ins and activity logs will happen on a phone, while a web application keeps V1 delivery manageable. |

## 2. Initial plan and weekly structure

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| First plan start | Start on the day onboarding is completed and cover seven consecutive days | Proposed; test in prototype | The athlete receives value immediately instead of waiting for Monday. |
| Ongoing planning horizon | Always show today plus the following six days | Proposed; test in prototype | A rolling view supports the question “What should I do next?” and handles changing schedules more naturally. |
| Fixed commitments | Team practices and matches are entered by the athlete and are never moved automatically | Locked | These commitments are controlled by the team, not by PureAthletic. |
| Minimum recovery | Preserve at least one rest or low-load day within every seven-day plan whenever fixed commitments allow it | Locked | This is a core safety and workload constraint. |
| Match protection | Do not schedule high-load lower-body training immediately before a match | Locked, pending practitioner review | This rule is explicit in the product requirements but requires professional validation before beta use. |
| Plan generation | Select sessions from approved templates using deterministic scheduling rules | Locked | V1 plans must be predictable, testable, and auditable. |

## 3. Onboarding

Onboarding will be a short, resumable sequence:

1. Confirm age eligibility and accept the training-guidance disclaimer.
2. Enter preferred name, football position, and training experience.
3. Choose one primary goal.
4. Add recurring team practices and upcoming matches.
5. Add independent-training availability and time per day.
6. Select available equipment.
7. Report current training frequency, physical limitations, and current pain.
8. Review the information and generate the first plan.

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Eligibility | Users must confirm they are at least 18 before proceeding | Locked | Minors are excluded from the private beta. |
| Required fields | Require only information needed to generate a safe and useful plan | Locked | This supports the principle of minimizing data entry. |
| Free text | Optional only; structured choices must be enough to generate a plan | Locked | Free text is harder to validate and may contain unnecessary sensitive information. |
| Completion target | A typical athlete should finish onboarding in five minutes or less | Proposed; validate in usability tests | A short setup reduces abandonment while still gathering necessary planning inputs. |

## 4. Daily experience and navigation

The primary navigation will contain four destinations:

- **Today:** recommendation, readiness, explanation, next commitment, and recent changes.
- **Week:** seven-day plan and fixed commitments.
- **Progress:** weekly review and simple trends.
- **Profile:** athlete details, schedule, equipment, notifications, privacy, export, and deletion.

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Default screen | Today dashboard | Locked | The next recommended action should be visible immediately. |
| Main call to action | Start or review today's recommended activity | Locked | Each screen should make the athlete's next action obvious. |
| Readiness timing | Prompt once per day on the Today screen, before the first optional training session | Proposed; validate in interviews | This gathers useful information close to the training decision without requiring a separate routine. |
| Check-in length | Five structured inputs completed in under one minute: sleep, energy, soreness, stress, and pain | Locked | These inputs match the planning model and the low-friction principle. |
| Workout detail | Show purpose, duration, difficulty, warm-up, exercises with sets/reps or time, rest guidance, and approved alternatives | Locked | The athlete should not need another source to complete an independent session. |
| Session outcomes | Complete, complete with modifications, skip, or log an unplanned activity | Locked | These outcomes cover the required activity-recording behavior. |

## 5. Plan adjustments

| Situation | V1 response | Confirmation | Undo |
| --- | --- | --- | --- |
| Readiness is acceptable | Keep the plan unchanged | No | Not applicable |
| Readiness is very poor | Reduce today's optional session or replace it with recovery | No; explain immediately | Yes, unless blocked by a pain rule |
| Moderate pain is reported | Do not recommend intense training; show conservative guidance and replace optional intense work | No; safety action is immediate | No direct override; the athlete may submit a later check-in |
| Severe pain is reported | Recommend stopping training and seeking advice from a qualified professional; do not prescribe a workout | No; safety action is immediate | No direct override |
| Unplanned high-load activity is logged | Reevaluate optional sessions during the following 24–48 hours | Preview material schedule changes | Yes |
| High-priority session is missed | Offer to move it only when an appropriate open day exists | Yes | Yes |
| Low-priority session is missed | Offer to remove it instead of crowding the week | Yes | Yes |
| Fixed team commitment changes | Keep the new commitment fixed and recalculate affected optional sessions | Yes for moved or removed optional sessions | Yes |

Additional rules:

- A fixed team practice or match is never moved automatically.
- Safety rules take priority over goals, adherence, and user preference.
- Moving or removing a future session requires confirmation unless an immediate safety restriction applies.
- Every adjustment states what changed, why it changed, and whether it can be undone.
- Every applied adjustment is recorded with the rule and content version that produced it.

The complete adjustment matrix must be reviewed by a qualified sports-performance practitioner before the private beta.

## 6. Progress and motivation

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Primary progress measure | Planned sessions completed or appropriately modified during the week | Proposed; validate in interviews | It rewards useful engagement without encouraging athletes to maximize training load. |
| Supporting measures | Total training duration, session-load trend, readiness trend, and notable achievements | Locked | These provide context without claiming precise physiological measurement. |
| Session load | Duration in minutes multiplied by perceived exertion | Locked | It is simple and already defined in the product requirements. |
| Presentation | Show trends and plain-language context, not prescriptive scores or competitive rankings | Locked | The product should avoid false precision and unsafe competition. |
| Streaks | Do not use daily training streaks in V1 | Locked | Streaks may encourage training when rest is the appropriate recommendation. |

## 7. AI boundary

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Plan creation | Deterministic rules and approved templates only | Locked | AI must not be the sole training decision-maker. |
| Initial prototype | Use deterministic, prewritten explanations | Locked | The complete journey can be tested without adding model variability or cost. |
| Later V1 AI | AI may rewrite validated explanations and weekly summaries using structured application data | Locked | This provides useful personalization without allowing AI to alter safety decisions. |
| Failure behavior | Display approved fallback copy whenever AI output is unavailable or invalid | Locked | Core guidance must never depend on model availability. |
| Sensitive data | Send only the minimum structured context required for the output | Locked | Pain and health-related data require additional care. |

## 8. Privacy and account controls

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Authentication | Email-based account creation and sign-in | Locked | This is part of the required V1 scope. The exact email method is a technical decision. |
| Authorization | Every athlete can access only their own records | Locked | This is a functional acceptance criterion. |
| Sensitive inputs | Treat pain, physical limitations, readiness, and activity notes as sensitive data | Locked, pending legal review | These fields can reveal health-related information. |
| Data collection | Do not collect information that is not used by a V1 feature | Locked | Data minimization reduces privacy risk and interface complexity. |
| Account controls | Provide data export and permanent account deletion | Locked | Both are required for V1. |
| Advertising | Do not use health- or pain-related information for advertising | Locked | This is an explicit privacy boundary. |

Jurisdiction-specific privacy review is required before recruiting beta participants.

## 9. Interface direction

| Decision | V1 choice | Status | Reason |
| --- | --- | --- | --- |
| Visual character | Calm, athletic, credible, and encouraging | Proposed; test in visual exploration | The interface should feel performance-oriented without creating pressure or resembling a clinical system. |
| Information density | One primary action per screen with optional detail revealed progressively | Locked | The core decision should remain easy to understand on a phone. |
| Status language | Use direct labels such as Planned, Completed, Modified, Skipped, Recovery, and Rest | Locked | Explicit language is more accessible than icon- or color-only communication. |
| Accessibility | Meet WCAG 2.2 AA for the core journey | Locked | Accessibility should be built into components and content from the beginning. |

## 10. V1 boundaries

V1 includes the complete planning loop:

`Onboard → generate plan → check readiness → train or rest → log activity → adjust plan → review week`

V1 does not include:

- Wearable or health-platform integrations
- Native mobile applications
- Social features, leaderboards, messaging, or public profiles
- Coach, team, or parent portals
- Payments or subscriptions
- Live GPS tracking
- Nutrition or supplement prescriptions
- Injury diagnosis, rehabilitation, or return-to-play clearance
- AI-generated exercises outside the approved library

## 11. Required validation before implementation or beta

### Before high-fidelity interface design

- Test the rolling seven-day planning concept with low-fidelity screens.
- Confirm that the proposed navigation matches how athletes look for information.
- Check whether athletes prefer the readiness prompt on opening the app or immediately before training.
- Confirm that match readiness is the clearest private-beta focus.

### Before building the rule engine

- Finalize the planning-rules matrix with concrete thresholds and examples.
- Review all training, pain, recovery, and workload rules with a qualified practitioner.
- Define the approved workout and exercise library.

### Before private beta

- Complete a jurisdiction-specific privacy review.
- Test account isolation, export, and deletion.
- Verify every safety and scheduling rule with automated tests.
- Review all athlete-facing safety and disclaimer language.

## 12. Next validation

The detailed [user flow](user-flow.md) and [low-fidelity wireframes](low-fidelity-wireframes.md) now cover:

- First-time onboarding and plan generation
- Normal daily use
- Poor-readiness and pain branches
- Completed, modified, skipped, and unplanned activities
- Plan-change confirmation and undo
- Weekly review
- Schedule editing and plan recalculation

The next step is to turn the six routes defined in the low-fidelity wireframes into a clickable grayscale prototype and test them with representative adult amateur football players before visual design begins.
