# U5–U17 Football Recommendation Data

This folder is the current source of truth for age- and goal-aware youth
football recommendations.

## Files

- `sources.json` — reviewed links, source roles, and five distilled principles.
- `taxonomy.json` — supported team age groups, four development bands, three
  researched experience levels, and five goals.
- `routine-catalog.json` — 20 original PureAthletic routine outlines, one for
  every age-band × goal combination.
- `recommendation-index.json` — direct lookup across 4 age bands × 3 levels ×
  5 goals, for 60 organized combinations.

## Selection order

1. Resolve the selected team age group to an age band.
2. Reject Advanced because its product status is research-only.
3. Resolve the user’s primary goal.
4. Look up the routine ID for age band, available level, and goal.
5. Apply schedule, readiness, pain, equipment, and supervision rules.
6. Display only content that remains eligible.

Beginner and Intermediate are currently selectable. Advanced routine mappings
and progression notes are retained for research and review, but neither the
interface nor the selector can recommend them.

## Source policy

FIFA and pediatric/public-health guidance define the principal development and
safety boundaries. The Coaching Manual, Football DNA, and easy2coach inform age
grouping, progression, and data organization.

The catalog contains original summaries and routines. It does not reproduce
paid drills, diagrams, videos, or substantial source text.
