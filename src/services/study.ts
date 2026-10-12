import type { Localized } from '@/content/types';
import { uid } from '@/lib/ids';

import { getDb } from './database';
import { parseI18n } from './decks';
import { applyRating, type CardRow, type RatingName } from './srs';
import type { StudyCard, StudyMode } from './types';

export const LEARN_AHEAD_MS = 20 * 60 * 1000;

type StudyRow = CardRow & {
  id: string;
  lesson_id: string;
  deck_id: string;
  mode: StudyMode;
  position: number;
  front: string;
  back: string;
  arabic: string | null;
  transliteration: string | null;
  translation_en: string | null;
  translation_id: string | null;
  translation_ar: string | null;
  lesson_title: string;
  lesson_i18n: string | null;
  deck_title: string;
  deck_i18n: string | null;
};

const STUDY_SELECT = `
SELECT c.id, c.lesson_id, c.deck_id, c.mode, c.position, c.front, c.back,
  c.due, c.stability, c.difficulty, c.elapsed_days, c.scheduled_days, c.learning_steps,
  c.reps, c.lapses, c.state, c.last_review,
  cc.arabic, cc.transliteration, cc.translation_en, cc.translation_id, cc.translation_ar,
  l.title AS lesson_title, l.i18n AS lesson_i18n, d.title AS deck_title, d.i18n AS deck_i18n
FROM cards c
JOIN lessons l ON l.id = c.lesson_id AND c.mode = l.active_mode
JOIN decks d ON d.id = c.deck_id
LEFT JOIN card_content cc ON cc.card_id = c.id
`;

function toStudyCard(row: StudyRow): StudyCard {
  const meaning: Localized | null =
    row.translation_en != null
      ? { en: row.translation_en, id: row.translation_id ?? '', ar: row.translation_ar ?? '' }
      : null;
  return {
    id: row.id,
    lessonId: row.lesson_id,
    deckId: row.deck_id,
    lessonTitle: { fallback: row.lesson_title, i18n: parseI18n(row.lesson_i18n, 'title') },
    deckTitle: { fallback: row.deck_title, i18n: parseI18n(row.deck_i18n, 'title') },
    mode: row.mode,
    position: row.position,
    front: row.front,
    back: row.back,
    arabic: row.arabic,
    transliteration: row.transliteration,
    meaning,
    row: {
      due: row.due,
      stability: row.stability,
      difficulty: row.difficulty,
      elapsed_days: row.elapsed_days,
      scheduled_days: row.scheduled_days,
      learning_steps: row.learning_steps,
      reps: row.reps,
      lapses: row.lapses,
      state: row.state,
      last_review: row.last_review,
    },
  };
}

export type StudyScope = { lessonId: string } | { deckId: string };

export async function getStudyQueue(scope: StudyScope): Promise<StudyCard[]> {
  const db = await getDb();
  const now = Date.now();
  const filter = 'lessonId' in scope ? 'c.lesson_id = ?' : 'c.deck_id = ?';
  const arg = 'lessonId' in scope ? scope.lessonId : scope.deckId;
  const rows = await db.getAllAsync<StudyRow>(
    `${STUDY_SELECT}
     WHERE ${filter} AND c.due <= ?
     ORDER BY (c.state = 0) ASC, c.due ASC, l.position ASC, c.position ASC`,
    arg,
    now + LEARN_AHEAD_MS,
  );
  return rows.map(toStudyCard);
}

export type ReviewInput = {
  cardId: string;
  rating: RatingName;
  durationMs: number;
};

export async function reviewCard(input: ReviewInput): Promise<CardRow> {
  const db = await getDb();
  const now = Date.now();
  let updated!: CardRow;
  await db.withTransactionAsync(async () => {
    const row = await db.getFirstAsync<CardRow>(
      `SELECT due, stability, difficulty, elapsed_days, scheduled_days, learning_steps,
        reps, lapses, state, last_review FROM cards WHERE id = ?`,
      input.cardId,
    );
    if (!row) throw new Error(`Card not found: ${input.cardId}`);
    const { card, log } = applyRating(row, input.rating, now);
    updated = card;
    await db.runAsync(
      `UPDATE cards SET due = ?, stability = ?, difficulty = ?, elapsed_days = ?, scheduled_days = ?,
        learning_steps = ?, reps = ?, lapses = ?, state = ?, last_review = ? WHERE id = ?`,
      card.due,
      card.stability,
      card.difficulty,
      card.elapsed_days,
      card.scheduled_days,
      card.learning_steps,
      card.reps,
      card.lapses,
      card.state,
      card.last_review,
      input.cardId,
    );
    await db.runAsync(
      `INSERT INTO reviews
        (id, card_id, rating, state, due, stability, difficulty, elapsed_days, scheduled_days,
         learning_steps, reviewed_at, next_due_at, duration_ms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      uid('rev'),
      input.cardId,
      log.rating,
      log.state,
      log.due,
      log.stability,
      log.difficulty,
      log.elapsed_days,
      log.scheduled_days,
      log.learning_steps,
      now,
      card.due,
      Math.max(0, Math.round(input.durationMs)),
    );
  });
  return updated;
}
