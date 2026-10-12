# 02 — Implementation status

Everything in `hifz.pen` is implemented in `src/` following the `AGENTS.md` architecture: screens -> hooks (`src/hooks`, TanStack Query) -> services (`src/services`, expo-sqlite / ts-fsrs).

## Screens (Expo Router, `src/app`)
- `onboarding` — 7 steps; language choice applies immediately; completion stored in SQLite (zustand store persisted via SQLite kv-store on native, localStorage on web; `Stack.Protected` gate in `_layout.tsx`).
- `(tabs)/index` Memory Decks, `(tabs)/progress`, `(tabs)/settings` with a custom tab bar.
- `deck/[id]` recitation flow (status timeline), `lesson/[id]` choose pace, `study` flashcards (per word / phrase / overall, Again/Hard/Good/Easy with FSRS intervals, keyboard shortcuts on web), `deck/new` and `add-card` for custom decks.

## Languages
Arabic (RTL, via root `direction` style), English, Indonesian: UI strings in `src/i18n/strings.ts`; prayer meanings in all three languages in `src/content/`.

## Content (`src/content`)
Prayer Recitation deck (20 lessons): five niat, takbiratul ihram, doa iftitah, Al-Fatihah, Al-Ikhlas / Al-Kawthar / Al-Asr, ruku', i'tidal, sujud, sitting between sujud, first tashahhud, final tashahhud with salawat, supplication before salam, salam, Qunut (Fajr). Daily Supplications deck: 6 doas. Quran is a "coming soon" row as in the design.

## Decisions to review
- **Religious text needs review by a qualified person before release.** Arabic text, transliteration and the three-language glosses were written for this app and have not been verified by a scholar. Madhab choices (Shafi'i niat wording, Qunut in Fajr, basmalah as part of Al-Fatihah, short tashahhud without salawat in the first sitting) are mine.
- Mastered = FSRS stability >= 14 days; "this week" delta compares mastered cards now vs 7 days ago.
- Web build uses `web.output: "single"` (expo-sqlite web needs a client-only app, wasm in Metro, COOP/COEP headers; see `metro.config.js`).
- Feedback row opens `mailto:` with no recipient (no address was specified).
- No bundle identifier / package name set yet (needed before EAS builds).

## Verified
`tsc`, `expo lint`, `expo-doctor` clean; Android and iOS bundles export; full flows exercised in a browser (onboarding, study with ratings and requeue, session completion, custom decks, add/delete, settings, Arabic RTL, persistence across reload). Not run on a device or simulator, so native notifications (reminder) and native SQLite are untested.
