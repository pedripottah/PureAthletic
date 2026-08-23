import { selectYouthFootballRoutine } from "./youth-football-selector.mjs";

const PLAN_VERSION = "planner-v1";
const RULESET_VERSION = "rules-v1";
const CONTENT_VERSION = "catalog-v1";
const DAY_COUNT = 7;
const INTENSITY_RANK = { easy: 1, moderate: 2 };

function asDateKey(value, field) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError(`${field} must be an ISO date (YYYY-MM-DD)`);
  }

  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new RangeError(`${field} is not a valid calendar date`);
  }

  return value;
}

function addDays(dateKey, days) {
  const date = new Date(`${dateKey}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function differenceInDays(first, second) {
  return Math.round(
    (new Date(`${second}T00:00:00Z`) - new Date(`${first}T00:00:00Z`))
    / 86_400_000
  );
}

function requireArray(value, field) {
  if (value !== undefined && !Array.isArray(value)) {
    throw new TypeError(`${field} must be an array`);
  }
  return value || [];
}

function normalizeCommitments(commitments, weekDates) {
  const knownDates = new Set(weekDates);
  const seenIds = new Set();

  return commitments.map((commitment, index) => {
    if (!commitment || typeof commitment !== "object") {
      throw new TypeError(`commitments[${index}] must be an object`);
    }

    const id = String(commitment.id || `commitment-${index + 1}`);
    const date = asDateKey(commitment.date, `commitments[${index}].date`);
    const type = String(commitment.type || "").toLowerCase();
    const time = commitment.time === undefined ? "" : String(commitment.time);

    if (seenIds.has(id)) throw new RangeError(`Duplicate commitment id: ${id}`);
    if (!knownDates.has(date)) {
      throw new RangeError(`commitments[${index}].date must be inside the planning week`);
    }
    if (!["practice", "match"].includes(type)) {
      throw new TypeError(`commitments[${index}].type must be practice or match`);
    }
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
      throw new TypeError(`commitments[${index}].time must be HH:MM when provided`);
    }

    seenIds.add(id);
    return {
      id,
      date,
      type,
      title: String(commitment.title || (type === "match" ? "Match" : "Team practice")),
      time
    };
  });
}

function normalizeAvailableDays(availableDays, weekDates) {
  const knownDates = new Set(weekDates);
  const values = availableDays === undefined ? weekDates : requireArray(availableDays, "availableDays");

  return [...new Set(values.map((date, index) => {
    const normalized = asDateKey(date, `availableDays[${index}]`);
    if (!knownDates.has(normalized)) {
      throw new RangeError(`availableDays[${index}] must be inside the planning week`);
    }
    return normalized;
  }))];
}

function nearestMatchDistance(date, matchDates) {
  if (!matchDates.length) return Number.POSITIVE_INFINITY;
  return Math.min(...matchDates.map((matchDate) => Math.abs(differenceInDays(date, matchDate))));
}

function nearestPracticeDistance(date, practiceDates) {
  if (!practiceDates.length) return Number.POSITIVE_INFINITY;
  return Math.min(...practiceDates.map((practiceDate) =>
    Math.abs(differenceInDays(date, practiceDate))
  ));
}

function hasEquipment(routine, equipment) {
  const available = new Set(equipment);
  return routine.requiredEquipment.every((item) => available.has(item));
}

function createRestDay(date, reasonCodes = ["open_day"]) {
  return {
    date,
    dayType: "rest",
    fixedCommitmentId: null,
    fixedCommitments: [],
    routineId: null,
    title: "Open day",
    durationMinutes: 0,
    intensity: "easy",
    reasonCodes,
    sourceContentVersion: CONTENT_VERSION,
    safetyStatus: "eligible"
  };
}

function createSafetyDay(date, reasonCodes, title, reason) {
  return {
    date,
    dayType: "safety_restriction",
    fixedCommitmentId: null,
    fixedCommitments: [],
    routineId: null,
    title,
    durationMinutes: 0,
    intensity: "easy",
    purpose: reason,
    reasonCodes,
    sourceContentVersion: CONTENT_VERSION,
    safetyStatus: "adult_review_required"
  };
}

function createRecoveryDay(date, reasonCodes, purpose) {
  return {
    date,
    dayType: "recovery_or_rest",
    fixedCommitmentId: null,
    fixedCommitments: [],
    routineId: null,
    title: "Recovery or rest",
    durationMinutes: 0,
    intensity: "easy",
    purpose,
    reasonCodes,
    sourceContentVersion: CONTENT_VERSION,
    safetyStatus: "eligible"
  };
}

function createFixedDay(date, commitments) {
  const [onlyCommitment] = commitments;
  return {
    date,
    dayType: commitments.length === 1
      ? `fixed_${onlyCommitment.type}`
      : "fixed_commitments",
    fixedCommitmentId: commitments.length === 1 ? onlyCommitment.id : null,
    fixedCommitments: commitments.map((commitment) => ({
      ...commitment,
      safetyStatus: "eligible"
    })),
    routineId: null,
    title: commitments.length === 1
      ? onlyCommitment.title
      : `${commitments.length} fixed commitments`,
    durationMinutes: 0,
    intensity: "moderate",
    reasonCodes: ["fixed_commitment_protected"],
    sourceContentVersion: CONTENT_VERSION,
    safetyStatus: "eligible"
  };
}

function createRoutineDay(date, routine, recommendation, reasonCodes) {
  const level = recommendation.experience;
  return {
    date,
    dayType: "optional_session",
    fixedCommitmentId: null,
    fixedCommitments: [],
    routineId: routine.id,
    title: routine.title,
    purpose: routine.purpose,
    durationMinutes: routine.durationMinutesByLevel[level],
    intensity: routine.intensityByLevel[level],
    targetRpe: routine.targetRpeByLevel[level],
    reasonCodes,
    sourceContentVersion: CONTENT_VERSION,
    safetyStatus: "eligible"
  };
}

function restrictDayForAdultReview(day, reasonCode, title, purpose) {
  if (!day.fixedCommitments.length) {
    return createSafetyDay(day.date, [reasonCode], title, purpose);
  }

  return {
    ...day,
    safetyStatus: "adult_review_required",
    reasonCodes: [...new Set([...day.reasonCodes, reasonCode])],
    fixedCommitments: day.fixedCommitments.map((commitment) => ({
      ...commitment,
      safetyStatus: "adult_review_required"
    }))
  };
}

function normalizeReadiness(readiness) {
  if (readiness === undefined || readiness === null) return null;
  if (!readiness || typeof readiness !== "object") {
    throw new TypeError("readiness must be an object");
  }

  for (const field of ["sleep", "energy", "soreness"]) {
    if (!Number.isInteger(readiness[field]) || readiness[field] < 1 || readiness[field] > 5) {
      throw new RangeError(`readiness.${field} must be an integer between 1 and 5`);
    }
  }

  return readiness;
}

function createAthleteContext(rawInput, data) {
  const ageGroup = String(rawInput.ageGroup || "").toUpperCase();
  const ageBand = data.taxonomy.ageBands.find((candidate) =>
    candidate.teamAgeGroups.includes(ageGroup)
  );
  return {
    ageGroup,
    ageBandId: ageBand?.id || null,
    experience: String(rawInput.experience || "").toLowerCase(),
    goalId: String(rawInput.goal || "").toLowerCase()
  };
}

/**
 * Build the canonical seven-day plan from approved catalog content.
 *
 * This module deliberately schedules at most one independent routine. It is a
 * safe first boundary: fixed commitments are protected, catalog content is
 * allowlisted, and missing/unsafe inputs fall back to rest or adult review.
 */
export function buildCanonicalPlan(rawInput, data) {
  if (!rawInput || typeof rawInput !== "object" || Array.isArray(rawInput)) {
    throw new TypeError("planner input must be an object");
  }
  if (!data || !data.taxonomy || !data.routineCatalog || !data.recommendationIndex) {
    throw new TypeError("planner data must be loaded youth football data");
  }

  const startDate = asDateKey(rawInput.startDate, "startDate");
  const weekDates = Array.from({ length: DAY_COUNT }, (_, index) => addDays(startDate, index));
  const commitments = normalizeCommitments(requireArray(rawInput.commitments, "commitments"), weekDates);
  const availableDays = normalizeAvailableDays(rawInput.availableDays, weekDates);
  const equipment = requireArray(rawInput.equipment, "equipment").map(String);
  const readiness = normalizeReadiness(rawInput.readiness);
  const painLevel = String(rawInput.painLevel || "none").toLowerCase();
  const athleteContext = createAthleteContext(rawInput, data);

  if (!["none", "mild", "moderate", "severe"].includes(painLevel)) {
    throw new TypeError("painLevel must be none, mild, moderate, or severe");
  }
  const commitmentsByDate = new Map(weekDates.map((date) => [date, []]));
  for (const commitment of commitments) {
    commitmentsByDate.get(commitment.date).push(commitment);
  }
  const matchDates = commitments.filter((commitment) => commitment.type === "match").map((commitment) => commitment.date);
  const practiceDates = commitments.filter((commitment) => commitment.type === "practice").map((commitment) => commitment.date);
  const days = weekDates.map((date) => commitmentsByDate.get(date).length
    ? createFixedDay(date, commitmentsByDate.get(date))
    : createRestDay(date));

  if (rawInput.guardianApproval !== true) {
    return {
      planVersion: PLAN_VERSION,
      athleteContext,
      days: days.map((day) => restrictDayForAdultReview(
        day,
        "guardian_approval_missing",
        "Adult approval required",
        "A parent or guardian must approve participation before training is planned."
      )),
      decisionTrace: { rulesetVersion: RULESET_VERSION, sourceContentVersion: CONTENT_VERSION, excludedCandidates: [], fallbackUsed: true, outcome: "guardian_approval_required" }
    };
  }

  const excludedCandidates = [];

  if (painLevel !== "none") {
    return {
      planVersion: PLAN_VERSION,
      athleteContext,
      days: days.map((day) => restrictDayForAdultReview(
        day,
        "pain_reported",
        "Pause training and tell an adult",
        "Reported pain requires responsible-adult review before automated training continues."
      )),
      decisionTrace: { rulesetVersion: RULESET_VERSION, sourceContentVersion: CONTENT_VERSION, excludedCandidates, fallbackUsed: true, outcome: "adult_review_required" }
    };
  }

  const selection = selectYouthFootballRoutine(rawInput, data);
  if (selection.action !== "recommend") {
    return {
      planVersion: PLAN_VERSION,
      athleteContext,
      days,
      decisionTrace: { rulesetVersion: RULESET_VERSION, sourceContentVersion: CONTENT_VERSION, excludedCandidates, fallbackUsed: true, outcome: selection.action }
    };
  }

  const routine = data.routineCatalog.routines.find((candidate) => candidate.id === selection.recommendation.id);
  const lowReadiness = readiness && (readiness.sleep <= 2 || readiness.energy <= 2 || readiness.soreness >= 4);
  if (lowReadiness) {
    const recoveryIndex = days.findIndex((day) => day.dayType === "rest" && availableDays.includes(day.date));
    if (recoveryIndex >= 0) {
      days[recoveryIndex] = createRecoveryDay(
        days[recoveryIndex].date,
        ["low_readiness", "recovery_spacing"],
        "Readiness is low, so choose gentle movement or rest and reassess before training."
      );
    }
    return {
      planVersion: PLAN_VERSION,
      athleteContext: { ageGroup: rawInput.ageGroup, experience: rawInput.experience, goal: rawInput.goal },
      days,
      decisionTrace: { rulesetVersion: RULESET_VERSION, sourceContentVersion: CONTENT_VERSION, excludedCandidates: [{ routineId: routine.id, reasons: ["low_readiness"] }], fallbackUsed: true, outcome: "recovery_or_rest" }
    };
  }

  for (const date of weekDates) {
    const dayIndex = weekDates.indexOf(date);
    if (commitmentsByDate.get(date).length) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["fixed_commitment_protected"] });
      continue;
    }
    if (!availableDays.includes(date)) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["day_unavailable"] });
      days[dayIndex].reasonCodes = ["day_unavailable"];
      continue;
    }
    if (!hasEquipment(routine, equipment)) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["equipment_unavailable"] });
      days[dayIndex].reasonCodes = ["equipment_unavailable"];
      break;
    }
    if (routine.supervision === "qualified_coach" && rawInput.qualifiedSupervisionAvailable !== true) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["qualified_supervision_missing"] });
      days[dayIndex].reasonCodes = ["qualified_supervision_missing"];
      break;
    }
    const routineIntensity = routine.intensityByLevel[selection.recommendation.experience];
    if (
      INTENSITY_RANK[routineIntensity] >= INTENSITY_RANK.moderate
      && nearestPracticeDistance(date, practiceDates) <= 1
    ) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["recovery_spacing"] });
      days[dayIndex].reasonCodes = ["recovery_spacing"];
      continue;
    }
    const nearestMatchDays = nearestMatchDistance(date, matchDates);
    if (
      routine.matchBufferHours > 0
      && nearestMatchDays * 24 <= routine.matchBufferHours
    ) {
      excludedCandidates.push({ date, routineId: routine.id, reasons: ["match_buffer"] });
      days[dayIndex].reasonCodes = ["match_buffer"];
      continue;
    }

    days[weekDates.indexOf(date)] = createRoutineDay(date, routine, selection.recommendation, ["goal_fit", "available_day", "approved_content"]);
    break;
  }

  const scheduled = days.some((day) => day.routineId === routine.id);
  if (!scheduled) {
    for (const day of days) {
      if (day.dayType === "rest") {
        day.reasonCodes = [
          "no_safe_candidate",
          ...day.reasonCodes.filter((reason) => reason !== "open_day")
        ];
      }
    }
  } else {
    for (const day of days) {
      if (day.dayType === "rest" && day.reasonCodes.includes("open_day")) {
        day.reasonCodes = ["weekly_session_limit"];
      }
    }
  }

  return {
    planVersion: PLAN_VERSION,
    athleteContext,
    days,
    decisionTrace: {
      rulesetVersion: RULESET_VERSION,
      sourceContentVersion: CONTENT_VERSION,
      excludedCandidates,
      fallbackUsed: !scheduled,
      outcome: scheduled ? "routine_scheduled" : "no_safe_candidate"
    }
  };
}

export const canonicalPlannerVersions = {
  plan: PLAN_VERSION,
  ruleset: RULESET_VERSION,
  content: CONTENT_VERSION
};
