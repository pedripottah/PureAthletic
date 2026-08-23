# PureAthletic V1 User Flow

**Status:** Target-product flow; not a current implementation map
**Last reviewed:** 24 August 2026
**Source:** [V1 Decision Sheet](decision-sheet.md)
**Scope:** Junior footballers in team age groups U5–U17, supported by a parent
or guardian, using the responsive web application

The first beta cohort, account owner, and consent model remain open. The active
prototype omits authentication and several target onboarding inputs. Use the
[Prototype Review](project-review.md) for current behavior and the
[Decision Sheet](decision-sheet.md) for decision status.

## 1. Flow objective

The core journey should help the athlete answer one question with as little friction as possible:

> What is the most appropriate thing for me to do next?

The complete V1 loop is:

`Onboard → generate plan → check readiness → train or rest → log activity → adjust plan → review progress`

## 2. Primary navigation

```mermaid
flowchart LR
    Today["Today<br/>Next recommendation"]
    Week["Week<br/>Seven-day plan"]
    Progress["Progress<br/>Weekly review"]
    Profile["Profile<br/>Athlete and settings"]

    Today <--> Week
    Today <--> Progress
    Today <--> Profile
    Week <--> Progress
    Week <--> Profile
```

The application opens on **Today** after sign-in. Today owns the primary action; the other destinations provide context and account controls.

## 3. End-to-end journey

```mermaid
flowchart TD
    A[Visit landing page] --> B[Create account or sign in]
    B --> C{Onboarding complete?}
    C -->|No| D[Complete onboarding]
    C -->|Yes| F[Open Today]
    D --> E[Generate seven-day plan]
    E --> F

    F --> G{Readiness check-in due?}
    G -->|Yes| H[Complete check-in]
    H --> I[Apply safety and readiness rules]
    I --> J[Show recommendation and explanation]
    G -->|No| J

    J --> K{What does the athlete do?}
    K -->|Start planned session| L[View workout]
    K -->|Log another activity| M[Create activity log]
    K -->|View schedule| N[Open Week]
    K -->|Rest or return later| F

    L --> O[Complete, modify, or skip]
    O --> M
    M --> P[Reevaluate remaining plan]
    P --> Q{Material change proposed?}
    Q -->|No| F
    Q -->|Yes| R[Review what changed and why]
    R --> S[Confirm or dismiss where allowed]
    S --> F

    N --> L
    F --> T[Open Progress]
    T --> U[Review completed week]
    U --> F
```

## 4. Account and onboarding

```mermaid
flowchart TD
    A[Landing page] --> B{Identity action}
    B -->|Begin setup| C[Use approved account-owner flow]
    B -->|Sign in| D[Authenticate]
    C --> E[Apply approved age and eligibility flow]
    E --> F[Record responsible-adult involvement where required]
    F --> G[Accept training-guidance disclaimer]

    G --> I[Name, age band, position, and experience]
    I --> J[Choose one primary goal]
    J --> K[Add team practices and matches]
    K --> L[Add training availability]
    L --> M[Select equipment and supervision context]
    M --> N[Collect only approved readiness context]
    N --> O[Review answers]
    O --> P{Ready to generate?}
    P -->|Edit| I
    P -->|Generate plan| Q[Run deterministic planner]
    Q --> R{Valid plan produced?}
    R -->|Yes| S[Show plan-created confirmation]
    S --> T[Open Today]
    R -->|No| U[Explain the scheduling conflict]
    U --> V[Edit schedule or availability]
    V --> O

    D --> W{Onboarding complete?}
    W -->|No| I
    W -->|Yes| T
```

### Onboarding requirements

- The account-owner, age/eligibility, and consent flow is selected only after
  jurisdiction-specific privacy, legal, and safeguarding review.
- Progress is saved after each step.
- Back navigation preserves entered information.
- Structured inputs are sufficient; free-text notes remain optional.
- The athlete reviews all information before plan generation.
- A scheduling conflict is explained in plain language and never produces an unsafe fallback plan.

Availability, equipment, and qualified-supervision inputs describe the target
planner. They are deferred from current onboarding Step 4 until the rollout
gates in the Decision Sheet are met.

## 5. Today, readiness, and pain safety

