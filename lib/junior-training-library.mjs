import { readFile } from "node:fs/promises";

const dataDirectory = new URL("../data/junior/", import.meta.url);
const PERFORMANCE_SESSION_TYPES = new Set([
  "strength",
  "speed",
  "movement",
  "conditioning",
  "mixed"
]);

async function readJson(fileName) {
  const source = await readFile(new URL(fileName, dataDirectory), "utf8");
  return JSON.parse(source);
}

export async function loadJuniorTrainingLibrary() {
  const [exerciseDocument, routineDocument, safetyRules] = await Promise.all([
    readJson("exercises.json"),
    readJson("routines.json"),
    readJson("safety-rules.json")
  ]);

  return {
    exerciseDocument,
    routineDocument,
    safetyRules,
    exercises: exerciseDocument.exercises,
    routines: routineDocument.routines
  };
}

function duplicateIds(items) {
  const seen = new Set();
  const duplicates = new Set();

  items.forEach((item) => {
    if (seen.has(item.id)) duplicates.add(item.id);
    seen.add(item.id);
  });

  return [...duplicates];
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function validateJuniorTrainingLibrary({
  exerciseDocument,
  routineDocument,
  safetyRules
}) {
  const errors = [];
  const exercises = exerciseDocument?.exercises || [];
  const routines = routineDocument?.routines || [];
  const exerciseIds = new Set(exercises.map((exercise) => exercise.id));
  const routineIds = new Set(routines.map((routine) => routine.id));
  const allowedIntensities = new Set(
    safetyRules?.sessionRules?.allowedIntensityLevels || []
  );
  const qualifiedCoachSessionTypes = new Set(
    safetyRules?.supervisionRules?.qualifiedCoachSessionTypes || []
  );

  duplicateIds(exercises).forEach((id) =>
    errors.push(`Duplicate exercise id: ${id}`)
  );
  duplicateIds(routines).forEach((id) =>
    errors.push(`Duplicate routine id: ${id}`)
  );

  exercises.forEach((exercise) => {
    if (!isNonEmptyString(exercise.id)) {
      errors.push("Exercise is missing an id");
    }
    if (!isNonEmptyString(exercise.name)) {
      errors.push(`${exercise.id}: exercise name is required`);
    }
    if (!Array.isArray(exercise.instructions) || !exercise.instructions.length) {
      errors.push(`${exercise.id}: instructions are required`);
    }
    if (!Array.isArray(exercise.coachingCues) || !exercise.coachingCues.length) {
      errors.push(`${exercise.id}: coaching cues are required`);
    }
    if (!["guardian_nearby", "qualified_coach"].includes(exercise.supervision)) {
      errors.push(`${exercise.id}: invalid supervision level`);
    }
    if (
      !exercise.defaultDose
      || typeof exercise.defaultDose !== "object"
      || !Object.keys(exercise.defaultDose).length
    ) {
      errors.push(`${exercise.id}: default dose is required`);
    }
  });

  routines.forEach((routine) => {
    if (!isNonEmptyString(routine.id)) {
      errors.push("Routine is missing an id");
    }
    if (!isNonEmptyString(routine.title)) {
      errors.push(`${routine.id}: title is required`);
    }
    if (
      !Array.isArray(routine.ageRange)
      || routine.ageRange[0] < safetyRules.population.minimumAge
      || routine.ageRange[1] > safetyRules.population.maximumAge
    ) {
      errors.push(`${routine.id}: age range exceeds the junior library boundary`);
    }
    if (
      routine.durationMinutes < safetyRules.sessionRules.minimumDurationMinutes
      || routine.durationMinutes > safetyRules.sessionRules.maximumDurationMinutes
    ) {
      errors.push(`${routine.id}: duration is outside the approved range`);
    }
    if (!allowedIntensities.has(routine.intensity)) {
      errors.push(`${routine.id}: intensity is not approved`);
    }
    if (
      qualifiedCoachSessionTypes.has(routine.sessionType)
      && routine.supervision !== "qualified_coach"
    ) {
      errors.push(
        `${routine.id}: ${routine.sessionType} sessions require a qualified coach`
      );
    }
    if (
      PERFORMANCE_SESSION_TYPES.has(routine.sessionType)
      && routine.maximumSessionsPerWeek
        > safetyRules.weeklyRules.maximumIndependentPerformanceSessions
    ) {
      errors.push(
        `${routine.id}: maximum sessions exceed the independent weekly cap`
      );
    }
    if (
      routine.targetRpeRange[0]
        < safetyRules.sessionRules.allowedTargetRpeMinimum
      || routine.targetRpeRange[1]
        > safetyRules.sessionRules.allowedTargetRpeMaximum
    ) {
      errors.push(`${routine.id}: target RPE is outside the approved range`);
    }
    if (!Array.isArray(routine.blocks) || routine.blocks.length < 3) {
      errors.push(`${routine.id}: warm-up, main, and cool-down blocks are required`);
      return;
    }
    if (routine.blocks[0].role !== "warm_up") {
      errors.push(`${routine.id}: first block must be a warm-up`);
    }
    if (routine.blocks.at(-1).role !== "cool_down") {
      errors.push(`${routine.id}: last block must be a cool-down`);
    }

    const routineEquipment = new Set(routine.requiredEquipment);

    routine.blocks.forEach((block) => {
      if (!Array.isArray(block.items) || !block.items.length) {
        errors.push(`${routine.id}: ${block.role} block must contain exercises`);
        return;
      }

      block.items.forEach((item) => {
        if (!exerciseIds.has(item.exerciseId)) {
          errors.push(
            `${routine.id}: unknown exercise reference ${item.exerciseId}`
          );
          return;
        }

        const exercise = exercises.find(
          (candidate) => candidate.id === item.exerciseId
        );
        exercise.requiredEquipment.forEach((equipment) => {
          if (!routineEquipment.has(equipment)) {
            errors.push(
              `${routine.id}: requiredEquipment is missing ${equipment} for ${exercise.id}`
            );
          }
        });

        if (
          exercise.supervision === "qualified_coach"
          && routine.supervision !== "qualified_coach"
        ) {
          errors.push(
            `${routine.id}: ${exercise.id} requires qualified coach supervision`
          );
        }
      });
    });

    if (
      routine.shorterVersionId
      && !routineIds.has(routine.shorterVersionId)
    ) {
      errors.push(
        `${routine.id}: unknown shorter version ${routine.shorterVersionId}`
      );
    }
  });

  routines.forEach((routine) => {
    if (!routine.shorterVersionId) return;
    const shorterRoutine = routines.find(
      (candidate) => candidate.id === routine.shorterVersionId
    );
    if (
      shorterRoutine
      && shorterRoutine.durationMinutes >= routine.durationMinutes
    ) {
      errors.push(
        `${routine.id}: shorter version must have a lower duration`
      );
    }
  });

  if (!safetyRules?.releaseGates?.qualifiedSportsPractitionerReview) {
    errors.push("Safety rules must require practitioner review");
  }
  if (!safetyRules?.releaseGates?.childSafeguardingReview) {
    errors.push("Safety rules must require child safeguarding review");
  }
  if (!safetyRules?.releaseGates?.guardianConsentFlow) {
    errors.push("Safety rules must require a guardian consent flow");
  }

  return {
    valid: errors.length === 0,
    errors,
    counts: {
      exercises: exercises.length,
      routines: routines.length
    }
  };
}
