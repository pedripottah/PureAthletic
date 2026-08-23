import { readFile } from "node:fs/promises";

export { selectYouthFootballRoutine } from "./youth-football-selector.mjs";

const dataDirectory = new URL("../data/youth-football/", import.meta.url);

async function readJson(fileName) {
  return JSON.parse(
    await readFile(new URL(fileName, dataDirectory), "utf8")
  );
}

export async function loadYouthFootballData() {
  const [sources, taxonomy, routineCatalog, recommendationIndex] =
    await Promise.all([
      readJson("sources.json"),
      readJson("taxonomy.json"),
      readJson("routine-catalog.json"),
      readJson("recommendation-index.json")
    ]);

  return {
    sources,
    taxonomy,
    routineCatalog,
    recommendationIndex,
    routines: routineCatalog.routines
  };
}

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();

  values.forEach((value) => {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  });

  return [...duplicates];
}

export function validateYouthFootballData({
  sources,
  taxonomy,
  routineCatalog,
  recommendationIndex
}) {
  const errors = [];
  const sourceIds = new Set(sources.sources.map((source) => source.id));
  const principleIds = new Set(
    sources.principles.map((principle) => principle.id)
  );
  const ageBands = new Map(
    taxonomy.ageBands.map((ageBand) => [ageBand.id, ageBand])
  );
  const goalIds = new Set(taxonomy.goals.map((goal) => goal.id));
  const levelIds = taxonomy.experienceLevels.map((level) => level.id);
  const routines = routineCatalog.routines;
  const routinesById = new Map(
    routines.map((routine) => [routine.id, routine])
  );

  duplicateValues(sources.sources.map((source) => source.id)).forEach((id) =>
    errors.push(`Duplicate source id: ${id}`)
  );
  duplicateValues(sources.principles.map((principle) => principle.id)).forEach(
    (id) => errors.push(`Duplicate principle id: ${id}`)
  );
  duplicateValues(taxonomy.supportedTeamAgeGroups).forEach((ageGroup) =>
    errors.push(`Duplicate team age group: ${ageGroup}`)
  );
  duplicateValues(routines.map((routine) => routine.id)).forEach((id) =>
    errors.push(`Duplicate routine id: ${id}`)
  );

  sources.principles.forEach((principle) => {
    principle.sourceIds.forEach((sourceId) => {
      if (!sourceIds.has(sourceId)) {
        errors.push(`${principle.id}: unknown source ${sourceId}`);
      }
    });
  });

  const indexedAgeGroups = taxonomy.ageBands.flatMap(
    (ageBand) => ageBand.teamAgeGroups
  );
  taxonomy.supportedTeamAgeGroups.forEach((ageGroup) => {
    if (!indexedAgeGroups.includes(ageGroup)) {
      errors.push(`${ageGroup}: missing from age bands`);
    }
  });

  routines.forEach((routine) => {
    const ageBand = ageBands.get(routine.ageBandId);
    if (!ageBand) {
      errors.push(`${routine.id}: unknown age band ${routine.ageBandId}`);
      return;
    }
    if (!goalIds.has(routine.goalId)) {
      errors.push(`${routine.id}: unknown goal ${routine.goalId}`);
    }
    if (!Array.isArray(routine.blocks) || routine.blocks.length !== 3) {
      errors.push(`${routine.id}: exactly three session blocks are required`);
    }
    if (
      !Array.isArray(routine.requiredEquipment)
      || !routine.requiredEquipment.length
    ) {
      errors.push(`${routine.id}: equipment metadata is required`);
    }

    levelIds.forEach((levelId) => {
      const duration = routine.durationMinutesByLevel[levelId];
      const intensity = routine.intensityByLevel[levelId];
      const targetRpe = routine.targetRpeByLevel[levelId];
      const progression = routine.levelProgressions[levelId];

      if (!Number.isFinite(duration)) {
        errors.push(`${routine.id}: missing ${levelId} duration`);
      } else if (
        duration < ageBand.sessionMinutes[0]
        || duration > ageBand.sessionMinutes[1]
      ) {
        errors.push(`${routine.id}: ${levelId} duration exceeds age-band limits`);
      }
      if (!["easy", "moderate"].includes(intensity)) {
        errors.push(`${routine.id}: ${levelId} intensity is not approved`);
      }
      if (
        !Array.isArray(targetRpe)
        || targetRpe[0] < 1
        || targetRpe[1] > ageBand.maximumTargetRpe
      ) {
        errors.push(`${routine.id}: ${levelId} RPE exceeds age-band limits`);
      }
      if (typeof progression !== "string" || !progression.trim()) {
        errors.push(`${routine.id}: ${levelId} progression is required`);
      }
    });

    routine.sourcePrincipleIds.forEach((principleId) => {
      if (!principleIds.has(principleId)) {
        errors.push(`${routine.id}: unknown source principle ${principleId}`);
      }
    });
  });

  for (const ageBand of taxonomy.ageBands) {
    const bandIndex = recommendationIndex.index[ageBand.id];
    if (!bandIndex) {
      errors.push(`${ageBand.id}: recommendation index is missing`);
      continue;
    }

    for (const levelId of levelIds) {
      const levelIndex = bandIndex[levelId];
      if (!levelIndex) {
        errors.push(`${ageBand.id}/${levelId}: recommendation index is missing`);
        continue;
      }
      if (levelId === "advanced" && levelIndex.status !== "research_only") {
        errors.push(`${ageBand.id}: advanced index must remain research-only`);
      }

      for (const goalId of goalIds) {
        const routineId = levelIndex[goalId];
        const routine = routinesById.get(routineId);

        if (!routine) {
          errors.push(
            `${ageBand.id}/${levelId}/${goalId}: unknown routine ${routineId}`
          );
          continue;
        }
        if (
          routine.ageBandId !== ageBand.id
          || routine.goalId !== goalId
        ) {
          errors.push(
            `${ageBand.id}/${levelId}/${goalId}: routine metadata does not match`
          );
        }
      }
    }
  }

  const advancedLevel = taxonomy.experienceLevels.find(
    (level) => level.id === "advanced"
  );
  if (advancedLevel?.productStatus !== "research_only") {
    errors.push("Advanced experience must remain research-only");
  }
  if (
    recommendationIndex.advancedProductStatus
    !== "research_only_not_selectable"
  ) {
    errors.push("Advanced recommendation index must remain non-selectable");
  }

  return {
    valid: errors.length === 0,
    errors,
    counts: {
      sources: sources.sources.length,
      principles: sources.principles.length,
      ageBands: taxonomy.ageBands.length,
      goals: taxonomy.goals.length,
      routines: routines.length,
      indexedCombinations:
        taxonomy.ageBands.length * levelIds.length * taxonomy.goals.length
    }
  };
}
