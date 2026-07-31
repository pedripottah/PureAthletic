import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { recommendJuniorRoutines } from "../lib/junior-recommendation-engine.mjs";
import {
  loadJuniorTrainingLibrary,
  validateJuniorTrainingLibrary
} from "../lib/junior-training-library.mjs";

const intensityRank = {
  easy: 1,
  moderate: 2
};

const library = await loadJuniorTrainingLibrary();
const scenarioDocument = JSON.parse(
  await readFile(
    new URL("../data/junior/evaluation-scenarios.json", import.meta.url),
    "utf8"
  )
);

test("the junior content library passes structural and safety validation", () => {
  const result = validateJuniorTrainingLibrary(library);

  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.counts.exercises, 20);
  assert.equal(result.counts.routines, 10);
});

test("medical and performance-claim boundaries remain disabled", () => {
  const boundaries = library.safetyRules.contentBoundaries;

  assert.equal(boundaries.medicalDiagnosis, false);
  assert.equal(boundaries.injuryRehabilitation, false);
  assert.equal(boundaries.returnToPlayClearance, false);
  assert.equal(boundaries.weightLossPrescription, false);
  assert.equal(boundaries.supplementAdvice, false);
  assert.equal(boundaries.guaranteedPerformanceClaims, false);
});

for (const scenario of scenarioDocument.scenarios) {
  test(`recommendation scenario: ${scenario.id}`, () => {
    const result = recommendJuniorRoutines(scenario.context, {
      routines: library.routines,
      safetyRules: library.safetyRules
    });
    const recommendationIds = result.recommendations.map(
      (routine) => routine.id
    );

    assert.equal(result.action, scenario.expected.action);

    for (const reasonCode of scenario.expected.reasonCodes || []) {
      assert.ok(
        result.reasonCodes.includes(reasonCode),
        `Expected reason code ${reasonCode}; received ${result.reasonCodes.join(", ")}`
      );
    }

    for (const routineId of scenario.expected.expectedRoutineIds || []) {
      assert.ok(
        recommendationIds.includes(routineId),
        `Expected ${routineId}; received ${recommendationIds.join(", ")}`
      );
    }

    if (scenario.expected.expectedFirstRoutineId) {
      assert.equal(
        recommendationIds[0],
        scenario.expected.expectedFirstRoutineId
      );
    }

    for (const routine of result.recommendations) {
      if (scenario.expected.allowedSessionTypes) {
        assert.ok(
          scenario.expected.allowedSessionTypes.includes(routine.sessionType),
          `${routine.id} has disallowed session type ${routine.sessionType}`
        );
      }

      if (scenario.expected.maximumIntensity) {
        assert.ok(
          intensityRank[routine.intensity]
            <= intensityRank[scenario.expected.maximumIntensity],
          `${routine.id} exceeds ${scenario.expected.maximumIntensity} intensity`
        );
      }
    }

    const expectedExclusion = scenario.expected.excludedRoutineReason;
    if (expectedExclusion) {
      const exclusion = result.excluded.find(
        (entry) => entry.routineId === expectedExclusion.routineId
      );

      assert.ok(exclusion, `${expectedExclusion.routineId} was not excluded`);
      assert.ok(exclusion.reasons.includes(expectedExclusion.reason));
    }
  });
}

test("recommendations are deterministic for the same athlete context", () => {
  const context = scenarioDocument.scenarios.find(
    (scenario) => scenario.id === "strength-goal-with-qualified-supervision"
  ).context;
  const options = {
    routines: library.routines,
    safetyRules: library.safetyRules
  };

  assert.deepEqual(
    recommendJuniorRoutines(context, options),
    recommendJuniorRoutines(context, options)
  );
});

test("malformed readiness and safety inputs fail closed", () => {
  const options = {
    routines: library.routines,
    safetyRules: library.safetyRules
  };
  const baseContext = {
    age: 14,
    guardianPermissionConfirmed: true,
    qualifiedSupervisionAvailable: true,
    painLevel: "none",
    equipment: [],
    availableMinutes: 30
  };

  assert.throws(
    () => recommendJuniorRoutines({ ...baseContext, painLevel: "unknown" }, options),
    /painLevel is not recognized/
  );
  assert.throws(
    () => recommendJuniorRoutines({ ...baseContext, energy: 8 }, options),
    /energy must be between 1 and 5/
  );
  assert.throws(
    () =>
      recommendJuniorRoutines(
        { ...baseContext, healthConcern: "no" },
        options
      ),
    /healthConcern must be a boolean/
  );
  assert.throws(
    () =>
      recommendJuniorRoutines(
        { ...baseContext, hoursUntilMatch: -1 },
        options
      ),
    /hoursUntilMatch cannot be negative/
  );
});

test("any reported red-flag symptom requires adult review", () => {
  const result = recommendJuniorRoutines(
    {
      age: 14,
      guardianPermissionConfirmed: true,
      qualifiedSupervisionAvailable: true,
      painLevel: "none",
      redFlagSymptoms: ["other_concerning_symptom"],
      equipment: [],
      availableMinutes: 30
    },
    {
      routines: library.routines,
      safetyRules: library.safetyRules
    }
  );

  assert.equal(result.action, "adult_review_required");
  assert.ok(result.reasonCodes.includes("red_flag_symptom_reported"));
  assert.deepEqual(result.recommendations, []);
});
