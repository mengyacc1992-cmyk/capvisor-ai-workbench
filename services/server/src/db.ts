import Database from "better-sqlite3";
import { join } from "path";

const dbPath = process.env.DATABASE_PATH || join(process.cwd(), "capvisor.db");
export const db = new Database(dbPath);

// 兼容性：提供类似 Pool 的接口
export const pool = {
  query: (sql: string, params?: any[]) => {
    if (sql.trim().toLowerCase().startsWith("select")) {
      const stmt = db.prepare(sql);
      const rows = params ? stmt.all(...params) : stmt.all();
      return Promise.resolve({ rows });
    } else {
      const stmt = db.prepare(sql);
      const result = params ? stmt.run(...params) : stmt.run();
      return Promise.resolve({ rows: [], rowCount: result.changes || 0 });
    }
  },
};

export async function ensureTables() {
  db.exec(`
    create table if not exists users (
      id integer primary key autoincrement,
      email text unique not null,
      password_hash text not null,
      created_at text not null default (datetime('now'))
    );

    create table if not exists generation_logs (
      id integer primary key autoincrement,
      user_id integer references users(id),
      params text,
      topic text,
      stream text,
      created_at text not null default (datetime('now'))
    );
  `);
}
