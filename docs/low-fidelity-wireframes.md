# PureAthletic V1 Low-Fidelity Wireframes

**Status:** Target-product design concepts; partially represented in prototype
**Last reviewed:** 24 August 2026
**Source:** [V1 User Flow](user-flow.md) and [V1 Decision Sheet](decision-sheet.md)
**Primary viewport:** Mobile, 390 × 844 px
**Scope:** Junior footballers in team age groups U5–U17, supported by a parent
or guardian, using the responsive web application

These wireframes intentionally extend beyond the current five-step onboarding
and local-only app. Authentication, verified consent, availability, equipment,
supervision, and production account controls are concepts, not implemented or
approved behavior. Validate decision status in the
[Decision Sheet](decision-sheet.md) before building from a wireframe.

## 1. Prototype objective

These wireframes test whether an athlete can answer one question quickly:

> What is the most appropriate thing for me to do next?

The prototype should validate the complete V1 loop:

`Onboard → generate plan → check readiness → train or rest → log activity → adjust plan → review progress`

The wireframes deliberately avoid final colors, typography, illustration, and brand styling. Labels, content order, interaction states, and safety behavior are the parts under review.

## 2. Shared interaction model

### Mobile application shell

```text
┌─────────────────────────────────────┐
│  PureAthletic                 [●]   │  App header
├─────────────────────────────────────┤
│                                     │
│  Screen content                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│  Today     Week    Progress  Profile│  Persistent navigation
└─────────────────────────────────────┘
```

- The signed-in application opens on **Today**.
- The current destination uses a text label and a visible selected state; color is not the only cue.
- Focused tasks such as onboarding, check-in, and logging replace the bottom navigation with **Back** and a clear close or cancel action.
- Destructive account actions are separated from everyday profile controls.
- A fixed action area may remain at the bottom of long forms, provided it does not hide content or keyboard focus.

### Shared status language

Use visible text labels with any supporting icon:

| State | Required label | Meaning |
| --- | --- | --- |
| Fixed | Team practice or Match | Athlete-entered commitment that is not moved automatically |
| Planned | Planned | Optional PureAthletic recommendation |
| Completed | Completed | Finished as prescribed |
| Modified | Modified | Finished with recorded changes |
| Skipped | Skipped | Not completed |
| Recovery | Recovery | Conservative low-load recommendation |
| Rest | Rest | No workout recommendation |

### Feedback behavior

- Save actions show an in-place loading state and prevent accidental duplicate submissions.
- Successful saves identify what was saved and where the athlete will go next.
- Validation appears beside the relevant field and is summarized at the top when several fields fail.
- Network failures preserve entered information and offer **Try again**.
- Safety messages remain visible until acknowledged and are recorded in adjustment history.

## 3. Entry and authentication

### WF-01 — Landing

**Primary job:** Explain the value and start account creation.

```text
┌─────────────────────────────────────┐
│  PureAthletic              Sign in  │
├─────────────────────────────────────┤
│                                     │
│  Train for what comes next.         │
│                                     │
│  A weekly football training plan    │
│  that adapts to your schedule,      │
│  activity, and readiness.           │
│                                     │
│  [ Create my plan ]                 │  Primary
│                                     │
│  ✓ Fits around practices & matches  │
│  ✓ Adjusts when your week changes   │
│  ✓ Explains every recommendation    │
│                                     │
│  U5–U17 research concept.           │
│  Not approved training guidance.    │
└─────────────────────────────────────┘
```

**Actions**

- **Create my plan** → account creation
- **Sign in** → authentication
- Footer links → privacy, terms, and training-guidance disclaimer

### WF-02 — Create account / sign in

**Illustrative only.** Email/password authentication is not a product decision.
Replace this screen after the account owner, jurisdiction, age/consent model,
recovery process, and authentication threat model are approved.

