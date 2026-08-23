# PureAthletic — AI Integration Strategy

**Status:** Deferred working strategy; no API integration approved
**Last reviewed:** 24 August 2026

## The short answer

PureAthletic should begin **AI experimentation only after the deterministic
weekly-planner contract and safety scenarios are stable**, using fictional or
synthetic profiles. It should not send real junior data to an API or let a
model freely generate training plans yet.

The first production AI feature should be a constrained explanation or weekly
summary. AI-generated plan personalization can be explored in parallel, but it
must remain behind the deterministic planner and hard safety rules until it has
passed evaluation and practitioner review.

The project is not at the API-integration point. A development-only canonical
planner now exists, but the next work is to finish, review, and deliberately
integrate one catalog, scheduler, adaptation, and safety boundary—not to call a
model API.

## Current implementation reality

The current prototype has useful pieces, but they are not yet a production
planner:

- `lib/youth-football-catalog.mjs` selects one age-band, experience, and goal
  routine from the current research catalog.
- `lib/junior-recommendation-engine.mjs` filters and scores a different legacy
  library using readiness, pain, supervision, equipment, and schedule context.
- `lib/canonical-planner.mjs` is a versioned, independently tested planning
  foundation, but it is not imported by the browser or copied into the current
  deployment artifact.
- `app.js` loads the youth catalog for onboarding, while its seven-day plan
  still starts from `initialPlan` and its check-in adjustments remain in UI
  handlers.
- The youth catalog and legacy junior library are separate data systems with
  different schemas and boundaries.

The canonical planner remains development-only until practitioner review,
broader scenario coverage, persistence design, and the remaining legacy demo
path are resolved. The live browser therefore uses the earlier prototype flow.

### Deferred onboarding and browser rollout

The following planner inputs remain documented candidate requirements, but should
not currently appear on onboarding Step 4 or be persisted as active planner
inputs in browser profile data:

- days available for optional training;
- equipment available for optional training;
- whether a qualified coach can supervise optional sessions.

These inputs should return only when their placement and wording have been
simplified, the planner output has completed review, and a deliberate storage
migration is ready. Until that rollout, the canonical planner and its tests are
engineering groundwork rather than a deployed user-facing feature.

## What should generate the daily plan?

The daily and weekly structure should primarily come from a deterministic
planner. It can be highly specific without being generative.

For each day, the planner should combine:

- developmental age band;
- experience level;
- primary goal;
- position, if relevant and approved;
- fixed practices and matches;
- available days, time, and equipment;
- recent completed and unplanned activity;
- readiness and pain state;
- recovery spacing and session limits;
- approved routine and exercise IDs.

This produces a predictable seven-day schedule that can be tested and explained.
AI can then help write a clearer explanation, but it does not need to select the
weekly structure in the first version.

## Required weekly-plan contract

Before any API experiment, the planner should produce a versioned object similar
to this for every day:

```json
{
  "planVersion": "planner-v1",
  "athleteContext": {
    "ageBandId": "u9-u12",
    "experience": "intermediate",
    "goalId": "speed"
  },
  "days": [
    {
      "date": "2026-08-18",
      "dayType": "optional_session",
      "fixedCommitmentIds": [],
      "routineId": "approved-routine-id",
      "durationMinutes": 23,
      "intensity": "easy",
      "reasonCodes": ["goal_fit", "match_buffer", "available_time"],
      "sourceContentVersion": "catalog-v1",
      "safetyStatus": "eligible"
    }
  ],
  "decisionTrace": {
    "rulesetVersion": "rules-v1",
    "excludedCandidates": [],
    "fallbackUsed": false
  }
}
```

The real schema may differ, but it must answer: what is planned each day, why,
which approved content produced it, what was excluded, which safety rules ran,
and what happens when information is missing or contradictory. The API should
receive this structured decision context, not raw application state.

## AI responsibility boundary

### AI may eventually

- rank approved routine IDs within a safe candidate set;
- choose among approved exercise alternatives;
- produce an age-appropriate explanation from structured facts;
- summarize a completed week;
- identify missing or ambiguous planning information for the user to confirm.

### AI must not

- decide whether pain or a red flag is safe;
- override a hard safety rule;
- invent exercises, sets, reps, progressions, or medical advice;
- move a fixed practice or match;
- increase workload beyond deterministic limits;
- infer sensitive facts that the user did not provide;
- create a plan from arbitrary internet material;
- expose raw minor data to an external model unnecessarily.

## Integration phases

### A. Planner foundation — current engineering phase

Before the API:

1. Select one canonical routine/content schema and archive or migrate the other
   path deliberately.
2. Treat `lib/canonical-planner.mjs` as development groundwork until catalog
   selection, readiness, pain, schedule, supervision, equipment, high-load
   adaptation, and safe fallback behavior share one contract.
