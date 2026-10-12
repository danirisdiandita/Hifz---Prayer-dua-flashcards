# 01 — Product overview and spaced repetition choice

## Product
Hifz (store title: "Hifz - Prayer & dua flashcards") is an offline-first app for memorizing Islamic prayers through flashcards, with the app and card content available in multiple languages (EN, ID, AR; more later). Users learn each prayer per word, per phrase, or as a whole, and review with spaced repetition. No backend, no account; all data in SQLite (see `AGENTS.md`). Screens and tokens: `DESIGNS.md`.

## Spaced repetition library: `ts-fsrs` (decided, installed ^5.4.2)
Use [`ts-fsrs`](https://github.com/open-spaced-repetition/ts-fsrs), the TypeScript implementation of FSRS (the scheduler used by modern Anki; the README lists FSRS-6).

Why:
- Actively maintained, MIT licensed, written in TypeScript, ships ESM/CJS/UMD.
- Pure scheduling logic with no native code, so it works in Expo without a dev build. (The README doesn't mention React Native; verify on-device with Hermes early.)
- API matches the UI: `repeat(card, now)` previews the next interval for all four ratings, which feeds the Again/Hard/Good/Easy buttons (1m / 6m / 10m / 4d in the design). `next(card, now, rating)` returns the updated card and a review log to persist.
- Newer and generally regarded as more efficient than SM-2. I did not find a quantitative comparison in my search, so treat that as the common view rather than verified.

Alternatives considered:
- SM-2 packages (e.g. `@kirklin/supermemo2`): small and stale; fine as a reference, not a dependency.
- `femto-fsrs` / `simple-ts-fsrs`: lighter, but results may differ from the reference implementation.

Notes:
- README states Node 20+ (tooling only, not the app runtime).
- Parameter optimization uses a separate package (`@open-spaced-repetition/binding`); skip for v1 and use default parameters.
- Install with `npx expo install ts-fsrs` per `AGENTS.md`; if Expo can't resolve it, fall back to `bun add`/`npm install`.

## Schema impact
The current design schema (`cards.due_at`, `reviews.interval/ease/next_due_at`) is SM-2 shaped. FSRS card state needs more fields. Update `cards` (and the design's SQLite frame) to store: `due`, `stability`, `difficulty`, `state` (New/Learning/Review/Relearning), `reps`, `lapses`, `last_review`, plus `elapsed_days`/`scheduled_days` as required by the installed version's `Card` type. Keep `reviews` as the log (`rating`, `state`, `reviewed_at`, and the log fields returned by `next()`). Check the installed version's `Card`/`ReviewLog` types before writing the migration.

## Architecture (per `AGENTS.md`)
- `src/services/srs.ts`: wraps `ts-fsrs` (create scheduler, map DB row to Card, apply rating) and the SQLite writes.
- `src/hooks/`: e.g. `useDueCards`, `useReviewCard`, `useSchedulePreview`, each a TanStack Query hook calling the service.

## Open questions
- Per-word, per-phrase and overall modes: separate FSRS cards per mode, or one card per prayer segment? (Design implies separate cards via `cards.mode`.)
- Daily new-card limit and "learning steps" behavior for the first reviews.
- Content licensing/sources for translations and audio.
