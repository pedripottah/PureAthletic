import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCanonicalPlan,
  canonicalPlannerVersions
} from "../lib/canonical-planner.mjs";
import { loadYouthFootballData } from "../lib/youth-football-catalog.mjs";

const data = await loadYouthFootballData();

const baseInput = {
  startDate: "2026-08-24",
  ageGroup: "U14",
  experience: "intermediate",
  goal: "speed",
  guardianApproval: true,
  qualifiedSupervisionAvailable: true,
  equipment: ["markers", "safe_open_space"]
};

test("canonical planner schedules approved content on an available day", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    availableDays: ["2026-08-25", "2026-08-27"]
  }, data);

  assert.equal(plan.planVersion, canonicalPlannerVersions.plan);
  assert.equal(plan.decisionTrace.outcome, "routine_scheduled");
  assert.equal(plan.days.length, 7);
  assert.equal(plan.days.filter((day) => day.routineId).length, 1);
  assert.equal(plan.days[1].date, "2026-08-25");
  assert.equal(plan.days[1].routineId, "u13-u15-acceleration-control");
  assert.deepEqual(plan.days[1].reasonCodes, ["goal_fit", "available_day", "approved_content"]);
});

test("fixed practices and matches remain protected", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    availableDays: ["2026-08-24", "2026-08-25", "2026-08-26"],
    commitments: [
      { id: "practice-1", date: "2026-08-24", type: "practice" },
      { id: "match-1", date: "2026-08-25", type: "match", title: "Saturday match" }
    ]
  }, data);

  assert.equal(plan.days[0].dayType, "fixed_practice");
  assert.equal(plan.days[0].fixedCommitmentId, "practice-1");
  assert.equal(plan.days[1].dayType, "fixed_match");
  assert.equal(plan.days[1].fixedCommitmentId, "match-1");
  assert.equal(plan.days[2].routineId, null);
  assert.ok(plan.decisionTrace.excludedCandidates.some((entry) =>
    entry.reasons.includes("fixed_commitment_protected")
  ));
});

test("reported pain creates adult-review days and no routine", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    painLevel: "mild",
    commitments: [{ id: "match-1", date: "2026-08-25", type: "match" }],
    availableDays: ["2026-08-24", "2026-08-25"]
  }, data);

  assert.equal(plan.decisionTrace.outcome, "adult_review_required");
  assert.equal(plan.days.filter((day) => day.routineId).length, 0);
  assert.equal(plan.days[0].safetyStatus, "adult_review_required");
  assert.ok(plan.days[0].reasonCodes.includes("pain_reported"));
  assert.equal(plan.days[1].dayType, "fixed_match");
});

test("low readiness falls back without creating a performance session", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    readiness: { sleep: 2, energy: 2, soreness: 3 },
    availableDays: ["2026-08-24", "2026-08-25"]
  }, data);

  assert.equal(plan.decisionTrace.outcome, "recovery_or_rest");
  assert.equal(plan.decisionTrace.fallbackUsed, true);
  assert.equal(plan.days.filter((day) => day.routineId).length, 0);
  assert.equal(plan.days[0].dayType, "recovery_or_rest");
  assert.ok(plan.days[0].reasonCodes.includes("low_readiness"));
  assert.deepEqual(plan.decisionTrace.excludedCandidates[0].reasons, ["low_readiness"]);
});

test("missing equipment produces a safe no-candidate plan", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    equipment: [],
    availableDays: ["2026-08-24"]
  }, data);

  assert.equal(plan.decisionTrace.outcome, "no_safe_candidate");
  assert.equal(plan.decisionTrace.fallbackUsed, true);
  assert.equal(plan.days.filter((day) => day.routineId).length, 0);
  assert.ok(plan.decisionTrace.excludedCandidates.some((entry) =>
    entry.reasons.includes("equipment_unavailable")
  ));
});

test("guardian approval is a hard stop", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    guardianApproval: false,
    commitments: [{ id: "practice-1", date: "2026-08-24", type: "practice" }]
  }, data);

  assert.equal(plan.decisionTrace.outcome, "guardian_approval_required");
  assert.equal(plan.days[0].dayType, "fixed_practice");
  assert.equal(plan.days.slice(1).every((day) => day.safetyStatus === "adult_review_required"), true);
});

test("advanced experience remains unavailable to the planner", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    experience: "advanced"
  }, data);

  assert.equal(plan.decisionTrace.outcome, "advanced_unavailable");
  assert.equal(plan.days.filter((day) => day.routineId).length, 0);
});
