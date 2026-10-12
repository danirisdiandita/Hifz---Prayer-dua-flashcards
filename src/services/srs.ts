import { createEmptyCard, fsrs, Rating, State, type Card, type Grade } from 'ts-fsrs';

export type RatingName = 'again' | 'hard' | 'good' | 'easy';

export const RATING_ORDER: RatingName[] = ['again', 'hard', 'good', 'easy'];

const GRADE: Record<RatingName, Grade> = {
  again: Rating.Again,
  hard: Rating.Hard,
  good: Rating.Good,
  easy: Rating.Easy,
};

export type CardRow = {
  due: number;
  stability: number;
  difficulty: number;
  elapsed_days: number;
  scheduled_days: number;
  learning_steps: number;
  reps: number;
  lapses: number;
  state: number;
  last_review: number | null;
};

export type SchedulePatch = CardRow & { next_due_at: number };

const scheduler = fsrs();

export const MASTERED_STABILITY_DAYS = 14;

export function emptyCardRow(now: number): CardRow {
  const card = createEmptyCard(new Date(now));
  return fromCard(card);
}

function toCard(row: CardRow): Card {
  return {
    due: new Date(row.due),
    stability: row.stability,
    difficulty: row.difficulty,
    elapsed_days: row.elapsed_days,
    scheduled_days: row.scheduled_days,
    learning_steps: row.learning_steps,
    reps: row.reps,
    lapses: row.lapses,
    state: row.state as State,
    last_review: row.last_review == null ? undefined : new Date(row.last_review),
  };
}

function fromCard(card: Card): CardRow {
  return {
    due: card.due.getTime(),
    stability: card.stability,
    difficulty: card.difficulty,
    elapsed_days: card.elapsed_days,
    scheduled_days: card.scheduled_days,
    learning_steps: card.learning_steps,
    reps: card.reps,
    lapses: card.lapses,
    state: card.state,
    last_review: card.last_review ? card.last_review.getTime() : null,
  };
}

export function applyRating(row: CardRow, rating: RatingName, now: number) {
  const result = scheduler.next(toCard(row), new Date(now), GRADE[rating]);
  return {
    card: fromCard(result.card),
    log: {
      rating: result.log.rating as number,
      state: result.log.state as number,
      due: result.log.due.getTime(),
      stability: result.log.stability,
      difficulty: result.log.difficulty,
      elapsed_days: result.log.elapsed_days,
      scheduled_days: result.log.scheduled_days,
      learning_steps: result.log.learning_steps,
    },
  };
}

export function previewIntervals(row: CardRow, now: number): Record<RatingName, number> {
  const record = scheduler.repeat(toCard(row), new Date(now));
  const out = {} as Record<RatingName, number>;
  for (const name of RATING_ORDER) {
    out[name] = record[GRADE[name]].card.due.getTime() - now;
  }
  return out;
}

export function formatInterval(ms: number): string {
  const minutes = Math.max(1, Math.round(ms / 60000));
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d`;
  const months = Math.round(days / 30);
  if (months < 12) return `${months}mo`;
  return `${Math.round((days / 365) * 10) / 10}y`;
}
