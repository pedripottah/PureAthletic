function titleCase(value) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Select one reviewed routine using only serializable catalog data.
 *
 * Keeping this module free of Node APIs lets the browser and Node validation
 * suites use the same selection boundary.
 */
export function selectYouthFootballRoutine(
  { ageGroup, experience, goal },
  { taxonomy, routineCatalog, recommendationIndex }
) {
  const normalizedAgeGroup = String(ageGroup || "").toUpperCase();
  const normalizedExperience = String(experience || "").toLowerCase();
  const normalizedGoal = String(goal || "").toLowerCase();
  const ageBand = taxonomy.ageBands.find((candidate) =>
    candidate.teamAgeGroups.includes(normalizedAgeGroup)
  );
  const experienceLevel = taxonomy.experienceLevels.find(
    (candidate) => candidate.id === normalizedExperience
  );
  const goalDefinition = taxonomy.goals.find(
    (candidate) => candidate.id === normalizedGoal
  );

  if (!ageBand) {
    throw new RangeError(`Unsupported team age group: ${ageGroup}`);
  }
  if (!experienceLevel) {
    throw new TypeError(`Unsupported experience level: ${experience}`);
  }
  if (!goalDefinition) {
    throw new TypeError(`Unsupported goal: ${goal}`);
  }
  if (experienceLevel.productStatus !== "available") {
    return {
      action: "advanced_unavailable",
      message:
        experienceLevel.userMessage
        || "This experience level is not available yet.",
      recommendation: null
    };
  }

  const routineId =
    recommendationIndex.index[ageBand.id][normalizedExperience][normalizedGoal];
  const routine = routineCatalog.routines.find(
    (candidate) => candidate.id === routineId
  );

  if (!routine) {
    throw new Error(`Indexed routine is missing: ${routineId}`);
  }

  return {
    action: "recommend",
    message: `Selected for ${normalizedAgeGroup}, ${experienceLevel.label}, and ${goalDefinition.label}.`,
    recommendation: {
      id: routine.id,
      ageBandId: routine.ageBandId,
      ageGroup: normalizedAgeGroup,
      goalId: routine.goalId,
      goalLabel: goalDefinition.label,
      experience: normalizedExperience,
      type: titleCase(routine.sessionType),
      title: routine.title,
      duration: routine.durationMinutesByLevel[normalizedExperience],
      intensity: titleCase(routine.intensityByLevel[normalizedExperience]),
      targetRpe: routine.targetRpeByLevel[normalizedExperience],
      status: "Planned",
      purpose: routine.purpose,
      supervision: routine.supervision,
      requiredEquipment: routine.requiredEquipment,
      matchBufferHours: routine.matchBufferHours,
      progression: routine.levelProgressions[normalizedExperience],
      sourcePrincipleIds: routine.sourcePrincipleIds,
      activities: routine.blocks.map((block) => ({
        name: block.title,
        detail: block.activities.join(" ")
      }))
    }
  };
}
