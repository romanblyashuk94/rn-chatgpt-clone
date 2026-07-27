import { Paths } from "expo-file-system";
import { SQLiteDatabase } from "expo-sqlite";
import { Chat, Message } from "./interfaces";

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  console.log("Paths.document", Paths.document);

  const DATABASE_VERSION = 1;
  let result = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );

  let currentDbVersion = result?.user_version ?? 0;

  if (currentDbVersion >= DATABASE_VERSION) {
    console.log("DB is up to date");
    return;
  }

  if (currentDbVersion === 0) {
    await db.execAsync(`
    PRAGMA journal_mode = 'wal';
    CREATE TABLE chats (
      id INTEGER PRIMARY KEY NOT NULL, 
      title TEXT NOT NULL
    );

    CREATE TABLE messages (
      id INTEGER PRIMARY KEY NOT NULL, 
      chat_id INTEGER NOT NULL, 
      content TEXT NOT NULL, 
      imageUrl TEXT, 
      role TEXT, 
      prompt TEXT, 
      FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
    );
    `);

    console.log("DB migrated to version 1");

    currentDbVersion = 1;
  }
  // if (currentDbVersion === 1) {
  //   Add more migrations
  // }
  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}

export const addChat = async (db: SQLiteDatabase, title: string) => {
  return await db.runAsync("INSERT INTO chats (title) VALUES (?)", title);
};

export const getChats = async (db: SQLiteDatabase) => {
  const result = await db.getAllAsync<Chat>("SELECT * FROM chats");
  return result;
};

export const addMessage = async (
  db: SQLiteDatabase,
  chatId: number,
  { content, imageUrl, role, prompt }: Message,
) => {
  await db.runAsync(
    "INSERT INTO messages (chat_id, content, imageUrl, role, prompt) VALUES (?, ?, ?, ?, ?)",
    chatId,
    content,
    imageUrl || "",
    role,
    prompt || "",
  );
};

export const getMessages = async (db: SQLiteDatabase, chatId: number) => {
  return await db.getAllAsync<Message>(
    "SELECT * FROM messages WHERE chat_id = ?",
    chatId,
  );
};

export const deleteChat = async (db: SQLiteDatabase, chatId: number) => {
  await db.runAsync("DELETE FROM chats WHERE id = ?", chatId);
};

export const renameChat = async (
  db: SQLiteDatabase,
  chatId: number,
  title: string,
) => {
  await db.runAsync("UPDATE chats SET title = ? WHERE id = ?", title, chatId);
};
