# Hifz - Prayer & dua flashcards

Offline-first flashcards for memorizing the obligatory Islamic prayers with meaning, in Arabic, English and Indonesian. Built with Expo, expo-router, expo-sqlite, TanStack Query and ts-fsrs (FSRS spaced repetition). No backend; all data stays on the device.

```bash
npm install
npx expo start        # then press i / a / w
npx tsc --noEmit && npx expo lint
```

- `AGENTS.md` — architecture rules (screens -> hooks -> services -> SQLite)
- `DESIGNS.md` — design tokens, screens and data model, derived from `hifz.pen`
- `plans/` — product plan and implementation status
