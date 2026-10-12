import type { SQLiteDatabase } from 'expo-sqlite';

import { prayerDeck } from '@/content/prayers';
import { supplicationsDeck } from '@/content/supplications';
import type { DeckSeed } from '@/content/types';

import { emptyCardRow } from './srs';

export const CONTENT_VERSION = '2';

const DECKS: DeckSeed[] = [prayerDeck, supplicationsDeck];

async function seedDeck(db: SQLiteDatabase, deck: DeckSeed, position: number, now: number) {
  await db.runAsync(
    `INSERT INTO decks (id, kind, title, description, i18n, icon, language, position, created_at)
     VALUES (?, 'seed', ?, ?, ?, ?, 'ar', ?, ?)
     ON CONFLICT(id) DO UPDATE SET title = excluded.title, description = excluded.description,
       i18n = excluded.i18n, icon = excluded.icon, position = excluded.position`,
    deck.id,
    deck.title.en,
    deck.description.en,
    JSON.stringify({ title: deck.title, description: deck.description }),
    deck.icon,
    position,
    now,
  );

  const fresh = emptyCardRow(now);

  const insertCard = async (
    lessonId: string,
    cardId: string,
    mode: string,
    cardPosition: number,
    arabic: string,
    transliteration: string,
    meaning: { en: string; id: string; ar: string },
  ) => {
    await db.runAsync(
      `INSERT INTO cards
        (id, deck_id, lesson_id, mode, position, front, back, due, stability, difficulty,
         elapsed_days, scheduled_days, learning_steps, reps, lapses, state, last_review)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET front = excluded.front, back = excluded.back,
         position = excluded.position`,
      cardId,
      deck.id,
      lessonId,
      mode,
      cardPosition,
      arabic,
      meaning.en,
      fresh.due,
      fresh.stability,
      fresh.difficulty,
      fresh.elapsed_days,
      fresh.scheduled_days,
      fresh.learning_steps,
      fresh.reps,
      fresh.lapses,
      fresh.state,
      fresh.last_review,
    );
    await db.runAsync(
      `INSERT INTO card_content
        (card_id, arabic, transliteration, translation_en, translation_id, translation_ar)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(card_id) DO UPDATE SET arabic = excluded.arabic,
         transliteration = excluded.transliteration, translation_en = excluded.translation_en,
         translation_id = excluded.translation_id, translation_ar = excluded.translation_ar`,
      cardId,
      arabic,
      transliteration,
      meaning.en,
      meaning.id,
      meaning.ar,
    );
  };

  for (let s = 0; s < deck.segments.length; s++) {
    const segment = deck.segments[s];
    const lessonId = `${deck.id}:${segment.id}`;
    await db.runAsync(
      `INSERT INTO lessons (id, deck_id, position, title, subtitle, i18n, icon)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET position = excluded.position, title = excluded.title,
         subtitle = excluded.subtitle, i18n = excluded.i18n, icon = excluded.icon`,
      lessonId,
      deck.id,
      s,
      segment.title.en,
      segment.subtitle.en,
      JSON.stringify({ title: segment.title, subtitle: segment.subtitle }),
      segment.icon,
    );

    let wordIndex = 0;
    for (let p = 0; p < segment.phrases.length; p++) {
      const phrase = segment.phrases[p];
      for (const word of phrase.words) {
        await insertCard(
          lessonId,
          `${lessonId}:word:${wordIndex}`,
          'word',
          wordIndex,
          word.arabic,
          word.transliteration,
          word.meaning,
        );
        wordIndex++;
      }
      await insertCard(
        lessonId,
        `${lessonId}:phrase:${p}`,
        'phrase',
        p,
        phrase.arabic,
        phrase.transliteration,
        phrase.meaning,
      );
    }

    const join = (pick: (i: number) => string, sep = ' ') =>
      segment.phrases.map((_, i) => pick(i)).join(sep);
    await insertCard(
      lessonId,
      `${lessonId}:overall:0`,
      'overall',
      0,
      join((i) => segment.phrases[i].arabic),
      join((i) => segment.phrases[i].transliteration),
      {
        en: join((i) => segment.phrases[i].meaning.en, '. '),
        id: join((i) => segment.phrases[i].meaning.id, '. '),
        ar: join((i) => segment.phrases[i].meaning.ar, '. '),
      },
    );
  }
}

export async function seedContent(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'content_version'",
  );
  if (row?.value === CONTENT_VERSION) return;

  const now = Date.now();
  await db.withTransactionAsync(async () => {
    for (let i = 0; i < DECKS.length; i++) {
      await seedDeck(db, DECKS[i], i, now);
    }
    await db.runAsync(
      `INSERT INTO settings (key, value, updated_at) VALUES ('content_version', ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
      CONTENT_VERSION,
      now,
    );
  });
}
