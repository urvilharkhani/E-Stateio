import * as SQLite from 'expo-sqlite';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

      CREATE TABLE IF NOT EXISTS notifications (
        id TEXT PRIMARY KEY NOT NULL,
        email TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        date TEXT NOT NULL,
        read INTEGER DEFAULT 0
      );
    `);

    const columns = await db.getAllAsync('PRAGMA table_info(users)');
    const hasProfileImage = columns.some(col => col.name === 'profile_image');
    if (!hasProfileImage) {
      await db.runAsync('ALTER TABLE users ADD COLUMN profile_image TEXT DEFAULT ""');
    }

    const notifCols = await db.getAllAsync('PRAGMA table_info(notifications)');
    const hasEmail = notifCols.some(col => col.name === 'email');
    if (!hasEmail) {
      await db.runAsync('ALTER TABLE notifications ADD COLUMN email TEXT DEFAULT ""');
    }

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

//  User Logic
export const signUpUser = async ({ name, email, phone, password, profile_image }) => {
  const db = await getDb();
  const defaultImage = profile_image || ''; 

  await db.runAsync(
    'INSERT INTO users (email, name, phone, password, profile_image) VALUES (?, ?, ?, ?, ?)',
    [email, name, phone, password, defaultImage]
  );
};

export const validateUserLogin = async (email, password) => {
  const db = await getDb();
  return await db.getFirstAsync(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  );
};

export const getUserProfile = async (email) => {
  const db = await getDb();
  return await db.getFirstAsync('SELECT * FROM users WHERE email = ?', email);
};

export const updateUserProfile = async ({ email, name, phone, profile_image }) => {
  const db = await getDb();
  await db.runAsync(
    'UPDATE users SET name = ?, phone = ?, profile_image = ? WHERE email = ?',
    [name, phone, profile_image || '', email]
  );
};

//  Chat Message Logic
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

//  Notifications Logic
export const saveNotification = async ({ id, type, title, message, date }) => {
  const db = await getDb();
  const email = await AsyncStorage.getItem('@logged_in_email');
  await db.runAsync(
    'INSERT OR REPLACE INTO notifications (id, email, type, title, message, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, email, type, title, message, date, 0]
  );
};

export const insertNotification = async ({ type = 'message', title, message, date }) => {
  const db = await getDb();
  const email = await AsyncStorage.getItem('@logged_in_email');
  const id = Date.now().toString();
  await db.runAsync(
    'INSERT INTO notifications (id, email, type, title, message, date, read) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, email, type, title, message, date, 0]
  );
};

export const getAllNotifications = async () => {
  const db = await getDb();
  const email = await AsyncStorage.getItem('@logged_in_email');
  return await db.getAllAsync(
    'SELECT * FROM notifications WHERE email = ? ORDER BY date DESC',
    [email]
  );
};

export const markNotificationAsRead = async (id) => {
  const db = await getDb();
  await db.runAsync('UPDATE notifications SET read = 1 WHERE id = ?', [id]);
};

export const clearAllNotifications = async () => {
  const db = await getDb();
  await db.runAsync('DELETE FROM notifications');
};

export const markAllNotificationsRead = async () => {
  const db = await getDb();
  const email = await AsyncStorage.getItem('@logged_in_email');
  await db.runAsync('UPDATE notifications SET read = 1 WHERE email = ?', [email]);
};

export const getUnreadNotificationCount = async () => {
  const db = await getDb();
  const email = await AsyncStorage.getItem('@logged_in_email');
  const rows = await db.getAllAsync(
    'SELECT * FROM notifications WHERE read = 0 AND email = ?',
    [email]
  );
  return rows.length;
};

export { getDb };
