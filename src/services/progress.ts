import { getDb } from './database';
import { MASTERED_STABILITY_DAYS } from './srs';

export type ProgressSummary = {
  percentMastered: number;
  weeklyDelta: number;
  masteredCards: number;
  activeCards: number;
  weekCounts: number[];
  todayIndex: number;
  weekTotal: number;
  todayCount: number;
  streakDays: number;
  totalStudyMs: number;
};

const DAY_MS = 86400000;

function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export async function getProgress(): Promise<ProgressSummary> {
  const db = await getDb();
  const now = Date.now();
  const today = startOfDay(now);
  const mondayOffset = (new Date(now).getDay() + 6) % 7;
  const weekStart = today - mondayOffset * DAY_MS;

  const counts = await db.getFirstAsync<{ active: number | null; mastered: number | null }>(
    `SELECT COUNT(*) AS active,
       SUM(CASE WHEN c.state = 2 AND c.stability >= ${MASTERED_STABILITY_DAYS} THEN 1 ELSE 0 END) AS mastered
     FROM cards c JOIN lessons l ON l.id = c.lesson_id AND c.mode = l.active_mode`,
  );
  const active = counts?.active ?? 0;
  const mastered = counts?.mastered ?? 0;

  const weekAgo = now - 7 * DAY_MS;
  const before = await db.getFirstAsync<{ n: number }>(
    `SELECT COUNT(*) AS n FROM cards c JOIN lessons l ON l.id = c.lesson_id AND c.mode = l.active_mode
     WHERE COALESCE((SELECT r.stability FROM reviews r WHERE r.card_id = c.id AND r.reviewed_at <= ?
        ORDER BY r.reviewed_at DESC LIMIT 1), 0) >= ${MASTERED_STABILITY_DAYS}
       AND (SELECT r.state FROM reviews r WHERE r.card_id = c.id AND r.reviewed_at <= ?
        ORDER BY r.reviewed_at DESC LIMIT 1) IS NOT NULL`,
    weekAgo,
    weekAgo,
  );
  const percent = active ? Math.round((mastered / active) * 100) : 0;
  const delta = active ? Math.round(((mastered - (before?.n ?? 0)) / active) * 100) : 0;

  const recent = await db.getAllAsync<{ reviewed_at: number; duration_ms: number }>(
    'SELECT reviewed_at, duration_ms FROM reviews WHERE reviewed_at >= ?',
    today - 400 * DAY_MS,
  );
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];
  const days = new Set<number>();
  for (const r of recent) {
    const day = startOfDay(r.reviewed_at);
    days.add(day);
    if (day >= weekStart && day < weekStart + 7 * DAY_MS) {
      weekCounts[Math.round((day - weekStart) / DAY_MS)]++;
    }
  }

  let streak = 0;
  let cursor = days.has(today) ? today : today - DAY_MS;
  while (days.has(cursor)) {
    streak++;
    cursor -= DAY_MS;
  }

  const total = await db.getFirstAsync<{ ms: number | null }>(
    'SELECT SUM(duration_ms) AS ms FROM reviews',
  );

  return {
    percentMastered: percent,
    weeklyDelta: delta,
    masteredCards: mastered,
    activeCards: active,
    weekCounts,
    todayIndex: mondayOffset,
    weekTotal: weekCounts.reduce((a, b) => a + b, 0),
    todayCount: weekCounts[mondayOffset],
    streakDays: streak,
    totalStudyMs: total?.ms ?? 0,
  };
}
