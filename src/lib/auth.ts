// src/lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ensureDb } from './db';
import { User } from '@/models/User';

type SessionPayload = { sub: string; email: string };

const JWT_SECRET: string =
  process.env.JWT_SECRET ?? (() => { throw new Error('JWT_SECRET is not set. Add it to .env.local'); })();

export async function validateUser(email: string, password: string) {
  await ensureDb();

  // normalize input a bit
  const normalized = email.trim();

  const user = await User.findOne({
    where: { email: normalized },               // exact match (no import from 'sequelize')
    attributes: ['id', 'email', 'password_hash']
  });

  if (!user || !user.password_hash) return null;

  const ok = await bcrypt.compare(password, user.password_hash);
  return ok ? user : null;
}

export function signSession(user: User) {
  const payload: SessionPayload = { sub: user.id, email: user.email ?? '' };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifySession(token: string): SessionPayload {
  return jwt.verify(token, JWT_SECRET) as SessionPayload;
}

export function safeVerifySession(token?: string | null): SessionPayload | null {
  if (!token) return null;
  try { return jwt.verify(token, JWT_SECRET) as SessionPayload; } catch { return null; }
}
