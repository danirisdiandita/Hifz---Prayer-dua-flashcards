import type { Localized } from '@/content/types';
import { uid } from '@/lib/ids';

import { getDb } from './database';
import { emptyCardRow, MASTERED_STABILITY_DAYS } from './srs';
import type { DeckSummary, LocalizedText } from './types';

type DeckRow = {
  id: string;
  kind: 'seed' | 'custom';
  title: string;
  description: string;
  i18n: string | null;
  icon: string;
  last_accessed_at: number | null;
  lesson_count: number;
  mastered_lessons: number;
  due_count: number;
};

export function parseI18n(raw: string | null, key: 'title' | 'subtitle' | 'description'): Localized | null {
  if (!raw) return null;
  try {
    return (JSON.parse(raw) as Record<string, Localized>)[key] ?? null;
  } catch {
    return null;
  }
}

function toSummary(row: DeckRow): DeckSummary {
  const title: LocalizedText = { fallback: row.title, i18n: parseI18n(row.i18n, 'title') };
  const description: LocalizedText = {
    fallback: row.description,
    i18n: parseI18n(row.i18n, 'description'),
  };
  return {
    id: row.id,
    kind: row.kind,
    title,
    description,
    icon: row.icon,
    lessonCount: row.lesson_count,
    masteredLessons: row.mastered_lessons,
    dueCount: row.due_count,
    lastAccessedAt: row.last_accessed_at,
    percentMastered: row.lesson_count
      ? Math.round((row.mastered_lessons / row.lesson_count) * 100)
      : 0,
  };
}

const DECK_SELECT = `
SELECT d.id, d.kind, d.title, d.description, d.i18n, d.icon, d.last_accessed_at,
  (SELECT COUNT(*) FROM lessons l WHERE l.deck_id = d.id) AS lesson_count,
  (SELECT COUNT(*) FROM lessons l WHERE l.deck_id = d.id AND l.active_mode IS NOT NULL
     AND EXISTS (SELECT 1 FROM cards c WHERE c.lesson_id = l.id AND c.mode = l.active_mode)
     AND NOT EXISTS (SELECT 1 FROM cards c WHERE c.lesson_id = l.id AND c.mode = l.active_mode
        AND NOT (c.state = 2 AND c.stability >= ${MASTERED_STABILITY_DAYS}))) AS mastered_lessons,
  (SELECT COUNT(*) FROM cards c JOIN lessons l ON l.id = c.lesson_id AND c.mode = l.active_mode
     WHERE c.deck_id = d.id AND c.due <= ?) AS due_count
FROM decks d
`;

export async function listDecks(): Promise<DeckSummary[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DeckRow>(
    `${DECK_SELECT} WHERE d.archived = 0 ORDER BY d.position, d.created_at`,
    Date.now(),
  );
  return rows.map(toSummary);
}

export async function getDeck(id: string): Promise<DeckSummary | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<DeckRow>(`${DECK_SELECT} WHERE d.id = ?`, Date.now(), id);
  return row ? toSummary(row) : null;
}

export async function touchDeck(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE decks SET last_accessed_at = ? WHERE id = ?', Date.now(), id);
}

export type NewCardInput = { front: string; back: string };

async function insertCustomCard(
  deckId: string,
  position: number,
  input: NewCardInput,
  now: number,
): Promise<string> {
  const db = await getDb();
  const lessonId = uid('lesson');
  const cardId = uid('card');
  const fresh = emptyCardRow(now);
  await db.runAsync(
    `INSERT INTO lessons (id, deck_id, position, title, subtitle, icon, active_mode)
     VALUES (?, ?, ?, ?, ?, 'file-text', 'overall')`,
    lessonId,
    deckId,
    position,
    input.front,
    input.back,
  );
  await db.runAsync(
    `INSERT INTO cards
      (id, deck_id, lesson_id, mode, position, front, back, due, stability, difficulty,
       elapsed_days, scheduled_days, learning_steps, reps, lapses, state, last_review)
     VALUES (?, ?, ?, 'overall', 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    cardId,
    deckId,
    lessonId,
    input.front,
    input.back,
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
  return cardId;
}

export type CreateDeckInput = {
  title: string;
  description: string;
  cards: NewCardInput[];
};

export async function createDeck(input: CreateDeckInput): Promise<string> {
  const db = await getDb();
  const id = uid('deck');
  const now = Date.now();
  const [{ next }] = await db.getAllAsync<{ next: number }>(
    'SELECT COALESCE(MAX(position), 0) + 1 AS next FROM decks',
  );
  await db.withTransactionAsync(async () => {
    await db.runAsync(
      `INSERT INTO decks (id, kind, title, description, icon, language, position, created_at, last_accessed_at)
       VALUES (?, 'custom', ?, ?, 'file-text', 'en', ?, ?, ?)`,
      id,
      input.title.trim(),
      input.description.trim(),
      next,
      now,
      now,
    );
    for (let i = 0; i < input.cards.length; i++) {
      await insertCustomCard(id, i, input.cards[i], now);
    }
  });
  return id;
}

export async function addCardToDeck(deckId: string, input: NewCardInput): Promise<void> {
  const db = await getDb();
  await db.withTransactionAsync(async () => {
    const [{ next }] = await db.getAllAsync<{ next: number }>(
      'SELECT COALESCE(MAX(position), -1) + 1 AS next FROM lessons WHERE deck_id = ?',
      deckId,
    );
    await insertCustomCard(deckId, next, input, Date.now());
  });
}

export async function deleteLesson(lessonId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM lessons WHERE id = ?', lessonId);
}

export async function deleteDeck(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync("DELETE FROM decks WHERE id = ? AND kind = 'custom'", id);
}
