import assert from "node:assert/strict";
import test from "node:test";

import {
  loadYouthFootballData,
  selectYouthFootballRoutine,
  validateYouthFootballData
} from "../lib/youth-football-catalog.mjs";

const data = await loadYouthFootballData();

test("the U5-U17 football catalog is complete and internally consistent", () => {
  const result = validateYouthFootballData(data);

  assert.deepEqual(result.errors, []);
  assert.equal(result.valid, true);
  assert.equal(result.counts.ageBands, 4);
  assert.equal(result.counts.goals, 5);
  assert.equal(result.counts.routines, 20);
  assert.equal(result.counts.indexedCombinations, 60);
});

for (const ageBand of data.taxonomy.ageBands) {
  for (const level of ["beginner", "intermediate"]) {
    for (const goal of data.taxonomy.goals) {
      test(`${ageBand.id}/${level}/${goal.id} resolves to matching content`, () => {
        const result = selectYouthFootballRoutine(
          {
            ageGroup: ageBand.teamAgeGroups[0],
            experience: level,
            goal: goal.id
          },
          data
        );

        assert.equal(result.action, "recommend");
        assert.equal(result.recommendation.ageBandId, ageBand.id);
        assert.equal(result.recommendation.goalId, goal.id);
        assert.equal(result.recommendation.experience, level);
        assert.ok(result.recommendation.activities.length === 3);
      });
    }
  }
}

test("the advanced catalog remains researched but cannot be recommended", () => {
  for (const ageBand of data.taxonomy.ageBands) {
    for (const goal of data.taxonomy.goals) {
      const indexedRoutine =
        data.recommendationIndex.index[ageBand.id].advanced[goal.id];
      assert.ok(indexedRoutine, `${ageBand.id}/${goal.id} lacks advanced data`);

      const result = selectYouthFootballRoutine(
        {
          ageGroup: ageBand.teamAgeGroups[0],
          experience: "advanced",
          goal: goal.id
        },
        data
      );

      assert.equal(result.action, "advanced_unavailable");
      assert.equal(result.recommendation, null);
    }
  }
});

test("goal selection changes the resulting routine", () => {
  const common = {
    ageGroup: "U14",
    experience: "intermediate"
  };
  const strength = selectYouthFootballRoutine(
    { ...common, goal: "strength" },
    data
  );
  const speed = selectYouthFootballRoutine(
    { ...common, goal: "speed" },
    data
  );

  assert.notEqual(
    strength.recommendation.id,
    speed.recommendation.id
  );
  assert.equal(strength.recommendation.goalId, "strength");
  assert.equal(speed.recommendation.goalId, "speed");
});

test("unsupported age groups and levels fail closed", () => {
  assert.throws(
    () =>
      selectYouthFootballRoutine(
        { ageGroup: "U18", experience: "beginner", goal: "speed" },
        data
      ),
    /Unsupported team age group/
  );
  assert.throws(
    () =>
      selectYouthFootballRoutine(
        { ageGroup: "U12", experience: "elite", goal: "speed" },
        data
      ),
    /Unsupported experience level/
  );
});

test("unsupported goals fail closed", () => {
  assert.throws(
    () =>
      selectYouthFootballRoutine(
        { ageGroup: "U12", experience: "beginner", goal: "elite" },
        data
      ),
    /Unsupported goal/
  );
});
