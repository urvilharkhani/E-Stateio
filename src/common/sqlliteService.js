import * as SQLite from 'expo-sqlite';

let dbPromise = null;
async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('favorites.db');
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );
    `);
    return db;
  }
  return dbPromise;
}

export const getFavorites = async () => {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT * FROM favorites');
  return rows.map(row => ({ id: row.id, ...JSON.parse(row.data) }));
};

export const addFavorite = async (item) => {
  const db = await getDb();
  await db.runAsync(
    'INSERT OR REPLACE INTO favorites (id, data) VALUES (?, ?)',
    item.id.toString(),
    JSON.stringify(item)
  );
};

export const removeFavorite = async (itemId) => {
  const db = await getDb();
  await db.runAsync('DELETE FROM favorites WHERE id = ?', itemId.toString());
};

export const isFavorited = async (itemId) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT id FROM favorites WHERE id = ?', itemId.toString());
  return !!row;
};

// To run a sample/test, call testDbOperations() from an async context (not at the top level).
export async function testDbOperations() {
  const db = await SQLite.openDatabaseAsync('test.db');

  // Bulk queries
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
    INSERT INTO test (value, intValue) VALUES ('test3', 789);
  `);

  // Write operation
  const result = await db.runAsync('INSERT INTO test (value, intValue) VALUES (?, ?)', 'aaa', 100);
  console.log(result.lastInsertRowId, result.changes);
  await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', 999, 'aaa');
  await db.runAsync('UPDATE test SET intValue = ? WHERE value = ?', [999, 'aaa']);
  await db.runAsync('DELETE FROM test WHERE value = $value', { $value: 'aaa' });

  // Single row
  const firstRow = await db.getFirstAsync('SELECT * FROM test');
  console.log(firstRow.id, firstRow.value, firstRow.intValue);

  // All rows
  const allRows = await db.getAllAsync('SELECT * FROM test');
  for (const row of allRows) {
    console.log(row.id, row.value, row.intValue);
  }

  // Cursor/iterator
  for await (const row of db.getEachAsync('SELECT * FROM test')) {
    console.log(row.id, row.value, row.intValue);
  }
}
