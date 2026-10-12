import { getDb } from './database';
import { parseI18n } from './decks';
import { MASTERED_STABILITY_DAYS } from './srs';
import type { LessonStatus, LessonSummary, StudyMode } from './types';

type LessonRow = {
  id: string;
  deck_id: string;
  position: number;
  title: string;
  subtitle: string;
  i18n: string | null;
  icon: string;
  active_mode: StudyMode | null;
  total: number | null;
  mastered: number | null;
  started: number | null;
  due: number | null;
};

const LESSON_SELECT = `
SELECT l.id, l.deck_id, l.position, l.title, l.subtitle, l.i18n, l.icon, l.active_mode,
  COUNT(c.id) AS total,
  SUM(CASE WHEN c.state = 2 AND c.stability >= ${MASTERED_STABILITY_DAYS} THEN 1 ELSE 0 END) AS mastered,
  SUM(CASE WHEN c.state > 0 THEN 1 ELSE 0 END) AS started,
  SUM(CASE WHEN c.due <= ? THEN 1 ELSE 0 END) AS due
FROM lessons l
LEFT JOIN cards c ON c.lesson_id = l.id AND c.mode = l.active_mode
`;

function toSummary(row: LessonRow): LessonSummary {
  const total = row.total ?? 0;
  const mastered = row.mastered ?? 0;
  const started = row.started ?? 0;
  let status: LessonStatus = 'new';
  if (total > 0 && mastered === total) status = 'mastered';
  else if (started > 0) status = 'learning';
  return {
    id: row.id,
    deckId: row.deck_id,
    position: row.position,
    title: { fallback: row.title, i18n: parseI18n(row.i18n, 'title') },
    subtitle: { fallback: row.subtitle, i18n: parseI18n(row.i18n, 'subtitle') },
    icon: row.icon,
    activeMode: row.active_mode,
    totalCards: total,
    masteredCards: mastered,
    startedCards: started,
    dueCards: row.due ?? 0,
    status,
  };
}

export async function listLessons(deckId: string): Promise<LessonSummary[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<LessonRow>(
    `${LESSON_SELECT} WHERE l.deck_id = ? GROUP BY l.id ORDER BY l.position`,
    Date.now(),
    deckId,
  );
  return rows.map(toSummary);
}

export async function getLesson(id: string): Promise<LessonSummary | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<LessonRow>(
    `${LESSON_SELECT} WHERE l.id = ? GROUP BY l.id`,
    Date.now(),
    id,
  );
  return row ? toSummary(row) : null;
}

export type LessonPreview = {
  arabic: string;
  transliteration: string;
  meaning: { en: string; id: string; ar: string };
  counts: Record<StudyMode, number>;
};

export async function getLessonPreview(id: string): Promise<LessonPreview | null> {
  const db = await getDb();
  const overall = await db.getFirstAsync<{
    arabic: string;
    transliteration: string;
    translation_en: string;
    translation_id: string;
    translation_ar: string;
  }>(
    `SELECT cc.arabic, cc.transliteration, cc.translation_en, cc.translation_id, cc.translation_ar
     FROM cards c JOIN card_content cc ON cc.card_id = c.id
     WHERE c.lesson_id = ? AND c.mode = 'overall' LIMIT 1`,
    id,
  );
  const counts = await db.getAllAsync<{ mode: StudyMode; n: number }>(
    'SELECT mode, COUNT(*) AS n FROM cards WHERE lesson_id = ? GROUP BY mode',
    id,
  );
  if (!overall) return null;
  const byMode: Record<StudyMode, number> = { word: 0, phrase: 0, overall: 0 };
  for (const c of counts) byMode[c.mode] = c.n;
  return {
    arabic: overall.arabic,
    transliteration: overall.transliteration,
    meaning: { en: overall.translation_en, id: overall.translation_id, ar: overall.translation_ar },
    counts: byMode,
  };
}

export async function setLessonMode(id: string, mode: StudyMode): Promise<void> {
  const db = await getDb();
  await db.runAsync('UPDATE lessons SET active_mode = ? WHERE id = ?', mode, id);
}

export async function resetLesson(id: string): Promise<void> {
  const db = await getDb();
  const now = Date.now();
  await db.withTransactionAsync(async () => {
    await db.runAsync('DELETE FROM reviews WHERE card_id IN (SELECT id FROM cards WHERE lesson_id = ?)', id);
    await db.runAsync(
      `UPDATE cards SET due = ?, stability = 0, difficulty = 0, elapsed_days = 0, scheduled_days = 0,
        learning_steps = 0, reps = 0, lapses = 0, state = 0, last_review = NULL WHERE lesson_id = ?`,
      now,
      id,
    );
  });
}
