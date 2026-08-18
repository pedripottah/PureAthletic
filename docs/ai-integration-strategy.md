# PureAthletic — AI Integration Strategy

**Status:** Approved direction for experimentation; production use gated
**Last reviewed:** 18 August 2026

## The short answer

PureAthletic should begin **AI experimentation only after the deterministic
weekly-planner contract and safety scenarios are stable**, using fictional or
synthetic profiles. It should not send real junior data to an API or let a
model freely generate training plans yet.

The first production AI feature should be a constrained explanation or weekly
summary. AI-generated plan personalization can be explored in parallel, but it
must remain behind the deterministic planner and hard safety rules until it has
passed evaluation and practitioner review.

The project is not at the API-integration point yet. The next foundation is to
unify the catalog selector, weekly scheduler, adaptation rules, and safety
decisions into one tested planning boundary.

## Current implementation reality

The current prototype has useful pieces, but they are not yet a production
planner:

- `lib/youth-football-catalog.mjs` selects one age-band, experience, and goal
  routine from the reviewed catalog.
- `lib/junior-recommendation-engine.mjs` filters and scores a different legacy
  library using readiness, pain, supervision, equipment, and schedule context.
- `app.js` loads the youth catalog for onboarding, but its seven-day plan still
  starts from `initialPlan` and its check-in adjustments are implemented in UI
  handlers.
- The youth catalog and legacy junior library are separate data systems with
  different schemas and boundaries.

Therefore the first engineering task is not “call the API.” It is to choose the
canonical catalog and safety model, extract one server- or module-authoritative
planner, and make the browser consume its output. Until then, an AI response
would be decorating a prototype rather than personalizing a trustworthy plan.

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
      "fixedCommitmentId": null,
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

### A. Planner foundation — next engineering phase

Before the API:

1. Select one canonical routine/content schema and archive or migrate the other
   path deliberately.
2. Extract plan generation from `app.js` into a separately tested module.
3. Move readiness, pain, schedule, and high-load adaptation into the same
   decision boundary.
4. Add daily session variants, not just one routine per onboarding profile.
5. Add decision traces, content versions, reason codes, and safe fallbacks.
6. Create scenario tests for every hard stop, restriction, conflict, and empty
   candidate set.

This is what makes the plan more specific every day. More specificity should
come from better structured inputs, approved session variants, and scheduling
logic—not from asking a model to improvise.

### B. Offline AI experiment — after the planner foundation

Use synthetic profiles and the approved local catalog. Build a small script or
private experiment that sends only structured, non-identifying inputs and asks
for strict JSON such as:

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

Use repeatable evaluations rather than judging a few attractive examples. The
OpenAI API provides evaluation objects and runs for testing model behavior
against structured data sources. [OpenAI Evals API](https://platform.openai.com/docs/api-reference/evals/deleteRun?lang=python)

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
reviewed sources into versioned structured records with source IDs, age-band
scope, approval status, effective date, and expiry/review date.

Use retrieval only to provide relevant approved records to the model. File
search/vector retrieval can help locate documents, but retrieval is not a
safety control; the server still validates IDs, constraints, and output.
OpenAI’s Responses API supports file search and function/tool integration, while
structured outputs can require a defined JSON schema. [OpenAI API quickstart](https://platform.openai.com/docs/quickstart/make-your-first-api-request)

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

The browser must never contain the API key. API calls must occur server-side.
Do not send names, contact details, precise locations, free-text medical notes,
or unnecessary identifiers. OpenAI’s API documentation describes server-side
JavaScript usage and the available Responses API tools; data handling and
retention must still be reviewed for the chosen deployment. [OpenAI API data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint)

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
