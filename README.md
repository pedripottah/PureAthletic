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

Or use the included Node.js development server:

```bash
npm run dev
```

This starts the prototype at `http://localhost:3000`.

Then open the URL printed by the server (usually `http://localhost:8000` for
the Python command or `http://localhost:3000` for `npm run dev`). You can also
open `index.html` directly,
although a local server is recommended for consistent browser behavior.

For static hosting, `npm run build` copies those same three files into `dist/`
and generates a small static-file hosting adapter. The build script uses only
Node.js itself and installs no packages or frameworks.

## Verify the prototype

Run the automated verification suite with:

```bash
npm run verify
```

This runs the application and data tests, makes live HTTP requests against a
temporary local preview, validates documentation links, builds `dist/`, and
checks the generated static routes and hosting adapter. It does not replace the
real-browser checks below.

For the browser checks, start `npm run dev` and open both of these pages in a
real browser. Each page must show `PASS` before sharing the prototype for
research:

- `http://localhost:3000/test/browser-smoke.html`
- `http://localhost:3000/test/responsive-smoke.html`

The previous Next.js/React implementation is preserved in
[`archive/nextjs`](archive/nextjs).

## Product specification

Start with the [Documentation Guide](docs/README.md). It defines which files are
authoritative, how current prototype behavior differs from target-product
design, and how decisions and release gates must be recorded.

The target version-one outcomes and boundaries are defined in the
[Product Requirements](docs/product-requirements.md).

Supporting product-foundation documents:

- [Quick Product Summary](docs/product-foundation-summary.md)
- [V1 Decision Sheet](docs/decision-sheet.md)
- [V1 User Flow](docs/user-flow.md)
- [V1 Low-Fidelity Wireframes](docs/low-fidelity-wireframes.md)
- [Prototype Review](docs/project-review.md)
- [Three-Year Product and Engineering Roadmap](docs/three-year-roadmap.md)
- [Phase 0 Research Plan](docs/research-plan.md)
- [Research Preparation Pack](docs/research-preparation.md)
- [Prototype Verification Checklist](docs/prototype-verification-checklist.md)
- [Research Session Form](docs/research-session-form.md)
- [Research Round Summary](docs/research-round-summary.md)
- [Practitioner and Safeguarding Review Packet](docs/safety-review-packet.md)
- [Risk and Data Foundation](docs/risk-and-data-foundation.md)
- [AI Integration Strategy](docs/ai-integration-strategy.md)

## U5–U17 training foundation

The active research catalog for healthy U5–U17 footballers is stored in
[`data/youth-football`](data/youth-football). It separates:

- 17 documented source records and five distilled design principles;
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

Run the combined pre-sharing check with:

```bash
npm run verify
```

This also checks that local links and linked headings in the Markdown
documentation still resolve.

## Who is it for?

The research catalog covers junior football team groups U5–U17, but the first
release cohort and responsible-adult account model remain undecided. The current
checkbox simulates guardian approval for prototype research; it is not verified
consent. The app is not ready for real training use or a minor-facing beta.

## Why PureAthletic?

Many people enjoy sports and exercise, but few have access to personalized guidance on how to train effectively. Beginners often rely on random workouts, inconsistent routines, or generic advice that doesn't match their goals or fitness level.

PureAthletic **aims** to change that by helping athletes understand what to train, when to train, how to recover, and how to progress through personalized recommendations based on their individual profile and activity.

## Target version-one features

The initial product will:

- Create a personalized football athlete profile.
- Record team practices, matches, goals, and—after the deferred rollout gates
  pass—availability, equipment, and supervision context.
- Generate a structured seven-day training plan.
- Log completed, modified, skipped, and unplanned sessions.
- Capture short daily readiness check-ins.
- Adapt the remaining week using explicit training and safety rules.
- Explain why sessions and plan adjustments are recommended.
- Summarize consistency, workload, readiness, and weekly progress.

## Vision

The long-term vision is to help a narrowly defined group of footballers make
more intentional, understandable next-session decisions without encouraging
extra training for its own sake.

Expansion beyond the first validated cohort, problem, and deterministic core is
optional. AI is not part of the current product and should be considered only
for constrained explanations or summaries after the documented evidence,
privacy, evaluation, and release gates pass.
