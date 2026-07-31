# PureAthletic

PureAthletic is an adaptive training planner designed to help athletes train with greater structure and make better next-session decisions. It turns an athlete's goals, schedule, training history, and recovery feedback into a practical weekly plan, then adjusts that plan as circumstances change.

## Run the prototype

The active prototype uses traditional, dependency-free application files:

- `index.html` contains the document structure and landing-page content.
- `styles.css` contains all visual styling.
- `app.js` contains the interactive screens, application state, and browser storage.

Start any static web server in the project directory. For example:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`. You can also open `index.html` directly,
although a local server is recommended for consistent browser behavior.

For static hosting, `npm run build` copies those same three files into `dist/`
and generates a small static-file hosting adapter. The build script uses only
Node.js itself and installs no packages or frameworks.

The previous Next.js/React implementation is preserved in
[`archive/nextjs`](archive/nextjs).

## Product specification

The focused version-one scope, user journey, safety boundaries, data model, and delivery milestones are defined in the [Product Requirements](docs/product-requirements.md).

Supporting product-foundation documents:

- [Quick Product Summary](docs/product-foundation-summary.md)
- [V1 Decision Sheet](docs/decision-sheet.md)
- [V1 User Flow](docs/user-flow.md)
- [V1 Low-Fidelity Wireframes](docs/low-fidelity-wireframes.md)

## U5–U17 training foundation

The active research catalog for healthy U5–U17 footballers is stored in
[`data/youth-football`](data/youth-football). It separates:

- 17 reviewed source records and five distilled design principles;
- four developmental age bands;
- Beginner, Intermediate, and research-only Advanced progressions;
- five primary goals;
- 20 original age-band × goal routine outlines; and
- a 60-combination recommendation index.

Beginner and Intermediate recommendations are connected to onboarding.
Advanced data remains organized in the catalog but is deliberately unavailable
in the interface and selector. The earlier technique-first U12–U17 safety
prototype remains in [`data/junior`](data/junior) while the new catalog is
reviewed.

Practitioner, safeguarding, privacy, legal, guardian-consent, and minor-account
release gates are documented in the
[Junior Training Content Standard](docs/junior-training-content-standard.md).

Validate the content and recommendation behavior with:

```bash
npm run validate:training
npm test
```

## Who is it for?

The current research prototype is focused on junior footballers in team age
groups U5–U17, with parent or guardian approval. It is not ready for an
unsupervised public release involving minors; the documented practitioner,
safeguarding, consent, privacy, and legal release gates still apply.

## Why PureAthletic?

Many people enjoy sports and exercise, but few have access to personalized guidance on how to train effectively. Beginners often rely on random workouts, inconsistent routines, or generic advice that doesn't match their goals or fitness level.

PureAthletic **aims** to change that by helping athletes understand what to train, when to train, how to recover, and how to progress through personalized recommendations based on their individual profile and activity.

## Version-one features

The initial product will:

- Create a personalized football athlete profile.
- Record team practices, matches, goals, availability, and equipment.
- Generate a structured seven-day training plan.
- Log completed, modified, skipped, and unplanned sessions.
- Capture short daily readiness check-ins.
- Adapt the remaining week using explicit training and safety rules.
- Explain why sessions and plan adjustments are recommended.
- Summarize consistency, workload, readiness, and weekly progress.

## Vision

The long-term vision of PureAthletic is to become a platform that empowers athletes to train with intention rather than guesswork.

Whether someone is preparing for their first football tournament, improving overall fitness, or simply building healthier habits, PureAthletic aims to provide personalized guidance that helps users train more efficiently, recover better, and continually improve through data-driven insights and AI assistance.
