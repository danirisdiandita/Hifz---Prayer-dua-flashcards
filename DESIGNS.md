# Hifz - Prayer & dua flashcards — Design Reference

Source of truth: `hifz.pen` (open it only through the Pencil MCP tools). This document summarizes it for implementation. Canvas size for all screens is **393 × 852** (iPhone 15/16 class).

Hifz is a calm, offline-first flashcard app for memorizing prayer recitations (Arabic) with meaning, using spaced repetition. Tagline: *Memorize with meaning*.

## Design tokens

### Colors
| Token | Hex | Use |
|---|---|---|
| `bg` / `cream` | `#F4EFE4` | Screen background, text on green |
| `surface` | `#FFFDF8` | Cards, tab bar, icon buttons |
| `ink` | `#141F1B` | Primary text, icons |
| `ink-2` | `#5E6963` | Secondary text |
| `ink-3` | `#9AA49E` | Inactive/tertiary (tab icons, chevrons) |
| `green` | `#1E3A32` | Primary brand, primary button |
| `green-2` | `#2F5447` | "Good" rating |
| `green-soft` | `#DCE6DE` | Icon tiles |
| `gold` | `#C8A050` | Accent, eyebrows, button arrow, "Hard" rating |
| `gold-soft` | `#F3E7C8` | Soft accent fill |
| `line` | `#E2DACB` | Borders, dividers, inactive progress segments |

Rating colors (dots on rating buttons): Again `#C0564B`, Hard `gold`, Good `green-2`, Easy `#4F7FA3`.

### Typography
| Token | Font | Use |
|---|---|---|
| `font-display` | Fraunces | Headlines, big numbers, card titles |
| `font-body` | Plus Jakarta Sans | UI text, body copy |
| `font-arabic` | Amiri | All Arabic text |
| `font-mono` | DM Mono | Counters, intervals, shortcuts, schema |

Observed sizes: screen title 30–34 display; hero stat 64 display; stat 24 display; section heading 19–22 display; body 15; row title 15 (600); caption 12–13; tab label 11 (600); eyebrow/section label 10–11 (700, letterSpacing ~1.6, uppercase). Arabic: 44–64 on flashcards, 52 on onboarding.

### Shape & spacing
- Screen horizontal padding: **24**. Content width: **345**.
- Corner radii: pill buttons `999`; flashcard `28`; rating button `16`; icon tile `14`; icon button `20` (circle); progress segment `2`.
- Borders: 1px `line`. List rows use bottom border only.
- Icons: Lucide, 18–22px.

## Reusable components (in `Hifz Components`)
- **Status Bar** (393×38): time + signal/wifi/battery icons. Mock only — use the native status bar in the app.
- **Tab Bar** (393×91): Home (`house`), Progress (`chart-no-axes-combined`), Settings (`settings-2`). `surface` fill, top border; active tab shows a 28×3 indicator above the icon and colored label/icon (inactive uses `ink-3`).
- **Primary Button** (345×56): `green` pill, cream 15/600 label, gold `arrow-right` icon.
- **Icon Button** (40×40): `surface` circle with `line` border, 18px glyph (e.g. `arrow-left`).
- **List Row** (345×72): 44×44 `green-soft` tile with icon, title (15/600) + subtitle (12, `ink-2`), trailing `chevron-right`.
- **Section Label**: 11/700 uppercase, letterSpacing 1.6, `ink-2`.
- **Rating Button** (80 wide): `surface`, radius 16, colored dot, label (13/600), interval in mono 11 (Again 1m, Hard 6m, Good 10m, Easy 4d).

## Screens

### Onboarding (7 screens, `bg` background)
Shared layout: status bar → **step segments** (7 bars, active = `green`, rest = `line`, gap 6) → body (gold eyebrow, 34 display headline, 15 `ink-2` copy) → footer with Primary Button. Copy is Indonesian except screen 1.
1. **Language** — "Choose your language for the journey". Three options: ID Bahasa Indonesia, EN English, AR العربية (mono code badge + name + subtitle).
2. **Path** — Al-Mu'minun 23:1–11; numbered list 01 Iman, 02 Khusyu dalam salat, 03 Meninggalkan kesia-siaan.
3. **Practice** — "Bangun khusyu, satu latihan setiap hari" (flashcards + spaced repetition).
4. **Why Meaning** — large Arabic word خُشُوع with explanation card.
5. **Learn Small** — خُطْوَة; per word → per phrase → whole.
6. **Spaced Repetition** — تَكْرَار; short sessions beat rare long ones.
7. **Begin Journey** — نِيَّة; final CTA.
Screens 4–7 share a pattern: big Arabic word (52, Amiri), 22 display subheading, 13 body.

