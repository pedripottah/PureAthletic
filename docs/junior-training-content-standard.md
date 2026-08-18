# Junior Training Content Standard

## Status and scope

This is a draft content and decision foundation for healthy junior footballers
in team age groups U5–U17. Beginner and Intermediate catalog selection is
connected to the local research prototype. Advanced remains research-only and
cannot be selected or recommended.

Before any junior feature is released, it requires:

- review and approval by a qualified youth sport practitioner;
- a child-safeguarding review;
- jurisdiction-specific privacy and legal review;
- verifiable parent or guardian consent; and
- suitable minor account, contact, and communication controls.

The library provides general training guidance. It does not diagnose health
conditions, rehabilitate injuries, clear return to play, prescribe weight loss
or supplements, or guarantee performance improvements.

## Evidence-informed boundaries

The content is informed by:

- [FIFA’s age-specific grassroots library](https://www.fifatrainingcentre.com/en/practice/grassroots.php);
- [The Coaching Manual’s age-appropriate curricula](https://www.thecoachingmanual.com/season-plan-curriculums-1);
- [Football DNA’s age-group coach education](https://footballdna.co.uk/coaching-courses/);
- [easy2coach’s age, focus, and player-count filtering model](https://www.easy2coach.net/academy/training/uebungen-altersklasse/);
- [WHO physical activity and sedentary behaviour guidelines](https://www.who.int/publications/i/item/9789240014886);
- [WHO guidance for children under five](https://www.who.int/publications/i/item/9789241550536);
- [CDC guidelines for school-aged children and adolescents](https://www.cdc.gov/physical-activity-education/guidelines/index.html);
- [American Academy of Pediatrics guidance on youth resistance training](https://publications.aap.org/pediatrics/article/145/6/e20201011/76942/Resistance-Training-for-Children-and-Adolescents); and
- [FIFA guidance for warm-ups for players aged 12–15](https://www.fifatrainingcentre.com/en/practice/grassroots/grassroots-and-youth-football-essentials/grassroots-coaching-essentials/optimising-warm-ups-u12-to-u15.php).

For school-aged players, the recommendation to average at least 60 minutes of
moderate-to-vigorous activity each day describes total daily activity.
Under-five guidance uses a different whole-day movement framework.
PureAthletic must not present either guideline as extra training to add on top
of football, school or preschool activity, active travel, free play, and other
commitments.

## Session standard

Every approved session:

- lasts 12–40 minutes according to the age-band limit;
- uses only easy or moderate intensity in the currently available levels;
- uses Play-Practice-Play for U5–U8 and structured preparation, main work, and
  an easy finish for older bands;
- provides technique instructions, coaching cues, an easier option, and a
  controlled progression;
- uses qualified adult supervision for strength, speed, movement-control, and
  mixed sessions; and
- prioritizes controlled movement over load, repetitions, or speed.

For U5–U8, “strength” means playful balance and body control without external
loading. Older beginners use low-resistance, technique-first strength work.
Progression occurs
only after at least three successful sessions, changes one variable at a time,
and never increases resistance by more than 10 percent at once.

Maximal lifting, one-repetition maximum testing, training to failure, punishment
exercise, unsupervised loaded strength, and all-out conditioning tests are not
part of the library.

## Readiness and scheduling rules

Pain at any reported level, a health concern, or a listed red-flag symptom stops
automated recommendations and directs the player to a responsible adult.

Low energy, high soreness, or low sleep restricts recommendations to easy
recovery. Within 24 hours of a match or a high-load activity, only short, easy
recovery or technical work may be suggested. The app permits at most three
independent performance sessions in seven days and must treat team football,
matches, school activity, recovery, and free play as fixed context rather than
work to maximize.

## AI recommendation boundary

The implementation sequence and API gates are defined in the
[AI Integration Strategy](ai-integration-strategy.md). The current prototype
must first unify its catalog, weekly planner, and safety rules before any API
can influence user-facing output.

The deterministic rule engine is the authority. A future AI service may:

- rank routines that have already passed the rules;
- select only existing routine and exercise IDs; and
- write a short, age-appropriate explanation using approved facts.

The AI may not invent exercises, override a hard stop, increase load, provide
medical advice, or remove required supervision and safety copy. Its structured
response must be validated again on the server. If parsing or validation fails,
the product must fall back to the deterministic recommendation.

No unnecessary minor data should be sent to an AI provider. Names, precise
locations, contact details, free-text medical information, and direct messaging
content are outside the recommendation payload.

## Data files and verification

- `data/youth-football/sources.json` records sources and distilled principles.
- `data/youth-football/taxonomy.json` defines age bands, goals, and levels.
- `data/youth-football/routine-catalog.json` contains the 20 routine outlines.
- `data/youth-football/recommendation-index.json` maps all 60 age-band, level,
  and goal combinations.
- `lib/youth-football-catalog.mjs` validates and selects catalog content.
- `data/junior` retains the earlier U12–U17 safety-rule prototype.

Run `npm run validate:training` to validate all references and constraints. Run
`npm test` to evaluate the safety and recommendation scenarios.