```text
┌─────────────────────────────────────┐
│  ← Back        Create account       │
├─────────────────────────────────────┤
│                                     │
│  Email                              │
│  [_______________________________]  │
│                                     │
│  Password                           │
│  [___________________________] [👁] │
│  At least 8 characters              │
│                                     │
│  [ Create account ]                 │
│                                     │
│  Already have an account? Sign in   │
│                                     │
│  By continuing, you agree to the    │
│  Terms and acknowledge the Privacy  │
│  Notice.                            │
└─────────────────────────────────────┘
```

Authentication success routes to the next incomplete onboarding step, or to **Today** when onboarding is complete.

## 4. Onboarding

Onboarding progress is saved after every step. Back navigation preserves all entries.

### Shared onboarding frame

```text
┌─────────────────────────────────────┐
│  ← Back              Save and exit  │
├─────────────────────────────────────┤
│  Step 3 of 8                        │
│  [███████████-------------------]   │
│                                     │
│  Step title                         │
│  One-line reason for this question. │
│                                     │
│  Structured inputs                  │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

### WF-03 — Eligibility and guidance boundary

```text
┌─────────────────────────────────────┐
│  ← Back              Save and exit  │
├─────────────────────────────────────┤
│  Step 1 of 8                        │
│  [████--------------------------]   │
│                                     │
│  Before we build your plan          │
│                                     │
│  [ ] Parent/guardian approves this. │
│                                     │
│  PureAthletic provides general      │
│  training guidance. It does not     │
│  diagnose injury, provide treatment,│
│  or replace a qualified professional│
│                                     │
│  [ ] I understand and accept this.  │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

The checkbox represents only the research prototype’s acknowledgement. A
production account must not treat a checkbox as verified consent or proof of a
guardian relationship. The final eligibility and responsible-adult flow is
open and blocked on jurisdiction-specific practitioner, safeguarding, consent,
privacy, legal, and account-control reviews.

### WF-04 — Athlete basics

```text
┌─────────────────────────────────────┐
│  ← Back              Save and exit  │
├─────────────────────────────────────┤
│  Step 2 of 8                        │
│  Tell us about your football        │
│                                     │
│  Preferred name                     │
│  [_______________________________]  │
│                                     │
│  Team age-group range               │
│  [ U13–U15                     ▾ ]  │
│                                     │
│  Position                           │
│  [ Goalkeeper                  ▾ ]  │
│                                     │
│  Training experience               │
│  ( ) Beginner                      │
│  ( ) Intermediate                  │
│  ( ) Advanced — Not available      │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

### WF-05 — Primary goal

Use one-select cards. Each option includes a short, plain-language definition.

```text
┌─────────────────────────────────────┐
│  Step 3 of 8                        │
│  What matters most right now?       │
│  Choose one primary goal.           │
│                                     │
│  ( ) Match readiness               │
│      Feel prepared around fixtures  │
│  ( ) Strength                      │
│      Build movement-control basics  │
│  ( ) Speed                         │
│      Practise reaction and control  │
│  ( ) Endurance                     │
│      Build repeatable ball movement │
│  ( ) General fitness               │
│      Build a balanced base          │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

### WF-06 — Team schedule

```text
┌─────────────────────────────────────┐
│  Step 4 of 8                        │
│  Add team commitments               │
│  These stay fixed in your plan.     │
│                                     │
│  TEAM PRACTICE                      │
│  Tue · 19:00 · 90 min        Edit   │
│  Repeats weekly                     │
│                                     │
│  MATCH                              │
│  Sat · 15:00 · 90 min        Edit   │
│  One time · 2 Aug                   │
│                                     │
│  [ + Add practice or match ]        │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

The add form requires type, date or recurring weekday, start time, and estimated duration. Deleting an entry requires confirmation but is recoverable before the step is saved.

### WF-07 — Independent training availability

**Deferred from the active prototype.** Retain this concept for the target
planner, but do not merge it into current Step 4. Test whether a separate,
progressively disclosed step is understandable and worth its data burden.

```text
┌─────────────────────────────────────┐
│  Step 5 of 8                        │
│  When can you train independently?  │
│                                     │
│  Mon  [ Available ]  [ 45 min ▾ ]  │
│  Tue  [ Unavailable ]               │
│  Wed  [ Available ]  [ 60 min ▾ ]  │
│  Thu  [ Unavailable ]               │
│  Fri  [ Available ]  [ 30 min ▾ ]  │
│  Sat  [ Unavailable ]               │
│  Sun  [ Available ]  [ 45 min ▾ ]  │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