3. Add daily session variants, not just one routine per onboarding profile.
4. Complete decision traces, content/rule versions, reason codes, stale-input
   handling, and scenario tests for every hard stop, restriction, conflict, and
   empty candidate set.
5. Obtain qualified review of the exact contract and output examples.
6. Design the deferred browser inputs, persistence migration, and rollback
   before reconnecting the planner to the UI.

This is what makes the plan more specific every day. More specificity should
come from better structured inputs, approved session variants, and scheduling
logic—not from asking a model to improvise.

### B. Offline AI experiment — after the planner foundation

Use synthetic profiles and a practitioner-reviewed, versioned catalog. Build a
small private experiment that sends only structured, non-identifying inputs and
asks for strict JSON such as:

```json
{
  "candidateRoutineIds": ["routine-id"],
  "explanationFacts": ["approved fact id"],
  "uncertainty": "none | needs_input | fallback",
  "safetyFlags": []
}
```

Validate that every returned ID exists, every fact is approved, no safety flag
was ignored, and invalid output falls back to the deterministic planner.

### C. Internal evaluation — before real user data

Create a scenario set covering normal schedules, dense schedules, poor
readiness, pain, red flags, missing data, unexpected activity, and conflicting
commitments. Compare AI-assisted output with expected deterministic results.

Use repeatable evaluations rather than judging a few attractive examples. If
OpenAI is selected after an architecture/privacy decision, its official
[evals guide](https://developers.openai.com/api/docs/guides/evals) describes
repeatable evaluation workflows.

### D. First production AI — explanations and summaries

After backend authorization, privacy review, practitioner review, logging, and
fallback behavior exist, add AI only for explanations and weekly summaries.
The planner remains the source of truth. The UI must work when the API is
unavailable.

### E. Candidate ranking — optional later feature

Only after real beta evidence shows that approved templates are insufficient,
allow AI to rank a pre-filtered candidate list. The server must perform the
hard safety filtering before the model call and validate the result afterward.

### F. Free-form plan generation — not planned for the initial product

Do not allow unrestricted model-generated plans for junior users. If this is
ever reconsidered, it requires a new product decision, a substantially larger
evaluation set, practitioner approval, incident controls, and legal/privacy
review.

## Use project documents as controlled knowledge

The model should not browse the internet for live training decisions. Convert
practitioner-reviewed source material into versioned structured records with
source IDs, age-band
scope, approval status, effective date, and expiry/review date.

Use retrieval only to provide relevant approved records to the model. Retrieval
is not a safety control; the server still validates IDs, constraints, and
output. If OpenAI is selected, the official
[Responses API reference](https://developers.openai.com/api/reference/resources/responses/methods/create)
documents structured JSON outputs and tool inputs. Provider selection remains
an architecture and privacy decision.

## Minimum technical architecture

```text
User input
   ↓
Server validation and normalization
   ↓
Deterministic hard safety rules
   ↓
Deterministic candidate plan
   ↓
Optional AI ranking or explanation
   ↓
Schema validation + allowlist checks + safety re-check
   ↓
Plan shown to user, with fallback if AI fails
```

The browser must never contain a provider API key. API calls must occur
server-side.
Do not send names, contact details, precise locations, free-text medical notes,
or unnecessary identifiers. Data handling, storage settings, retention,
location, subprocessors, and eligibility for any additional controls must be
reviewed for the chosen provider and deployment. For OpenAI, use the current
[API data-controls guide](https://developers.openai.com/api/docs/guides/your-data)
rather than assuming a request option satisfies the project’s privacy duties.

## Evaluation gates

AI cannot enter production until:

- all normal and safety scenarios have expected outputs;
- the deterministic planner passes every hard constraint;
- model output is schema-validated and allowlisted;
- invalid, unavailable, delayed, or refused output has a safe fallback;
- prompt-injection and malicious-content cases are tested;
- no AI output can override pain, red flags, match protection, supervision, or
  session limits;
- output versions, model, prompt, source records, and decision IDs are logged;
- practitioner reviews the exact behavior and athlete-facing copy;
- privacy review approves the data sent to the provider;
- the feature is monitored and can be disabled instantly.

## Recommended first AI implementation

Do not begin with “generate a complete plan.” Begin with:

1. Unify the catalog, rules, and weekly planner behind a tested contract.
2. Add daily session variants and decision traces to the planner output.
3. Create synthetic profiles and expected outputs for normal and safety cases.
4. Run an offline API experiment that explains approved planner output only.
5. Require a strict explanation schema with a deterministic fallback.
6. Compare AI explanations against approved facts in automated tests.
7. Keep the feature disabled by default until reviewed.

This still advances the project’s main AI goal while protecting the core planner
from becoming untestable or unsafe.
