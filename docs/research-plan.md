# PureAthletic — Phase 0 Research Plan

**Status:** Draft adult-research protocol; recruitment materials still required
**Owner:** Project founder/research lead
**Last reviewed:** 24 August 2026
**Version:** 1.1

Use the [Research Preparation Pack](research-preparation.md) to prepare the
first adult sessions and the separate practitioner review.

## Purpose

This plan validates whether PureAthletic solves a meaningful problem clearly and
safely before production infrastructure or minor recruitment begins.

The central question is:

> Can a footballer and responsible adult understand what to do next, why it is
> recommended, and when they should not follow an automated training suggestion?

This is discovery and usability research, not medical research and not a test
of athletic performance.

## Decisions this research must inform

1. Whether the problem is valuable enough to continue, and which first cohort
   and problem could define a private beta.
2. Is match readiness a clearer first use case than general improvement goals?
3. Do users understand the rolling seven-day plan?
4. When do users expect to complete the readiness check-in?
5. Do users understand the difference between fixed team commitments and
   optional training?
6. Do users understand why a plan changes and when they can undo it?
7. Can users correctly interpret pain and adult-review guidance?
8. Which information is essential during onboarding, and what can be removed?
9. Which accessibility or language barriers prevent safe use?

## Research rounds

### Round 1 — Adult discovery and prototype usability

**Participants:** At least five adults total, including football player/coach
and parent/guardian perspectives. Aim for 2–3 in each perspective where
recruitment allows. Do not present this round as approval for junior use.

**Activities:** 30-minute interview followed by a 30–45-minute prototype task
session.

**Goals:** Learn current planning behavior, test comprehension, identify
confusing or unsafe language, and decide which product promise is strongest.

### Round 2 — Practitioner and safeguarding review

**Participants:** At least one qualified youth-sport practitioner and one
safeguarding/privacy reviewer where available.

**Activities:** Review the safety packet, catalog samples, rule scenarios, data
flows, consent screens, and escalation behavior.

**Goals:** Identify unsafe assumptions, missing boundaries, unacceptable copy,
and release-blocking controls.

### Round 3 — Representative usability validation

**Participants:** 4–8 representative users in approved, age-appropriate
sessions, including responsible adults and users with relevant accessibility
needs where possible. This round is conditional; it cannot start until the
cohort, protocol, consent/assent, safeguarding, privacy, and specialist gates
are approved.

**Activities:** Moderated task sessions using the revised prototype.

**Goals:** Confirm that the highest-impact issues are fixed and that users can
complete the core journey without unsafe interpretation.

## Participant safeguards

- Obtain informed consent for every participant and guardian consent where
  required; use a separate assent process for children.
- Collect only contact and demographic information required to recruit and
  interpret the session.
- Do not collect medical histories, exact birth dates, precise locations, or
  identifiable performance data for this research unless separately approved.
- Do not ask participants to perform exercise or follow a recommendation.
- Use seeded or fictional profiles during prototype sessions where possible.
- Never record a pain disclosure as a product test result without an approved
  safeguarding and privacy process.
- Stop a session if a participant becomes distressed, reports harm, or appears
  to misunderstand a safety instruction.
- Store notes using participant IDs, not names, and define deletion dates before
  recruitment begins.

## Interview prompts

### Current behavior

- How do you currently decide what training to do next?
- What changes when there is a practice, match, exam, travel, tiredness, or
  unexpected activity?
- What information do you trust when deciding whether to train or rest?
- Who else is involved in that decision?

### Need and value

- Tell me about the last time your training plan did not fit your week.
- What would make a planning tool worth returning to?
- What would make you stop trusting it?

### Safety and responsibility

- What would you expect the app to do if you reported pain?
- Who should be informed when a junior user receives a safety warning?
- What should the app never claim or decide?

Avoid leading questions such as “Would you use this?” Prefer questions about
recent behavior, concrete decisions, and observed actions.

## Prototype task script

Ask participants to think aloud, but do not coach them toward the answer.
Record the first independent action, hesitation, misunderstanding, and final
outcome for each task.

1. Create a profile and explain what information is being requested.
2. Choose an age band and goal, then add fixed team commitments on Step 4.
3. Generate the first seven-day plan and explain its structure.
4. Find what to do today and explain why it was selected.
5. Complete a readiness check-in.
6. Report a concerning pain response and explain what the app tells you to do.
7. Log a completed or modified activity.
8. Log an unexpected high-load activity and review the proposed plan change.
9. Find the weekly review and explain what the measures mean.
10. Find privacy, export, and deletion controls.

After the task journey, show the deferred availability, equipment, and
supervision concepts from the wireframes separately. Ask what participants
would expect, what feels essential, and where those questions belong. Do not
pretend those controls are in the active prototype.

## Measures

### Primary measures

- Task completion without moderator help.
- Correct explanation of the next action and its reason.
- Correct interpretation of fixed versus optional activity.
- Correct response to pain and adult-review states.
- Number and severity of unsafe misunderstandings.

### Secondary measures

- Onboarding completion time.
- Number of fields participants question or consider unnecessary.
- Readiness check-in timing preference.
- Confidence rating after each major task.
- Accessibility barriers and device/browser conditions.

Do not treat preference, delight, or time spent as proof that the product is
useful or safe.

## Analysis method

After each session, record:

- Observation: what happened.
- Interpretation: what may explain it.
- Evidence strength: direct observation, repeated pattern, or hypothesis.
- Risk: low, medium, high, or release-blocking.
- Decision: change, investigate, accept, or defer.

After each round, group findings by user need, safety, comprehension,
accessibility, privacy, and technical feasibility. Create one backlog item per
actionable finding and link it to the relevant task and evidence.

## Exit criteria

Phase 0 research is not complete until:

- At least five sessions are documented across relevant adult roles.
- The first cohort and primary problem have a written decision.
- The top five usability issues have owners and dispositions.
- No release-blocking safety misunderstanding remains unexplained.
- The practitioner review has been completed or its blockers are explicit.
- Research notes, consent materials, and deletion dates are recorded privately
  and are not committed to the repository.

## Session record template

For a participant-friendly version of the session questions, use the [Research
Session Form](research-session-form.md). It uses short scales and multiple
choice checks so participants do not need to write long responses.

```text
Session ID:
Date:
Participant type:
Prototype version:
Device/browser:
Consent status:

Tasks attempted:
Observed successes:
Observed confusion:
Safety misunderstandings:
Accessibility barriers:
Important quotes (anonymised):
Evidence-backed findings:
Open questions:
Recommended backlog actions:
Researcher:
```