### WF-08 — Equipment

**Deferred from the active prototype.** The final choices must map exactly to
reviewed catalog requirements and distinguish equipment from supervision.

```text
┌─────────────────────────────────────┐
│  Step 6 of 8                        │
│  What equipment can you use?        │
│  Select all that apply.             │
│                                     │
│  [✓] Football                       │
│  [✓] Training markers               │
│  [ ] Safe field or open space       │
│  [ ] Exercise mat / soft surface    │
│  [ ] Stable support or target       │
│  [ ] Wall or training partner       │
│  [ ] Resistance band                │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

### WF-09 — Current training, limitations, and pain

**Concept requiring research and specialist review.** Do not implement a
free-text limitations field. Decide whether current pain belongs in onboarding
at all, or only in the pre-session check-in, before collecting health-related
data.

```text
┌─────────────────────────────────────┐
│  Step 7 of 8                        │
│  Your current training              │
│                                     │
│  Sessions in a typical week         │
│  [ 3–4 sessions                ▾ ]  │
│                                     │
│  Current pain                       │
│  ( ) None  ( ) Mild                │
│  ( ) Moderate  ( ) Severe          │
│                                     │
│  Why we ask                         │
│  Pain pauses automated optional     │
│  training for adult review.         │
│                                     │
│  [ Continue ]                       │
└─────────────────────────────────────┘
```

Any reported pain pauses normal automated plan generation for responsible-adult
review. Severe pain adds stop-training/professional-advice guidance. Retain
saved progress and explain that PureAthletic cannot assess or clear an injury.

### WF-10 — Review and generate

```text
┌─────────────────────────────────────┐
│  ← Back              Save and exit  │
├─────────────────────────────────────┤
│  Step 8 of 8                        │
│  Review your setup                  │
│                                     │
│  GOAL                        Edit   │
│  Match readiness                    │
│                                     │
│  FIXED COMMITMENTS           Edit   │
│  Tue practice · Sat match           │
│                                     │
│  AVAILABILITY                Edit   │
│  Mon 45 · Wed 60 · Fri 30 · Sun 45  │
│                                     │
│  EQUIPMENT                   Edit   │
│  Bodyweight · Bands                 │
│                                     │
│  CURRENT STATUS              Edit   │
│  3–4 sessions · No pain             │
│                                     │
│  [ Generate my 7-day plan ]         │
└─────────────────────────────────────┘
```

### WF-11 — Plan generated / conflict

**Success**

```text
┌─────────────────────────────────────┐
│                                     │
│               ✓                     │
│  Your first plan is ready           │
│                                     │
│  2 independent sessions             │
│  1 team practice · 1 match          │
│  2 recovery or rest days            │
│                                     │
│  We protected Friday from hard      │
│  lower-body work before your match. │
│                                     │
│  [ See today's recommendation ]     │
│  [ Review the full week ]           │
└─────────────────────────────────────┘
```

**Scheduling conflict**

```text
┌─────────────────────────────────────┐
│  We need one change                 │
│                                     │
│  Your fixed commitments and current │
│  availability leave no suitable day │
│  for an independent speed session.  │
│                                     │
│  Nothing unsafe has been added.     │
│                                     │
│  [ Edit availability ]              │
│  [ Review team schedule ]           │
│  [ Save and finish later ]          │
└─────────────────────────────────────┘
```

## 5. Today and readiness

### WF-12 — Today, check-in due

```text
┌─────────────────────────────────────┐
│  PureAthletic              Tue 28   │
├─────────────────────────────────────┤
│  Good afternoon, Sam                │
│                                     │
│  TODAY'S RECOMMENDATION             │
│  ┌───────────────────────────────┐  │
│  │ Planned · Strength            │  │
│  │ Lower-body foundation         │  │
│  │ 45 min · Moderate             │  │
│  │                               │  │
│  │ Check in first so we can      │  │
│  │ confirm today's session.      │  │
│  │                               │  │
│  │ [ Complete check-in ]         │  │
│  └───────────────────────────────┘  │
│                                     │
│  NEXT FIXED COMMITMENT              │
│  Team practice · Thu 19:00          │
│                                     │
│  [ Log another activity ]           │
├─────────────────────────────────────┤
│  Today*    Week    Progress  Profile│
└─────────────────────────────────────┘
```

The workout remains visible but its start action is replaced by **Complete check-in** until the daily check-in is submitted.

### WF-13 — Readiness check-in

```text
┌─────────────────────────────────────┐
│  ← Today        Daily check-in      │
├─────────────────────────────────────┤
│  About 30 seconds                   │
│                                     │
│  Sleep quality                      │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]    │
│  Poor                        Great  │
│                                     │
│  Energy                             │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]    │
│  Low                          High  │
│                                     │
│  Muscle soreness                    │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]    │
│  None                       Severe  │
│                                     │
│  Stress                             │
│  [ 1 ] [ 2 ] [ 3 ] [ 4 ] [ 5 ]    │
│  Low                          High  │
│                                     │
│  Pain today                         │
│  ( ) None  ( ) Mild                │
│  ( ) Moderate  ( ) Severe          │
│                                     │
│  [ Save check-in ]                  │
└─────────────────────────────────────┘
```

Pain uses words, not only a numeric scale. Selecting any pain reveals a short
explanation before submission without asking the athlete to diagnose the cause.

### WF-14 — Today, recommendation confirmed

```text
┌─────────────────────────────────────┐
│  PureAthletic              Tue 28   │
├─────────────────────────────────────┤
│  TODAY'S RECOMMENDATION             │
│  ┌───────────────────────────────┐  │
│  │ Planned · Strength            │  │
│  │ Lower-body foundation         │  │
│  │ 45 min · Moderate             │  │
│  │                               │  │
│  │ [ Start workout ]             │  │
│  │ [ Use 25-minute version ]     │  │
│  └───────────────────────────────┘  │
│                                     │
│  WHY THIS TODAY?                    │
│  Your energy is good, and this is   │
│  the clearest strength window ahead │
│  of Saturday's match.               │
│                                     │
│  UP NEXT                            │
│  Thu · Team practice · 19:00        │
│                                     │
│  RECENT PROGRESS                    │
│  2 of 3 planned sessions logged     │
│                                     │
│  [ Log another activity ]           │
├─────────────────────────────────────┤
│  Today*    Week    Progress  Profile│
└─────────────────────────────────────┘
```

### WF-15 — Poor readiness adjustment

```text
┌─────────────────────────────────────┐
│  Recommendation updated             │
├─────────────────────────────────────┤
│  WHAT CHANGED                       │
│  45-min strength                    │
│          ↓                          │
│  20-min mobility and recovery       │
│                                     │
│  WHY                               │
│  Today's sleep and energy are very  │
│  low. A lighter session preserves   │
│  recovery before team practice.     │
│                                     │
│  [ View recovery session ]          │
│  [ Return to Today ]                │
│                                     │
│  You can restore the earlier plan   │
│  from adjustment history if it is   │
│  still safe and available.          │
└─────────────────────────────────────┘
```

### WF-16 — Pain and escalation

**Mild or moderate pain**

```text
┌─────────────────────────────────────┐
│  Training recommendation changed    │
├─────────────────────────────────────┤
│  You reported pain.                 │
│                                     │
│  We paused today's automated        │
│  optional workout for adult review. │
│  PureAthletic cannot assess injury  │
│  or say when return is safe.        │
│                                     │
│  Consider speaking with a qualified │
│  healthcare or sports professional  │
│  if you are concerned.              │
│                                     │
│  Your team commitments are still    │
│  visible, but are not a clearance   │
│  to participate.                    │
│                                     │
│  [ Return to Today ]                │
└─────────────────────────────────────┘
```

For severe pain, the heading becomes **Stop training and seek qualified
advice**. Do not show a workout or an undo action. Emergency language should be
added only after jurisdiction-specific professional review.

## 6. Week and workout

### WF-17 — Rolling seven-day plan

```text
┌─────────────────────────────────────┐
│  Your next 7 days          Jul–Aug  │
├─────────────────────────────────────┤
│  TODAY · TUE 28                     │
│  [Planned] Strength · 45 min     >  │
│                                     │
│  WED 29                             │
│  [Rest] Full rest                >  │
│                                     │
│  THU 30                             │
│  [Team practice] 19:00 · 90 min  >  │
│                                     │
│  FRI 31                             │
│  [Recovery] Mobility · 20 min    >  │
│                                     │
│  SAT 1                              │
│  [Match] 15:00 · 90 min          >  │
│                                     │
│  SUN 2                              │
│  [Planned] Recovery · 25 min     >  │
│                                     │
│  MON 3                              │
│  [Planned] Speed · 35 min        >  │
├─────────────────────────────────────┤
│  Today     Week*   Progress  Profile│
└─────────────────────────────────────┘
```

- The list is rolling: today plus six days, not constrained to Monday–Sunday.
- Fixed commitments include an explicit type label and time.
- Status text remains present when final color and icons are added.
- Selecting any item opens its detail. Schedule editing remains under Profile.

### WF-18 — Workout detail

```text
┌─────────────────────────────────────┐
│  ← Week             Planned · Today │
├─────────────────────────────────────┤
│  Lower-body foundation              │
│  Strength · 45 min · Moderate       │
│                                     │
│  PURPOSE                            │
│  Build useful lower-body strength   │
│  with enough recovery before match. │
│                                     │
│  1  WARM-UP · 8 min                 │
│     Dynamic movement series      >  │
│  2  MAIN WORK · 28 min              │
│     Split squat · 3 × 8/side     >  │
│     Hip hinge · 3 × 10           >  │
│     Calf raise · 3 × 12          >  │
│  3  FINISH · 9 min                  │
│     Trunk and mobility series    >  │
│                                     │
│  Rest 60–90 sec between sets.       │
│                                     │
│  [ Start workout ]                  │
│  [ Use 25-minute version ]          │
│  [ Skip this session ]              │
└─────────────────────────────────────┘
```

Each exercise disclosure includes setup, execution cues, sets or time, rest, and approved alternatives. The interface never invents an alternative outside the approved library.

### WF-19 — In-workout view

```text
┌─────────────────────────────────────┐
│  Close          2 of 6        18:42 │
├─────────────────────────────────────┤
│  Split squat                       │
│  3 sets × 8 each side               │
│                                     │
│  [ Exercise instruction placeholder]│
│                                     │
│  KEY CUES                           │
│  • Stable front foot                │
│  • Controlled range                 │
│  • Stop if movement causes pain     │
│                                     │
│  SETS                               │
│  [✓] 1    [✓] 2    [ ] 3           │
│                                     │
│  [ Choose approved alternative ]    │
│  [ Next exercise ]                  │
│                                     │
│  [ Finish or log modifications ]    │
└─────────────────────────────────────┘
```

Closing the workout preserves progress and offers **Resume**, **Finish and log**, or **Discard unsaved progress**.

## 7. Activity logging

### WF-20 — Planned activity log

```text
┌─────────────────────────────────────┐
│  ← Workout         Log your session │
├─────────────────────────────────────┤
│  Lower-body foundation              │
│                                     │
│  Outcome                            │
│  (•) Completed                     │
│  ( ) Completed with modifications  │
│  ( ) Skipped                       │
│                                     │
│  Actual duration                    │
│  [ 42 ] minutes                     │
│                                     │
│  Effort                             │
│  [1][2][3][4][5][6][7][8][9][10]   │
│  Very easy                 Maximal   │
│                                     │
│  Pain during or after               │
│  (•) None  ( ) Mild                │
│  ( ) Moderate  ( ) Severe          │
│                                     │
│  Notes (optional)                   │
│  [_______________________________]  │
│                                     │
│  [ Save activity ]                  │
└─────────────────────────────────────┘
```

- Selecting **Modified** reveals approved modification categories and optional notes.
- Selecting **Skipped** makes duration and effort unnecessary and reveals an optional skip reason.
- Any pain invokes the same responsible-adult-review boundary used in the
  readiness check-in; severe pain adds stop-training guidance.

### WF-21 — Unplanned activity

```text
┌─────────────────────────────────────┐
│  ← Today       Log another activity │
├─────────────────────────────────────┤
│  What did you do?                   │
│  [ Team practice               ▾ ]  │
│                                     │
│  Date and time                      │
│  [ Today, 18:30                ▾ ]  │
│                                     │
│  Duration       Effort              │
│  [ 75 ] min     [ 8 / 10       ▾ ]  │
│                                     │
│  Pain during or after               │
│  (•) None  ( ) Mild                │
│  ( ) Moderate  ( ) Severe          │
│                                     │
│  Notes (optional)                   │
│  [_______________________________]  │
│                                     │
│  This activity may change upcoming  │
│  optional sessions.                 │
│                                     │
│  [ Save activity ]                  │
└─────────────────────────────────────┘
```

The save operation uses a client-generated idempotency key so a retry does not create a duplicate activity.

## 8. Plan adjustment

### WF-22 — Schedule-change preview

```text
┌─────────────────────────────────────┐
│  Review plan changes                │
├─────────────────────────────────────┤
│  Your 75-minute high-effort team    │
│  session increased today's load.    │
│                                     │
│  PROPOSED CHANGES                   │
│  Tomorrow                           │
│  Conditioning · 35 min              │
│          ↓                          │
│  Recovery mobility · 20 min         │
│                                     │
│  Friday                             │
│  No change · Rest                   │
│                                     │
│  WHY                               │
│  This avoids consecutive high-load  │
│  days while keeping your fixed      │
│  commitments unchanged.             │
│                                     │
│  [ Apply changes ]                  │
│  [ Keep current plan ]              │
└─────────────────────────────────────┘
```

### WF-23 — Adjustment applied and history

```text
┌─────────────────────────────────────┐
│  Plan updated                       │
├─────────────────────────────────────┤
│  ✓ Conditioning was replaced with   │
│    recovery tomorrow.               │
│                                     │
│  [ Return to Today ]                │
│  [ View updated week ]              │
│                                     │
│  ─────────────────────────────────  │
│  ADJUSTMENT HISTORY                 │
│                                     │
│  Today · 20:04                      │
│  Recovery replaced conditioning     │
│  Rule: consecutive high-load days   │
│  [ View details ] [ Undo ]          │
│                                     │
│  Mon · 08:12                        │
│  Strength moved from Mon to Wed     │
│  Rule: missed priority session      │
│  [ View details ] [ Undo ]          │
└─────────────────────────────────────┘
```

Undo first checks that the original state remains safe and the time slot remains available. If it does not, show the reason and retain the current plan. Safety-critical changes do not present **Undo**.

## 9. Progress

### WF-24 — Weekly review

```text
┌─────────────────────────────────────┐
│  Progress              21–27 Jul ▾  │
├─────────────────────────────────────┤
│  YOUR WEEK                          │
│  4 of 5 planned sessions completed  │
│  or appropriately modified          │
│                                     │
│  [ Completed 3 ][ Modified 1 ]      │
│  [ Skipped 1   ][ Unplanned 1 ]     │
│                                     │
│  TRAINING TIME                      │
│  245 min · 20 min more than prior   │
│  [ Simple 4-week trend placeholder ]│
│                                     │
│  READINESS                          │
│  Mostly steady · lower on Thursday  │
│  [ Simple 7-day trend placeholder ] │
│                                     │
│  NOTABLE THIS WEEK                  │
│  You completed both recovery days   │
│  around your Saturday match.        │
│                                     │
│  NEXT 7 DAYS                        │
│  Thursday practice and Saturday's   │
│  match will shape your next plan.   │
├─────────────────────────────────────┤
│  Today     Week    Progress* Profile│
└─────────────────────────────────────┘
```

### WF-25 — Progress empty state

```text
┌─────────────────────────────────────┐
│  Progress                           │
├─────────────────────────────────────┤
│                                     │
│  Your first review is taking shape  │
│                                     │
│  After seven days, you will see     │
│  planned versus completed sessions, │
│  training time, and readiness       │
│  patterns here.                     │
│                                     │
│  THIS WEEK                          │
│  1 activity logged · 2 check-ins    │
│                                     │
│  [ Go to Today ]                    │
├─────────────────────────────────────┤
│  Today     Week    Progress* Profile│
└─────────────────────────────────────┘
```

Do not show streaks, competitive rankings, calorie estimates, or a prescriptive readiness score.

## 10. Profile, schedule, and account controls

### WF-26 — Profile

```text
┌─────────────────────────────────────┐
│  Profile                            │
├─────────────────────────────────────┤
│  Sam                                │
│  Midfielder · Intermediate          │
│  Goal: Match readiness              │
│                                     │
│  TRAINING SETUP                     │
│  [ Athlete details              > ] │
│  [ Goal                         > ] │
│  [ Team schedule                > ] │
│  [ Training availability        > ] │
│  [ Equipment                    > ] │
│                                     │
│  PREFERENCES                        │
│  [ Notifications                > ] │
│                                     │
│  DATA AND PRIVACY                   │
│  [ Privacy information          > ] │
│  [ Export my data               > ] │
│  [ Delete account              > ]  │
│                                     │
│  Sign out                           │
├─────────────────────────────────────┤
│  Today     Week    Progress  Profile*│
└─────────────────────────────────────┘
```

### WF-27 — Edit team schedule and recalculate

```text
┌─────────────────────────────────────┐
│  ← Profile        Team schedule     │
├─────────────────────────────────────┤
│  Fixed commitments                  │
│                                     │
│  TEAM PRACTICE                      │
│  Tue · 19:00 · 90 min        Edit   │
│                                     │
│  MATCH                              │
│  Sat · 15:00 · 90 min        Edit   │
│                                     │
│  [ + Add commitment ]               │
│                                     │
│  [ Save schedule ]                  │
└─────────────────────────────────────┘
```

If a change affects optional sessions, **Save schedule** opens a single preview containing both the new fixed commitment and every proposed plan change. Nothing is saved until all changes are confirmed.

### WF-28 — Export and deletion

**Export**

```text
┌─────────────────────────────────────┐
│  ← Profile        Export my data    │
├─────────────────────────────────────┤
│  Your export includes your profile, │
│  plans, readiness check-ins,        │
│  activity logs, and adjustments.    │
│                                     │
│  [ Request data export ]            │
└─────────────────────────────────────┘
```

**Permanent deletion**

```text
┌─────────────────────────────────────┐
│  ← Profile        Delete account    │
├─────────────────────────────────────┤
│  This permanently deletes your      │
│  account and training data.         │
│                                     │
│  This cannot be undone.             │
│                                     │
│  Re-enter your password             │
│  [_______________________________]  │
│                                     │
│  Type DELETE to confirm             │
│  [_______________________________]  │
│                                     │
│  [ Permanently delete account ]     │
│  [ Cancel ]                         │
└─────────────────────────────────────┘
```

Deletion requires recent authentication and a deliberate second confirmation. Final retention and deletion timing must match the future privacy policy and platform implementation.

## 11. Responsive behavior

The mobile information order remains authoritative.

| Viewport | Navigation | Content behavior |
| --- | --- | --- |
| Under 768 px | Fixed bottom navigation | Single column; primary action visible without horizontal scrolling |
| 768–1199 px | Left rail or bottom navigation | Main content up to 720 px; related summary may sit beside a form |
| 1200 px and above | Persistent left rail | Today may use a 2:1 grid, with recommendation on the left and schedule/progress context on the right |

On larger screens:

- Do not move explanatory content ahead of the primary recommendation.
- Do not display several equal-weight actions merely because space is available.
- Forms remain comfortably narrow and preserve their mobile field order.
- Dialogs keep visible headings, focus containment, Escape behavior where safe, and a logical return focus.

## 12. Accessibility notes

- Target WCAG 2.2 AA for the complete core journey.
- Use semantic headings, landmarks, labels, buttons, and form controls.
- Meet WCAG 2.2 AA target-size/spacing requirements and use at least a 44 × 44
  CSS-pixel project target for important touch actions where practical. The
  larger size is a usability target, not a claim that WCAG AA always requires
  44 × 44.
- Provide visible keyboard focus and logical focus order.
- Pair icons and colors with text labels.
- Announce saved, failed, and materially changed states to assistive technology.
- Do not automatically move focus past a safety message.
- Charts require a text summary and access to their underlying values.
- Error copy explains how to recover; it does not rely on color or generic wording.
- Respect reduced-motion preferences in final transitions and progress feedback.

## 13. Prototype routes

The clickable prototype should support these six scenarios:

1. **Eligible first-time athlete:** Landing → account → onboarding → generated plan → Today.
2. **Normal training day:** Today → readiness check-in → confirmed workout → complete → log → Today.
3. **Poor readiness:** Today → check-in → reduced session → recovery detail → log.
4. **Pain safety:** Today → check-in with any pain → responsible-adult guidance → Today with no automated optional recommendation.
5. **Unplanned high load:** Today → unplanned activity → adjustment preview → apply → updated Week → undo attempt.
6. **Schedule change and review:** Profile → edit team schedule → plan-change preview → confirm → Week → Progress.

## 14. Research prompts

During prototype testing, ask the athlete to complete tasks before asking for opinions.

- Show me what PureAthletic recommends today.
- Your sleep and energy were unusually poor. Record that and decide what to do next.
- You attended an unplanned hard team session. Add it and explain what changed afterward.
- Find Saturday's match and explain whether PureAthletic can move it.
- You did only part of a planned workout. Record what happened.
- Find the reason a future session changed and determine whether it can be undone.
- Change next week's team practice and review the effect on your plan.
- Find your weekly progress, request a data export, and locate account deletion.

Observe:

- Whether the athlete starts the correct action without prompting.
- Whether fixed and optional sessions are distinguished without explanation.
- Time to complete readiness and activity logging.
- Whether the athlete can restate what changed and why.
- Whether the pain response is understood as a safety boundary rather than a diagnosis.
- Where back navigation or save behavior creates uncertainty.

## 15. Wireframe acceptance check

| Requirement | Covered by |
| --- | --- |
| Eligible athlete reaches a first plan | WF-01–WF-11 |
| Today has one unmistakable primary recommendation | WF-12 and WF-14 |
| Check-in and activity log can target under one minute | WF-13 and WF-20–WF-21 |
| Any pain does not lead to automated optional training | WF-09, WF-13, and WF-16 |
| Session states do not rely on color | Shared status language and WF-17 |
| Every plan change explains what and why | WF-15, WF-22, and WF-23 |
| Confirmation and undo follow the safety boundary | WF-16, WF-22, and WF-23 |
| Schedule, export, and deletion are reachable from Profile | WF-26–WF-28 |
| Back navigation preserves completed input | Shared onboarding frame and feedback behavior |

## 16. Decisions to validate before visual design

- Whether readiness belongs inline on Today or in the focused WF-13 step.
- Whether athletes understand the rolling seven-day range without a calendar grid.
- Whether **Use 25-minute version** is distinct enough from modifying a workout.
- Whether adjustment confirmation contains enough context without showing the entire week.
- Whether **completed or appropriately modified** feels motivating and credible.
- Whether pain and escalation language is clear, conservative, and appropriate after professional review.

The next design revision should narrow these concepts to the cohort and minimum
inputs supported by research. Do not expand the current clickable prototype to
cover every wireframe before the core tasks, content order, and safety states
are tested with adults and reviewed by qualified specialists.
