import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const TOKEN_TTL = "7d";

export interface JwtPayload {
  sub: number;
  email: string;
}

export async function seedUsersFromEnv() {
  const raw = process.env.USERS_JSON;
  if (!raw) return;

  let users: Array<{ email: string; password: string }> = [];
  try {
    users = JSON.parse(raw);
  } catch (err) {
    console.warn("[auth] USERS_JSON parse failed, skip seeding", err);
    return;
  }

  for (const u of users) {
    if (!u.email || !u.password) continue;
    const existing = await pool.query("select id from users where email=?", [u.email]);
    if (existing.rows.length > 0) continue;
    const hash = await bcrypt.hash(u.password, 10);
    await pool.query("insert into users(email, password_hash) values (?,?)", [u.email, hash]);
    console.log(`[auth] seeded user ${u.email}`);
  }
}

export async function findUserByEmail(email: string) {
  const res = await pool.query("select id, email, password_hash from users where email=?", [email]);
  return res.rows[0] as { id: number; email: string; password_hash: string } | undefined;
}

export function signToken(user: { id: number; email: string }) {
  const token = jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, { expiresIn: TOKEN_TTL });
  return token;
}

export function verifyToken(token?: string): JwtPayload | null {
  if (!token) return null;
  try {
    return jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
  } catch (_err) {
    return null;
  }
}

