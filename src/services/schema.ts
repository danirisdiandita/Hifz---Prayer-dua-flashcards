import type { SQLiteDatabase } from 'expo-sqlite';

export const SCHEMA_VERSION = 1;

const MIGRATION_V1 = `
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY NOT NULL,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL,
  device_id TEXT
);

CREATE TABLE IF NOT EXISTS decks (
  id TEXT PRIMARY KEY NOT NULL,
  kind TEXT NOT NULL DEFAULT 'custom',
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  i18n TEXT,
  icon TEXT NOT NULL DEFAULT 'book-open',
  language TEXT NOT NULL DEFAULT 'ar',
  position INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  last_accessed_at INTEGER,
  archived INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS lessons (
  id TEXT PRIMARY KEY NOT NULL,
  deck_id TEXT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL DEFAULT '',
  i18n TEXT,
  icon TEXT NOT NULL DEFAULT 'book-open',
  active_mode TEXT
);

CREATE TABLE IF NOT EXISTS cards (
  id TEXT PRIMARY KEY NOT NULL,
  deck_id TEXT NOT NULL REFERENCES decks(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  mode TEXT NOT NULL,
  position INTEGER NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL DEFAULT '',
  due INTEGER NOT NULL,
  stability REAL NOT NULL DEFAULT 0,
  difficulty REAL NOT NULL DEFAULT 0,
  elapsed_days INTEGER NOT NULL DEFAULT 0,
  scheduled_days INTEGER NOT NULL DEFAULT 0,
  learning_steps INTEGER NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  lapses INTEGER NOT NULL DEFAULT 0,
  state INTEGER NOT NULL DEFAULT 0,
  last_review INTEGER
);

CREATE TABLE IF NOT EXISTS card_content (
  card_id TEXT PRIMARY KEY NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  arabic TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  translation_en TEXT NOT NULL,
  translation_id TEXT NOT NULL,
  translation_ar TEXT NOT NULL,
  audio_uri TEXT
);

CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY NOT NULL,
  card_id TEXT NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL,
  state INTEGER NOT NULL,
  due INTEGER NOT NULL,
  stability REAL NOT NULL,
  difficulty REAL NOT NULL,
  elapsed_days INTEGER NOT NULL,
  scheduled_days INTEGER NOT NULL,
  learning_steps INTEGER NOT NULL,
  reviewed_at INTEGER NOT NULL,
  next_due_at INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_lessons_deck ON lessons(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_deck ON cards(deck_id);
CREATE INDEX IF NOT EXISTS idx_cards_lesson ON cards(lesson_id, mode);
CREATE INDEX IF NOT EXISTS idx_cards_due ON cards(due);
CREATE INDEX IF NOT EXISTS idx_reviews_card ON reviews(card_id);
CREATE INDEX IF NOT EXISTS idx_reviews_at ON reviews(reviewed_at);
`;

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  const current = row?.user_version ?? 0;
  if (current >= SCHEMA_VERSION) return;

  if (current < 1) {
    await db.execAsync(MIGRATION_V1);
  }

  await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
}
