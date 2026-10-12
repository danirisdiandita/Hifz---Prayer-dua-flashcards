import { getDb } from './database';

export type Settings = {
  dailyGoal: number;
  reminderEnabled: boolean;
  reminderHour: number;
  reminderMinute: number;
};

export const DAILY_GOAL_OPTIONS = [5, 10, 20, 30, 50];

const DEFAULTS: Record<string, string> = {
  dailyGoal: '10',
  reminderEnabled: '0',
  reminderHour: '19',
  reminderMinute: '0',
};

export async function getSettings(): Promise<Settings> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ key: string; value: string }>('SELECT key, value FROM settings');
  const map: Record<string, string> = { ...DEFAULTS };
  for (const row of rows) map[row.key] = row.value;
  return {
    dailyGoal: Number(map.dailyGoal),
    reminderEnabled: map.reminderEnabled === '1',
    reminderHour: Number(map.reminderHour),
    reminderMinute: Number(map.reminderMinute),
  };
}

async function put(key: string, value: string) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    key,
    value,
    Date.now(),
  );
}

export const setDailyGoal = (goal: number) => put('dailyGoal', String(goal));
export const setReminder = async (enabled: boolean, hour: number, minute: number) => {
  await put('reminderEnabled', enabled ? '1' : '0');
  await put('reminderHour', String(hour));
  await put('reminderMinute', String(minute));
};
