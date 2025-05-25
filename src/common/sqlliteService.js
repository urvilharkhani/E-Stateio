import * as SQLite from 'expo-sqlite';

let dbPromise = null;
async function getDb() {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('app_data.db');
    const db = await dbPromise;
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS favorites (
        id TEXT PRIMARY KEY NOT NULL,
        data TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        email TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY NOT NULL,
        property_id TEXT NOT NULL,
        sender TEXT NOT NULL,
        text TEXT NOT NULL,
        timestamp TEXT NOT NULL
      );
    `);
    return db;
  }
  return dbPromise;
}

// Favorites Logic
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

// User Logic
export const signUpUser = async ({ name, email, phone, password }) => {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO users (email, name, phone, password) VALUES (?, ?, ?, ?)',
    [email, name, phone, password]
  );
};

export const validateUserLogin = async (email, password) => {
  const db = await getDb();
  const row = await db.getFirstAsync(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
  return row;
};

export const getUserProfile = async (email) => {
  const db = await getDb();
  const row = await db.getFirstAsync('SELECT * FROM users WHERE email = ?', email);
  return row;
};

export const updateUserProfile = async ({ email, name, phone }) => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE users SET name = ?, phone = ? WHERE email = ?',
    [name, phone, email]
  );
};

// Chat Message Logic
export const saveMessage = async ({ id, property_id, sender, text, timestamp }) => {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO messages (id, property_id, sender, text, timestamp) VALUES (?, ?, ?, ?, ?)',
    [id, property_id, sender, text, timestamp]
  );
};

export const getMessagesForProperty = async (property_id) => {
  const db = await getDb();
  return await db.getAllAsync(
    'SELECT * FROM messages WHERE property_id = ? ORDER BY timestamp',
    [property_id]
  );
};
export { getDb };