```mermaid
flowchart TD
    A[Open Today] --> B{Check-in already submitted today?}
    B -->|Yes| C[Show current recommendation]
    B -->|No| D[Prompt for readiness check-in]
    D --> E[Sleep, energy, soreness, stress, and pain]
    E --> F{Pain level}

    F -->|Severe| G[Show stop-training guidance]
    G --> H[Do not recommend a workout]
    H --> I[Record safety adjustment and explanation]

    F -->|Mild or moderate| J[Pause automated optional training]
    J --> K[Ask for responsible-adult review]
    K --> I

    F -->|None| L{Readiness very poor?}
    L -->|Yes| M[Reduce or replace today's optional session]
    M --> I
    L -->|No| N[Keep current recommendation]
    N --> C

    I --> O[Show what changed and why]
    O --> P[Return to Today]
```

### Safety behavior

- Safety actions occur immediately and cannot be bypassed with a simple undo.
- A later check-in may produce a new recommendation, but it does not erase the earlier safety record.
- Fixed team commitments remain visible; the product does not diagnose, provide return-to-play clearance, or move those commitments.
- Every pain response pauses automated optional training for responsible-adult
  review; severe pain additionally directs the athlete toward qualified support
  without claiming a diagnosis.

Exact thresholds and athlete-facing wording require practitioner review before the private beta.

## 6. Planned workout and activity logging

```mermaid
flowchart TD
    A{Activity source} -->|Today's recommendation| B[Open workout detail]
    A -->|Week calendar| B
    A -->|Unplanned activity| C[Choose activity type]

    B --> D[Review purpose, duration, difficulty, and instructions]
    D --> E{Athlete action}
    E -->|Complete| F[Log completion]
    E -->|Modify| G[Log modifications]
    E -->|Skip| H[Choose optional skip reason]
    E -->|Use shorter version| I[Open approved shorter workout]
    I --> F

    C --> J[Enter activity details]
    F --> K[Enter duration, effort, pain, and optional notes]
    G --> K
    H --> K
    J --> K
    K --> L[Save activity log]
    L --> M[Calculate session load when applicable]
    M --> N[Reevaluate the reviewed recovery horizon and remaining plan]
    N --> O{Adjustment needed?}
    O -->|No| P[Show saved confirmation]
    O -->|Safety action| Q[Apply safe change immediately]
    O -->|Schedule change| R[Preview proposed changes]
    R --> S{Athlete decision}
    S -->|Confirm| T[Apply and record adjustment]
    S -->|Dismiss| U[Keep current plan]
    Q --> V[Explain what changed and why]
    T --> V
    P --> W[Return to Today]
    U --> W
    V --> W
```

### Activity-log rules

- Completion status, actual duration, perceived exertion, and pain are structured fields.
- Notes and skip reasons are optional.
- An activity log may exist without a planned session.
- A planned session keeps its original identity after it is modified or skipped.
- Saving must be retry-safe so a failed connection does not create duplicate logs.

## 7. Plan adjustment and undo

```mermaid
flowchart TD
    A[Rule proposes a change] --> B{Safety-critical?}
    B -->|Yes| C[Apply immediately]
    C --> D[Record rule, before state, and after state]
    D --> E[Explain that direct undo is unavailable]

    B -->|No| F[Preview affected sessions]
    F --> G{Confirm change?}
    G -->|No| H[Keep current plan]
    G -->|Yes| I[Apply change]
    I --> J[Record rule, before state, and after state]
    J --> K[Show adjustment history]
    K --> L{Undo selected?}
    L -->|No| M[Continue with updated plan]
    L -->|Yes| N{Original state still safe and available?}
    N -->|Yes| O[Restore previous plan state]
    N -->|No| P[Explain why restoration is unavailable]
```

Every adjustment view must answer:

1. What changed?
2. Why did it change?
3. Does the athlete need to confirm it?
4. Can it be undone?

## 8. Weekly calendar and schedule changes

