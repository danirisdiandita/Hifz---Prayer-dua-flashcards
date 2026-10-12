import * as SQLite from 'expo-sqlite';

import { migrate } from './schema';
import { seedContent } from './seed';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

async function init(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync('hifz.db');
  await db.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await migrate(db);
  await seedContent(db);
  return db;
}

export function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = init().catch((error) => {
      dbPromise = null;
      throw error;
    });
  }
  return dbPromise;
}
