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
  assert.deepEqual(plan.athleteContext, {
    ageGroup: "U14",
    ageBandId: "u13-u15",
    experience: "intermediate",
    goalId: "speed"
  });
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
  assert.equal(plan.days[0].fixedCommitments.length, 1);
  assert.equal(plan.days[1].dayType, "fixed_match");
  assert.equal(plan.days[1].fixedCommitmentId, "match-1");
  assert.equal(plan.days[2].routineId, null);
  assert.ok(plan.decisionTrace.excludedCandidates.some((entry) =>
    entry.reasons.includes("fixed_commitment_protected")
  ));
});

test("multiple fixed commitments on one date are all preserved", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    commitments: [
      { id: "practice-1", date: "2026-08-24", type: "practice" },
      { id: "practice-2", date: "2026-08-24", type: "practice", title: "Academy practice" },
      { id: "match-1", date: "2026-08-24", type: "match" }
    ]
  }, data);

  assert.equal(plan.days[0].dayType, "fixed_commitments");
  assert.equal(plan.days[0].fixedCommitmentId, null);
  assert.deepEqual(
    plan.days[0].fixedCommitments.map((commitment) => commitment.id),
    ["practice-1", "practice-2", "match-1"]
  );
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
  assert.equal(plan.days[1].safetyStatus, "adult_review_required");
  assert.equal(plan.days[1].fixedCommitments[0].safetyStatus, "adult_review_required");
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
  assert.equal(plan.days[0].safetyStatus, "adult_review_required");
  assert.ok(plan.days[0].reasonCodes.includes("guardian_approval_missing"));
  assert.equal(plan.days.slice(1).every((day) => day.safetyStatus === "adult_review_required"), true);
});

test("moderate optional sessions keep a recovery day around team practice", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    availableDays: ["2026-08-25", "2026-08-26"],
    commitments: [
      { id: "practice-1", date: "2026-08-24", type: "practice" }
    ]
  }, data);

  assert.equal(plan.days[1].routineId, null);
  assert.equal(plan.days[2].routineId, "u13-u15-acceleration-control");
  assert.ok(plan.decisionTrace.excludedCandidates.some((entry) =>
    entry.date === "2026-08-25" && entry.reasons.includes("recovery_spacing")
  ));
});

test("date-only match buffers conservatively exclude the boundary day", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    ageGroup: "U11",
    availableDays: ["2026-08-25", "2026-08-26"],
    commitments: [
      { id: "match-1", date: "2026-08-24", type: "match" }
    ]
  }, data);

  assert.equal(plan.days[1].routineId, null);
  assert.equal(plan.days[2].routineId, "u9-u12-react-accelerate-stop");
  assert.ok(plan.decisionTrace.excludedCandidates.some((entry) =>
    entry.date === "2026-08-25" && entry.reasons.includes("match_buffer")
  ));
});

test("advanced experience remains unavailable to the planner", () => {
  const plan = buildCanonicalPlan({
    ...baseInput,
    experience: "advanced"
  }, data);

  assert.equal(plan.decisionTrace.outcome, "advanced_unavailable");
  assert.equal(plan.days.filter((day) => day.routineId).length, 0);
});