```mermaid
flowchart TD
    A[Open Week] --> B[View seven-day plan]
    B --> C{Selected action}
    C -->|Open session| D[View workout or commitment]
    C -->|Edit team schedule| E[Open schedule settings]
    C -->|Return to today| F[Open Today]

    E --> G[Add, edit, or remove a fixed commitment]
    G --> H[Recalculate affected optional sessions]
    H --> I{Optional sessions affected?}
    I -->|No| J[Save schedule]
    I -->|Yes| K[Preview the new commitment and plan changes]
    K --> L{Confirm all changes?}
    L -->|Yes| M[Save schedule and adjusted plan]
    L -->|No| N[Return to schedule editor]
    J --> B
    M --> O[Show explanation and undo where safe]
    O --> B
```

Fixed commitments are visually distinct from optional sessions and are never moved by automatic adaptation.

## 9. Progress and weekly review

```mermaid
flowchart TD
    A[Open Progress] --> B{Enough history for a review?}
    B -->|No| C[Show current-week activity and helpful empty state]
    B -->|Yes| D[Show latest weekly summary]
    D --> E[Planned versus completed]
    D --> F[Training duration and load trend]
    D --> G[Readiness trend]
    D --> H[Notable achievements]
    D --> I[What will influence the next seven days]
    E --> J[Return to Today or Week]
    F --> J
    G --> J
    H --> J
    I --> J
```

The first usable review appears after seven days of activity history. Progress emphasizes appropriate consistency, not maximum workload or daily training streaks.

## 10. Account and data controls

```mermaid
flowchart TD
    A[Open Profile] --> B{Selected area}
    B -->|Athlete profile| C[Edit profile and goal]
    B -->|Schedule| D[Edit fixed commitments and availability]
    B -->|Equipment| E[Edit available equipment]
    B -->|Notifications| F[Edit preferences]
    B -->|Export data| G[Confirm export request]
    B -->|Delete account| H[Show consequences and require confirmation]

    C --> I{Planning input changed?}
    D --> I
    E --> I
    I -->|Yes| J[Preview resulting plan changes]
    J --> K[Confirm and save]
    I -->|No| L[Save profile]

    G --> M[Prepare portable export]
    H --> N[Reauthenticate]
    N --> O[Confirm permanent deletion]
```

Account deletion must be deliberately confirmed and must not be presented as an ordinary one-click action.

Availability and equipment editing remain target-product flows and are not
currently active planning controls in the prototype.

## 11. Core screen inventory

| Screen | Primary job | Main exit |
| --- | --- | --- |
| Landing | Explain the product and start account creation | Sign up or sign in |
| Authentication | Create or access an account | Onboarding or Today |
| Onboarding | Collect the minimum valid planning inputs | Plan confirmation |
| Plan confirmation | Explain the generated seven-day plan | Today |
| Today | Make the next appropriate action obvious | Workout, check-in, Week, or activity log |
| Readiness check-in | Capture today's recovery and pain inputs | Updated Today recommendation |
| Week | Show the plan and fixed commitments in context | Session detail or schedule |
| Workout detail | Make an independent session executable | Activity log |
| Activity log | Record planned or unplanned activity | Adjustment result or Today |
| Adjustment review | Explain and confirm a plan change | Updated Today or Week |
| Progress | Summarize the completed week and useful trends | Today or Week |
| Profile and settings | Maintain planning inputs and account controls | Updated plan or Profile |

## 12. Wireframe acceptance checklist

The low-fidelity wireframes are ready for review when:

- A new eligible athlete can reach their first plan without an unexplained branch.
- The Today screen has one unmistakable primary recommendation.
- Readiness and activity logging can each be completed in under one minute.
- No pain path leads directly to an automated optional workout recommendation.
- Planned, fixed, completed, modified, skipped, recovery, and rest states are distinguishable without relying on color alone.
- Any proposed plan change explains what changed and why.
- Confirmation and undo behavior match the safety boundary.
- A user can reach schedule editing, data export, and account deletion from Profile.
- Mobile back navigation never loses completed onboarding or logging data.

## 13. Questions to test with low-fidelity wireframes

- Does a rolling today-plus-six-days view feel clearer than a Monday-to-Sunday week?
- Should readiness appear directly on Today or as a focused full-screen step?
- Can athletes distinguish a team commitment from a PureAthletic recommendation immediately?
- Is the difference between modifying a workout and logging an unplanned activity clear?
- Do adjustment explanations provide enough confidence without adding too much text?
- Is “planned sessions completed or appropriately modified” a motivating progress measure?