### Memory Decks (Home tab)
Title "What would you like to memorize?" (30). Featured card for the **last accessed** deck: "Prayer Recitation", 7 cards · 5 mastered, 70% progress (mono), "Continue studying" action. Below, a "Have something to memorize? Create a deck from any idea" row. Tab bar visible.

### Deck detail — Prayer Recitation ("Bacaan Shalat")
Title 30; stats row (70% Mastered, 7 Cards, 5 Done, 2 Left; 24 display numbers with 11 labels); list of List Rows: Takbiratul Ihram, Doa Iftitah, Al-Fatihah, Rukuk, I'tidal, Sujud (each with English subtitle).

### Memorization options (per prayer)
"Choose your pace" — pick **Per word** (marked *Recommended*), **Per phrase**, or **Overall**. Shows the Arabic preview اللّٰهُ أَكْبَرُ with transliteration and meaning ("Allāhu akbar · Allah is the Greatest").

### Flashcards (Anki-style; three variants)
Per Word (`1 / 12`), Per Phrase (`1 / 6`), Overall (`1 / 1`). Structure:
- Top bar: Icon Button back, mono eyebrow "BACAAN SHALAT · PER WORD", mono counter; progress segments below.
- Body: one large `surface` card (radius 28, `line` border, padding 28/24) with eyebrow ("TAKBIRATUL IHRAM · WORD 1"), Arabic (64 word / 54 phrase+overall), transliteration/meaning in 22 display, hint "Tap card to reveal meaning".
- Rating section: "How well did you remember this?" + 4 Rating Buttons (Again / Hard / Good / Easy).
- Footer: mono hint "Space · Show answer" (keyboard shortcut hint; show on web/hardware keyboards).

### Progress (tab)
Title; hero "68% mastered" (64 display) with "+14% this week" chip and "Steady progress · 128 cards mastered"; "Cards reviewed" weekly bar chart (M–S, "42 total"); two stat tiles: STUDY STREAK 7 days, STUDY TIME 4h 20m.

### Settings (tab)
Title; language selector (English / العربية / Bahasa); footer note "Private by default · Your data stays on this device."

### Brand
- **Wordmark**: Arabic حِفْظ (72, Amiri) over "Hifz" (54, Fraunces) and "Memorize with meaning" (14).
- **Logo**: 256×256 flashcard mark, green + gold on cream.

## Data model (SQLite, local only)
Schema v1 (`PRAGMA user_version`), implemented in `src/services/schema.ts`. No server; all state is in `hifz.db`. Differences from the original design frame: a `lessons` table was added (a deck row such as "Takbiratul Ihram" is a lesson that owns word/phrase/overall cards), and `cards` stores the full FSRS state (`ts-fsrs`) instead of SM-2 fields.

| Table | Purpose / key columns |
|---|---|
| `settings` | `key` PK, `value`, `updated_at`, `device_id` (language, onboarding flag, daily goal, reminder, content version) |
| `decks` | `id`, `kind` (`seed`/`custom`), `title`, `description`, `i18n` (JSON, en/id/ar), `icon`, `last_accessed_at` |
| `lessons` | `id`, `deck_id`, `position`, `title`, `subtitle`, `i18n`, `icon`, `active_mode` (`word`/`phrase`/`overall`, chosen pace) |
| `cards` | `id`, `deck_id`, `lesson_id`, `mode`, `position`, `front`, `back`, FSRS: `due`, `stability`, `difficulty`, `elapsed_days`, `scheduled_days`, `learning_steps`, `reps`, `lapses`, `state`, `last_review` |
| `card_content` | `card_id` PK, `arabic`, `transliteration`, `translation_en`, `translation_id`, `translation_ar`, `audio_uri` |
| `reviews` | review log: `card_id`, `rating`, `state`, FSRS log fields, `reviewed_at`, `next_due_at`, `duration_ms` |

Relations: decks 1—N lessons; lessons 1—N cards; cards 1—1 card_content (seeded prayer cards only); cards 1—N reviews.

- Seed content (`src/content/`) is upserted on launch when `content_version` changes; progress columns are never overwritten.
- "Mastered" card = state Review with stability ≥ 14 days (`MASTERED_STABILITY_DAYS`). A lesson is mastered when every card of its chosen pace is mastered.
- Custom deck cards are single-card lessons (`mode = overall`, no `card_content`; `front`/`back` are shown instead).

## Implementation notes
- Use the tokens above as theme constants; do not hardcode hex values in components.
- Arabic text must use Amiri and render RTL; the language setting supports EN, ID and AR (AR implies RTL layout).
- Build the reusable components above as shared components first, then screens.
- Follow `AGENTS.md` architecture: screens → hooks (TanStack Query) → services (expo-sqlite).
