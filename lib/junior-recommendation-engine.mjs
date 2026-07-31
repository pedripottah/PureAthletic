const INTENSITY_RANK = {
  easy: 1,
  moderate: 2
};

const PERFORMANCE_SESSION_TYPES = new Set([
  "strength",
  "speed",
  "movement",
  "conditioning",
  "mixed"
]);

function requireFiniteNumber(value, field) {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${field} must be a finite number`);
  }
}

function requireNumberInRange(value, field, minimum, maximum) {
  requireFiniteNumber(value, field);

  if (value < minimum || value > maximum) {
    throw new RangeError(`${field} must be between ${minimum} and ${maximum}`);
  }
}

function requireOptionalBoolean(value, field) {
  if (value !== undefined && typeof value !== "boolean") {
    throw new TypeError(`${field} must be a boolean`);
  }
}

function normalizeOptionalHours(value, field) {
  if (value === undefined || value === null) {
    return Number.POSITIVE_INFINITY;
  }

  requireFiniteNumber(value, field);
  if (value < 0) {
    throw new RangeError(`${field} cannot be negative`);
  }

  return value;
}

function normalizeContext(context) {
  if (!context || typeof context !== "object" || Array.isArray(context)) {
    throw new TypeError("context must be an object");
  }

  requireOptionalBoolean(
    context.guardianPermissionConfirmed,
    "guardianPermissionConfirmed"
  );
  requireOptionalBoolean(
    context.qualifiedSupervisionAvailable,
    "qualifiedSupervisionAvailable"
  );
  requireOptionalBoolean(context.healthConcern, "healthConcern");

  if (
    context.redFlagSymptoms !== undefined
    && !Array.isArray(context.redFlagSymptoms)
  ) {
    throw new TypeError("redFlagSymptoms must be an array");
  }
  if (
    context.equipment !== undefined
    && !Array.isArray(context.equipment)
  ) {
    throw new TypeError("equipment must be an array");
  }

  const normalized = {
    age: context.age,
    guardianPermissionConfirmed: context.guardianPermissionConfirmed === true,
    qualifiedSupervisionAvailable: context.qualifiedSupervisionAvailable === true,
    painLevel: context.painLevel || "none",
    healthConcern: context.healthConcern === true,
    redFlagSymptoms: Array.isArray(context.redFlagSymptoms)
      ? context.redFlagSymptoms
      : [],
    energy: context.energy ?? 3,
    soreness: context.soreness ?? 2,
    sleep: context.sleep ?? 3,
    hoursUntilMatch: normalizeOptionalHours(
      context.hoursUntilMatch,
      "hoursUntilMatch"
    ),
    hoursSinceHighLoad: normalizeOptionalHours(
      context.hoursSinceHighLoad,
      "hoursSinceHighLoad"
    ),
    availableMinutes: context.availableMinutes ?? 30,
    equipment: Array.isArray(context.equipment) ? context.equipment : [],
    goal: context.goal || "general_fitness",
    experience: context.experience || "beginner",
    independentPerformanceSessionsLast7Days:
      context.independentPerformanceSessionsLast7Days ?? 0
  };

  requireNumberInRange(normalized.age, "age", 0, 120);
  requireNumberInRange(normalized.energy, "energy", 1, 5);
  requireNumberInRange(normalized.soreness, "soreness", 1, 5);
  requireNumberInRange(normalized.sleep, "sleep", 1, 5);
  requireNumberInRange(
    normalized.availableMinutes,
    "availableMinutes",
    0,
    1440
  );
  requireNumberInRange(
    normalized.independentPerformanceSessionsLast7Days,
    "independentPerformanceSessionsLast7Days",
    0,
    21
  );

  if (!Number.isInteger(normalized.independentPerformanceSessionsLast7Days)) {
    throw new TypeError(
      "independentPerformanceSessionsLast7Days must be an integer"
    );
  }
  if (!["none", "mild", "moderate", "severe"].includes(normalized.painLevel)) {
    throw new TypeError("painLevel is not recognized");
  }
  if (
    !normalized.redFlagSymptoms.every(
      (symptom) => typeof symptom === "string" && symptom.length > 0
    )
  ) {
    throw new TypeError("redFlagSymptoms must contain non-empty strings");
  }
  if (
    !normalized.equipment.every(
      (item) => typeof item === "string" && item.length > 0
    )
  ) {
    throw new TypeError("equipment must contain non-empty strings");
  }

  return normalized;
}

function allEquipmentAvailable(requiredEquipment, availableEquipment) {
  const available = new Set(availableEquipment);
  return requiredEquipment.every((item) => available.has(item));
}

function supervisionAvailable(routine, context) {
  return routine.supervision !== "qualified_coach"
    || context.qualifiedSupervisionAvailable;
}

function scoreRoutine(routine, context) {
  let score = 0;

  if (routine.goals.includes(context.goal)) score += 30;
  if (routine.goals.includes("match_readiness")) score += 5;
  if (routine.experienceLevels.includes(context.experience)) score += 6;

  score -= Math.abs(context.availableMinutes - routine.durationMinutes) / 3;
  score -= routine.requiredEquipment.length * 0.2;

  if (routine.intensity === "easy" && context.energy <= 3) score += 4;
  if (
    PERFORMANCE_SESSION_TYPES.has(routine.sessionType)
    && context.independentPerformanceSessionsLast7Days === 0
  ) {
    score += 2;
  }

  return score;
}

function hardStopForContext(context, safetyRules) {
  const { population, hardStops } = safetyRules;

  if (
    context.age < population.minimumAge
    || context.age > population.maximumAge
  ) {
    return {
      action: "not_eligible",
      reasonCodes: ["age_outside_junior_library"],
      message: `This draft library is only defined for ages ${population.minimumAge}–${population.maximumAge}.`
    };
  }

  if (
    population.guardianPermissionRequired
    && !context.guardianPermissionConfirmed
  ) {
    return {
      action: "guardian_permission_required",
      reasonCodes: ["guardian_permission_missing"],
      message: safetyRules.requiredMessages.guardian
    };
  }

  const painNeedsReview = hardStops.painLevelsRequiringAdultReview
    .includes(context.painLevel);
  const hasReportedRedFlag = context.redFlagSymptoms.length > 0;

  if (
    painNeedsReview
    || (hardStops.healthConcernRequiresAdultReview && context.healthConcern)
    || (hardStops.redFlagSymptomsRequireAdultReview && hasReportedRedFlag)
  ) {
    return {
      action: "adult_review_required",
      reasonCodes: [
        painNeedsReview ? "pain_reported" : null,
        context.healthConcern ? "health_concern_reported" : null,
        hasReportedRedFlag ? "red_flag_symptom_reported" : null
      ].filter(Boolean),
      message: hardStops.message
    };
  }

  return null;
}

function activeRestrictions(context, safetyRules) {
  const restrictions = [];
  const readiness = safetyRules.readinessRules;

  if (
    context.energy <= readiness.lowEnergyAtOrBelow
    || context.soreness >= readiness.highSorenessAtOrAbove
    || context.sleep <= readiness.lowSleepAtOrBelow
  ) {
    restrictions.push({
      code: "low_readiness",
      allowedSessionTypes: readiness.restrictedSessionTypes,
      maximumIntensity: "easy",
      maximumDurationMinutes: safetyRules.matchRules.maximumDurationMinutes
    });
  }

  if (context.hoursUntilMatch < safetyRules.matchRules.protectedWindowHours) {
    restrictions.push({
      code: "match_within_protected_window",
      allowedSessionTypes: safetyRules.matchRules.allowedSessionTypes,
      maximumIntensity: safetyRules.matchRules.maximumIntensity,
      maximumDurationMinutes: safetyRules.matchRules.maximumDurationMinutes
    });
  }

  if (
    context.hoursSinceHighLoad
    < safetyRules.recentLoadRules.highLoadRecoveryWindowHours
  ) {
    restrictions.push({
      code: "recent_high_load",
      allowedSessionTypes: safetyRules.recentLoadRules.allowedSessionTypes,
      maximumIntensity: safetyRules.recentLoadRules.maximumIntensity,
      maximumDurationMinutes: safetyRules.matchRules.maximumDurationMinutes
    });
  }

  if (
    context.independentPerformanceSessionsLast7Days
    >= safetyRules.weeklyRules.maximumIndependentPerformanceSessions
  ) {
    restrictions.push({
      code: "weekly_independent_session_cap",
      allowedSessionTypes: ["recovery", "technical"],
      maximumIntensity: "easy",
      maximumDurationMinutes: safetyRules.matchRules.maximumDurationMinutes
    });
  }

  return restrictions;
}

function routineMeetsRestrictions(routine, restrictions) {
  return restrictions.every((restriction) => {
    const allowedType = restriction.allowedSessionTypes
      .includes(routine.sessionType);
    const allowedIntensity =
      INTENSITY_RANK[routine.intensity]
      <= INTENSITY_RANK[restriction.maximumIntensity];
    const allowedDuration =
      routine.durationMinutes <= restriction.maximumDurationMinutes;

    return allowedType && allowedIntensity && allowedDuration;
  });
}

export function recommendJuniorRoutines(
  rawContext,
  { routines, safetyRules, limit = 3 }
) {
  if (!Array.isArray(routines)) {
    throw new TypeError("routines must be an array");
  }
  if (!safetyRules || typeof safetyRules !== "object") {
    throw new TypeError("safetyRules must be an object");
  }
  if (!Number.isInteger(limit) || limit < 1 || limit > 10) {
    throw new RangeError("limit must be an integer between 1 and 10");
  }

  const context = normalizeContext(rawContext);
  const hardStop = hardStopForContext(context, safetyRules);

  if (hardStop) {
    return {
      ...hardStop,
      recommendations: [],
      requiredMessages: safetyRules.requiredMessages
    };
  }

  const knownGoals = new Set(routines.flatMap((routine) => routine.goals));
  const knownExperienceLevels = new Set(
    routines.flatMap((routine) => routine.experienceLevels)
  );

  if (!knownGoals.has(context.goal)) {
    throw new TypeError(`goal is not recognized: ${context.goal}`);
  }
  if (!knownExperienceLevels.has(context.experience)) {
    throw new TypeError(
      `experience is not recognized: ${context.experience}`
    );
  }

  const restrictions = activeRestrictions(context, safetyRules);
  const excluded = [];

  const allowed = routines.filter((routine) => {
    const reasons = [];

    if (
      context.age < routine.ageRange[0]
      || context.age > routine.ageRange[1]
    ) {
      reasons.push("age");
    }
    if (!routine.experienceLevels.includes(context.experience)) {
      reasons.push("experience");
    }
    if (routine.durationMinutes > context.availableMinutes) {
      reasons.push("available_time");
    }
    if (!allEquipmentAvailable(routine.requiredEquipment, context.equipment)) {
      reasons.push("equipment");
    }
    if (!supervisionAvailable(routine, context)) {
      reasons.push("qualified_supervision");
    }
    if (context.hoursUntilMatch < routine.matchBufferHours) {
      reasons.push("routine_match_buffer");
    }
    if (context.hoursSinceHighLoad < routine.minimumHoursAfterHighLoad) {
      reasons.push("routine_recovery_buffer");
    }
    if (!routineMeetsRestrictions(routine, restrictions)) {
      reasons.push("active_restriction");
    }

    if (reasons.length) {
      excluded.push({ routineId: routine.id, reasons });
      return false;
    }

    return true;
  });

  const recommendations = allowed
    .map((routine) => ({
      routine,
      score: scoreRoutine(routine, context)
    }))
    .sort((left, right) =>
      right.score - left.score
      || left.routine.id.localeCompare(right.routine.id)
    )
    .slice(0, limit)
    .map(({ routine }) => routine);

  if (!recommendations.length) {
    return {
      action: "rest",
      reasonCodes: [
        ...restrictions.map((restriction) => restriction.code),
        "no_compatible_routine"
      ],
      message: "No approved routine fits the current constraints. Rest or follow guidance from a responsible adult or qualified coach.",
      recommendations: [],
      excluded,
      requiredMessages: safetyRules.requiredMessages
    };
  }

  return {
    action: "recommend",
    reasonCodes: restrictions.map((restriction) => restriction.code),
    message: restrictions.length
      ? "Only routines compatible with the active recovery and scheduling limits are shown."
      : "These routines match the supplied goal, time, equipment, and supervision constraints.",
    recommendations,
    excluded,
    requiredMessages: safetyRules.requiredMessages
  };
}
